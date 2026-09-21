import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION
});

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ||
  "openai.gpt-oss-120b-1:0";

export async function askGPTOSS({
  messages,
  maxTokens = 1000,
  temperature = 0.2
}) {

  const requestBody = {
    messages,
    max_tokens: maxTokens,
    temperature
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(requestBody)
  });

  const response = await bedrockClient.send(command);

  const responseBody = JSON.parse(
    new TextDecoder().decode(response.body)
  );

  return responseBody;
}