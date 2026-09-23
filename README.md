# Real-Estate-Intelligence-Portfolio

## Portfolio Copilot

The dashboard includes a read-only GenAI copilot. It sends a compact, project-scoped view of the dashboard data to `/api/copilot`; AWS credentials stay server-side in the AWS SDK credential chain. Amazon Bedrock with `openai.gpt-oss-120b-1:0` is the default provider.

See [docs/CHATBOT_CAPABILITIES.md](docs/CHATBOT_CAPABILITIES.md) for the client-facing supported questions, data basis, and limitations.

To enable Bedrock locally, create a `.env` file with:

```text
AWS_REGION=ap-south-1
BEDROCK_MODEL_ID=openai.gpt-oss-120b-1:0
AI_PROVIDER=bedrock
```

Authenticate with AWS CLI/SSO before starting Vite. If using temporary access keys, also set `AWS_SESSION_TOKEN`.

If the chatbot reports an expired security token, refresh the credentials in the default AWS profile or run `aws sso login --profile <profile>`, then restart Vite. The AWS SDK reads the standard AWS credential chain; credentials are not stored in the React client.

### Amplify deployment

Amplify Hosting serves the Vite build as static files and does not run `vite.config.js` middleware. Deploy `lambda/copilot.mjs` as a Lambda function behind an API Gateway `POST /copilot` route, attach an IAM role with `bedrock:InvokeModel` for the configured model, and set these Lambda environment variables:

```text
AWS_REGION=ap-south-1
BEDROCK_MODEL_ID=openai.gpt-oss-120b-1:0
ALLOWED_ORIGIN=https://your-amplify-domain.amplifyapp.com
```

Set `VITE_COPILOT_API_URL` in the Amplify build environment to the deployed API URL, for example `https://your-api-id.execute-api.ap-south-1.amazonaws.com/copilot`, then redeploy the frontend. Do not put AWS access keys in Amplify frontend environment variables.

Alternatively, use Gemini:

```text
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.0-flash
AI_PROVIDER=gemini
```

For your 16 GB Intel laptop, Ollama is also supported locally. Install Ollama from [ollama.com](https://ollama.com), then run:

```powershell
ollama pull qwen2.5:3b
```

Set the copilot to use it:

```text
AI_PROVIDER=ollama
OLLAMA_MODEL=qwen2.5:3b
OLLAMA_BASE_URL=http://127.0.0.1:11434
```

Then run `npm run dev`. Without a key, the dashboard remains usable and the copilot reports that it is not configured.