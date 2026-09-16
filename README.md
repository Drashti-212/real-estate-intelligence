# Real-Estate-Intelligence-Portfolio

## Portfolio Copilot

The dashboard includes a read-only GenAI copilot. It sends a compact, project-scoped view of the dashboard data to `/api/copilot`; the model provider key is kept server-side by the Vite middleware. Gemini is supported as an alternative to OpenAI.

To enable it locally, create a `.env` file with:

```text
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4o-mini
```

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