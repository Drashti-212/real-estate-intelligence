import "dotenv/config";

import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION
});

const modelId = process.env.BEDROCK_MODEL_ID;

const requestBody = {
  messages: [
    {
      role: "user",
      content: "Hello! Explain what you are in one short sentence."
    }
  ],
  max_tokens: 200,
  temperature: 0.2
};

const command = new InvokeModelCommand({
  modelId: modelId,
  contentType: "application/json",
  accept: "application/json",
  body: JSON.stringify(requestBody)
});

try {
  console.log("Calling AWS Bedrock...");
  console.log("Model:", modelId);
  console.log("Region:", process.env.AWS_REGION);

  const response = await client.send(command);

  const responseBody = JSON.parse(
    new TextDecoder().decode(response.body)
  );

  console.log("\nGPT-OSS RESPONSE:\n");
  console.log(JSON.stringify(responseBody, null, 2));

} catch (error) {
  console.error("\nBEDROCK ERROR:\n");
  console.error(error);
}