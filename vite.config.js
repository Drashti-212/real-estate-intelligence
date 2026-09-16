import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function copilotApi(env) {
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
        if (!useOllama && !env.OPENAI_API_KEY && !env.GEMINI_API_KEY) {
          response.statusCode = 503;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "Copilot is not configured. Set GEMINI_API_KEY or OPENAI_API_KEY before starting Vite." }));
          return;
        }

        const useGemini = !useOllama && Boolean(env.GEMINI_API_KEY) && env.AI_PROVIDER !== "openai";
        const model = useOllama
          ? (env.OLLAMA_MODEL || "qwen2.5:3b")
          : useGemini
            ? (env.GEMINI_MODEL || "gemini-2.0-flash")
            : (env.OPENAI_MODEL || "gpt-4o-mini");
        const endpoint = useOllama
          ? `${env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"}/api/chat`
          : useGemini
          ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`
          : `${env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`;
        const systemPrompt = "You are a read-only real-estate portfolio copilot. Use only the supplied dashboard context. Never invent values. State when data is unavailable. Return JSON with exactly: answer (string) and sources (array of strings). Mention that data is sample/calculated when relevant. Keep answers concise.";
        const userPrompt = JSON.stringify({ question: body.question.trim(), context: body.context });
        let upstream;
        try {
          upstream = await fetch(endpoint, {
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
        } catch {
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: "The model provider could not be reached." }));
          return;
        }

        if (!upstream.ok) {
          const providerError = await upstream.text();
          let detail = "";
          try {
            const parsedError = JSON.parse(providerError);
            detail = parsedError.error?.message || parsedError.message || "";
          } catch {
            detail = "";
          }
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({
            error: detail
              ? `Model provider returned HTTP ${upstream.status}: ${detail}`
              : `Model provider returned HTTP ${upstream.status}.`,
          }));
          return;
        }

        const completion = await upstream.json();
        const content = useOllama
          ? completion.message?.content
          : useGemini
          ? completion.candidates?.[0]?.content?.parts?.[0]?.text
          : completion.choices?.[0]?.message?.content;
        let result;
        try {
          result = JSON.parse(content || "");
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
