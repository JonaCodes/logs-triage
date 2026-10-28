# Running the Project

- Run `npm i`
- Create a `.env` file with your Gemini API key
    - If you're using the `ai` sdk, make sure to save your key in `GOOGLE_GENERATIVE_AI_API_KEY` instead of `GEMINI_API_KEY`
    - Get a free API key from: https://aistudio.google.com/app/apikey
- Run `npm run dev` to run the agent
- Change `LOG_FILE_NUMBER` in `logTriageService.ts` to test different scenarios (1-5)

---

# Exercise: Production Logs Triage Agent

## Overview

You are building an **autonomous agent** that investigates production logs to identify issues and their root causes, and take the appropriate action per its findings.

---

## Setup

### LLM API Key

This project uses Google's Gemini (free tier):
1. Get API key: https://aistudio.google.com/app/apikey
2. Create `.env` file: `GOOGLE_GENERATIVE_AI_API_KEY=your_key_here`

**Note:** Use `GOOGLE_GENERATIVE_AI_API_KEY` not `GEMINI_API_KEY` (if using the `ai` SDK)

---

## What You're Building

### The Agent Class (`/agent/index.ts`)

The main function `run`, which should run the agent loop:
1. Call LLM with available tools
2. LLM decides which tools to use (if any)
3. (You) execute those tools
4. Add results to agent memory
5. Call LLM again with updated context
6. Repeat until investigation is complete or maximum step limit is reached

**Note:** The LLM does NOT execute tools itself. It tells *you* which tools to call. You execute them and feed the results back in.

### The Tools (`/tools/`)

Implement investigation tools that enable the agent to:
- Search logs by identifiers
- Check recent system changes (e.g deployments, config changes, migrations, etc.)
- Alert teams (dummy implementation - just console.log)
- Create tickets (dummy implementation - just console.log)

**Important:** Your search tool must look through ALL logs, not just recent ones. This lets the agent look backward in time.

### Memory Management

The agent needs to remember:
- System instructions
- Initial logs
- Every tool call and result

---

## The Log Files

`/prod_logs/` contains 5 scenarios with increasing complexity:

- **Log Set 1:** Healthy system (agent should detect no issues)
- **Log Set 2-4:** Single-layer investigations
- **Log Set 5:** Multi-layer investigation requiring multiple searches

Each file's comment explains what the agent should discover.

These files also include recent changes (deployments, config changes, migrations) to correlate with errors.

**Note**: the `logTriageService` runs your agent with the last 5 logs, *DO NOT* change this. If you give the agent all logs upfront, it will defeat the purpose of the exercise.

---

## Where to start

Your starting point is the `run` method in `/agent/index.ts` - this is where you should implement the agent loop.
- Work step by step
    - Start with log sets 1 and 2
    - The first doesn't need tools, the second only needs the createTicket tool. 
- Then make sure your agent loop works
- Then implement the tools necessary for the subsequent log sets
- Remember that each log set has instructions at the top of the file for how the agent should perform

---

## Resources

- **AI SDK Documentation:** https://sdk.vercel.ai/docs
- **Gemini API Quickstart:** https://ai.google.dev/gemini-api/docs/quickstart

## Gemini API

Use `gemini-3.5-flash-lite` for generation. Leave thinking settings unset to use
the model's default minimal thinking; this does not guarantee zero thinking tokens.

If you run out of Flash-Lite usage, you can also try `gemini-3.8-flash` with the
same Gemini API key, but it can be slower. Availability and quotas depend on your
account; switching models may not bypass shared limits. Check your current
[Gemini API limits](https://ai.google.dev/gemini-api/docs/rate-limits).

### Other API providers

You can also try these providers. Use the provider's own API key and adapt the
request wrapper to its endpoint or SDK.

| Provider | Free offering |
| --- | --- |
| [**Mistral**](https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key) | Free API mode, **no credit card required**. Usage quotas are shown in the account dashboard. |
| [**Groq**](https://console.groq.com/docs/rate-limits) | For `qwen/qwen3.8-27b`: **30 requests/minute, 1,000/day, 8,000 tokens/minute**, subject to account limits. |
| [**OpenRouter**](https://openrouter.ai/pricing) | Free models, **50 requests/day** without purchasing credits. |

Free-tier limits can change; check the linked provider pages and your account dashboard.

For native Gemini tool calls, keep the returned `response.messages` and their
provider metadata in request history. Gemini uses the tool-call IDs and thought
signatures when tool results are sent back; they are not part of the displayed answer.
