import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";

const memoryPath = path.resolve(process.cwd(), "data/chatbot-memory.json");
const logsPath = path.resolve(process.cwd(), "data/chatbot-logs.jsonl");

async function loadChatbotMemory() {
  try {
    return JSON.parse(await readFile(memoryPath, "utf8"));
  } catch {
    return { version: 1, facts: [], preferences: [], instructions: [] };
  }
}

function writeChatbotLog(entry) {
  return appendFile(logsPath, `${JSON.stringify({ timestamp: new Date().toISOString(), ...entry })}\n`);
}

function formatProviderError(error) {
  const message = error?.message || "The model provider could not be reached.";
  if (/expiredtoken|security token included in the request is expired/i.test(message)) {
    return "AWS credentials expired. Refresh the default AWS credentials or run `aws sso login --profile <profile>` if using SSO, then restart Vite.";
  }
  return message;
}

function copilotApi(env) {
  const useBedrock = env.AI_PROVIDER === "bedrock" || (
    !env.OPENAI_API_KEY && !env.GEMINI_API_KEY && env.AWS_REGION && env.BEDROCK_MODEL_ID
  );
  const bedrockClient = useBedrock ? new BedrockRuntimeClient({ region: env.AWS_REGION }) : null;
  const chatbotMemory = loadChatbotMemory();

  return {
    name: "copilot-api",
    configureServer(server) {
      server.middlewares.use("/api/copilot", async (request, response) => {
        if (request.method !== "POST") {
          response.statusCode = 405;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "POST is required." }));
          return;
        }

        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        let body;
        try {
          body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        } catch {
          response.statusCode = 400;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "Request body must be valid JSON." }));
          return;
        }

        if (typeof body.question !== "string" || !body.question.trim() || !body.context) {
          response.statusCode = 400;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "A question and dashboard context are required." }));
          return;
        }

        const useOllama = env.AI_PROVIDER === "ollama";
        if (!useBedrock && !useOllama && !env.OPENAI_API_KEY && !env.GEMINI_API_KEY) {
          response.statusCode = 503;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "Copilot is not configured. Set AWS_REGION and BEDROCK_MODEL_ID, or configure another provider before starting Vite." }));
          return;
        }

        const useGemini = !useOllama && Boolean(env.GEMINI_API_KEY) && env.AI_PROVIDER !== "openai";
        const model = useBedrock
          ? env.BEDROCK_MODEL_ID
          : useOllama
          ? (env.OLLAMA_MODEL || "qwen2.5:3b")
          : useGemini
            ? (env.GEMINI_MODEL || "gemini-2.0-flash")
            : (env.OPENAI_MODEL || "gpt-4o-mini");
        const endpoint = useBedrock
          ? null
          : useOllama
          ? `${env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"}/api/chat`
          : useGemini
          ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`
          : `${env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`;
        const memory = await chatbotMemory;
        const systemPrompt = `You are a read-only real-estate portfolio copilot. Use only the supplied dashboard context and the curated memory below. Never invent values. State when data is unavailable. Return JSON with exactly: answer (string) and sources (array of strings). Mention that data is sample/calculated when relevant. Keep answers concise.\n\nCurated chatbot memory:\n${JSON.stringify(memory)}`;
        const userPrompt = JSON.stringify({ question: body.question.trim(), context: body.context });
        let completion;
        try {
          if (useBedrock) {
            const bedrockResponse = await bedrockClient.send(new InvokeModelCommand({
              modelId: model,
              contentType: "application/json",
              accept: "application/json",
              body: JSON.stringify({
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userPrompt },
                ],
                max_tokens: 700,
                temperature: 0.1,
              }),
            }));
            completion = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
          } else {
            const upstream = await fetch(endpoint, {
            method: "POST",
            headers: useOllama || useGemini
              ? { "Content-Type": "application/json" }
              : { "Content-Type": "application/json", Authorization: `Bearer ${env.OPENAI_API_KEY}` },
            body: useOllama
              ? JSON.stringify({
                model,
                stream: false,
                format: "json",
                options: { temperature: 0.1 },
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
              })
              : useGemini
              ? JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
              })
              : JSON.stringify({
                model,
                temperature: 0.1,
                response_format: { type: "json_object" },
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
              }),
            });

            if (!upstream.ok) {
              const providerError = await upstream.text();
              let detail = "";
              try {
                const parsedError = JSON.parse(providerError);
                detail = parsedError.error?.message || parsedError.message || "";
              } catch {
                detail = "";
              }
              throw new Error(detail
                ? `Model provider returned HTTP ${upstream.status}: ${detail}`
                : `Model provider returned HTTP ${upstream.status}.`);
            }
            completion = await upstream.json();
          }
        } catch (error) {
          void writeChatbotLog({
            type: "error",
            provider: useBedrock ? "bedrock" : useOllama ? "ollama" : useGemini ? "gemini" : "openai",
            model,
            question: body.question.trim(),
            error: formatProviderError(error),
          });
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: formatProviderError(error) }));
          return;
        }

        const content = useBedrock
          ? completion.choices?.[0]?.message?.content
          : useOllama
          ? completion.message?.content
          : useGemini
          ? completion.candidates?.[0]?.content?.parts?.[0]?.text
          : completion.choices?.[0]?.message?.content;
        let result;
        try {
          const rawContent = content || "";
          try {
            result = JSON.parse(rawContent);
          } catch {
            const jsonStart = rawContent.indexOf("{");
            const jsonEnd = rawContent.lastIndexOf("}");
            result = JSON.parse(rawContent.slice(jsonStart, jsonEnd + 1));
          }
        } catch {
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "Model returned an invalid copilot response." }));
          return;
        }

        if (typeof result.answer !== "string" || !Array.isArray(result.sources)) {
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "Model response did not match the copilot schema." }));
          return;
        }

        void writeChatbotLog({
          type: "interaction",
          provider: useBedrock ? "bedrock" : useOllama ? "ollama" : useGemini ? "gemini" : "openai",
          model,
          question: body.question.trim(),
          answer: result.answer,
          sources: result.sources,
        });

        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ answer: result.answer, sources: result.sources }));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), copilotApi(env)],
  base: "./",
  };
});
