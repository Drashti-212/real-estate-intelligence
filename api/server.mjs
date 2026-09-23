import express from "express";
import cors from "cors";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "ap-south-1"
});

app.post("/copilot", async (req, res) => {
  const { question, context } = req.body;

  if (!question || !context) {
    return res.status(400).json({
      error: "A question and dashboard context are required."
    });
  }

  const systemPrompt =
    "You are a read-only real-estate portfolio copilot. " +
    "Use only the supplied dashboard context. Never invent values. " +
    "Return JSON with exactly answer and sources.";

  try {
    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || "openai.gpt-oss-120b-1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({ question, context })
          }
        ],
        max_tokens: 700,
        temperature: 0.1
      })
    });

    const response = await client.send(command);
    const completion = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    const raw = completion.choices?.[0]?.message?.content || "";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const result = JSON.parse(raw.slice(start, end + 1));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(502).json({
      error: "Bedrock request failed."
    });
  }
});

app.listen(port, () => {
  console.log(`Copilot API listening on port ${port}`);
});