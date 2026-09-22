import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const modelId = process.env.BEDROCK_MODEL_ID || "openai.gpt-oss-120b-1:0";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

const reply = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

function parseModelResult(content) {
  const raw = typeof content === "string" ? content : "";
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("Model returned invalid JSON.");
    return JSON.parse(raw.slice(start, end + 1));
  }
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return reply(204, {});
  }

  let body;
  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "{}";
    body = JSON.parse(rawBody);
  } catch {
    return reply(400, { error: "Request body must be valid JSON." });
  }

  if (typeof body.question !== "string" || !body.question.trim() || !body.context) {
    return reply(400, { error: "A question and dashboard context are required." });
  }

  const systemPrompt = "You are a read-only real-estate portfolio copilot. Use only the supplied dashboard context. Never invent values. State when data is unavailable. Return JSON with exactly: answer (string) and sources (array of strings). Mention that data is sample/calculated when relevant. Keep answers concise.";
  const userPrompt = JSON.stringify({ question: body.question.trim(), context: body.context });

  try {
    const response = await client.send(new InvokeModelCommand({
      modelId,
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
    const completion = JSON.parse(new TextDecoder().decode(response.body));
    const result = parseModelResult(completion.choices?.[0]?.message?.content);
    if (typeof result.answer !== "string" || !Array.isArray(result.sources)) {
      return reply(502, { error: "Model response did not match the copilot schema." });
    }
    return reply(200, { answer: result.answer, sources: result.sources });
  } catch (error) {
    console.error("Bedrock copilot error", error);
    return reply(502, { error: "Bedrock request failed. Check the Lambda IAM permission and CloudWatch logs." });
  }
};
