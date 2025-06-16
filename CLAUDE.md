# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Slack bot powered by LangChain that runs on Deno and deploys to Deno Deploy. The bot uses the LangChain Slack toolkit to handle Slack events and provide intelligent responses.

## Development Commands

### Local Development
```bash
deno run --allow-net --allow-env main.ts
```

### Testing
```bash
deno test --allow-net --allow-env
```

### Deployment
```bash
deployctl deploy --project=slack-langchain-bot main.ts
```

## Architecture

The application follows an event-driven architecture with three main components:

1. **Slack Event Handler** (`src/handlers/slack-events.ts`) - Receives and validates Slack webhook events
2. **LangChain Agent** (`src/services/langchain.ts`) - Handles LLM interactions using LangChain Slack toolkit
3. **Message Processor** (`src/handlers/message.ts`) - Processes messages and manages conversation context

## Key Technical Constraints

- **Deno Runtime**: All code must be compatible with Deno (no Node.js APIs)
- **ES Modules Only**: Use ES module imports/exports exclusively
- **LangChain Slack Toolkit**: Must use `@langchain/slack` for Slack API interactions
- **Environment Variables**: Required: `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `LLM_PROVIDER`, and corresponding API key, `PORT`

## LLM Provider Configuration

The application supports multiple LLM providers. Configure using environment variables:

### Required Environment Variables
- `SLACK_BOT_TOKEN` - Slack bot token
- `SLACK_SIGNING_SECRET` - Slack signing secret
- `LLM_PROVIDER` - LLM provider to use (`openai`, `claude`, or `deepseek`)
- `PORT` - Server port (optional, defaults to 8000)

### LLM Provider API Keys (one required based on LLM_PROVIDER)
- `OPENAI_API_KEY` - Required when `LLM_PROVIDER=openai`
- `CLAUDE_API_KEY` - Required when `LLM_PROVIDER=claude`
- `DEEPSEEK_API_KEY` - Required when `LLM_PROVIDER=deepseek`

### Example Configuration

#### OpenAI (default)
```bash
export LLM_PROVIDER=openai
export OPENAI_API_KEY=sk-your-openai-key
```

#### Claude
```bash
export LLM_PROVIDER=claude
export CLAUDE_API_KEY=sk-ant-your-claude-key
```

#### DeepSeek
```bash
export LLM_PROVIDER=deepseek
export DEEPSEEK_API_KEY=sk-your-deepseek-key
```

## File Structure

- `main.ts` - Entry point with HTTP server
- `src/handlers/` - Event and message handling
- `src/services/` - LangChain and Slack API services
- `src/utils/` - Authentication and configuration utilities
- `src/types/` - TypeScript type definitions

## Development Workflow

### Git Commit Policy
- **Commit after every code change**: Create a git commit after each logical code modification
- **Descriptive commit messages**: Use clear, concise messages that explain the "why" behind changes
- **Atomic commits**: Each commit should represent a single, complete change
- **Commit before testing**: Always commit working code before running tests or making further changes

### Commit Message Format
```
<type>: <description>

<optional body explaining the change>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Slack Configuration

The bot requires specific Slack app permissions:
- Bot Token Scopes: `chat:write`, `channels:read`, `groups:read`, `im:read`, `mpim:read`
- Event Subscriptions: `message.channels`, `message.groups`, `message.im`, `message.mpim`, `app_mention`