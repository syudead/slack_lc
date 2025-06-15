# Slack Bot with LangChain - Project Specification

## Overview
A generic Slack bot powered by LangChain that responds to messages in Slack channels and direct messages, deployed using Deno Deploy.

## Technical Requirements

### Runtime Environment
- **Platform**: Deno (compatible with Deno Deploy)
- **TypeScript**: Native TypeScript support
- **Module System**: ES modules only

### Core Dependencies
- **LangChain**: `@langchain/core`, `@langchain/community`
- **Slack Integration**: LangChain Slack toolkit (`@langchain/slack`)
- **Web Framework**: Deno's built-in HTTP server or compatible framework

### Architecture

#### Core Components
1. **Slack Event Handler**
   - Receives webhook events from Slack
   - Validates Slack signatures
   - Routes messages to appropriate handlers

2. **LangChain Agent**
   - Uses LangChain Slack toolkit for Slack API interactions
   - Configurable LLM backend (OpenAI, Anthropic, etc.)
   - Memory management for conversation context

3. **Message Processor**
   - Parses incoming messages
   - Determines response strategy
   - Handles threading and mentions

#### Key Features
- **Event-driven Architecture**: Responds to Slack events via webhooks
- **Thread Support**: Maintains conversation context in threads
- **Channel & DM Support**: Works in both channels and direct messages
- **Configurable Responses**: Customizable response patterns and triggers

## Configuration

### Environment Variables
```
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
OPENAI_API_KEY=your-openai-key (or other LLM provider)
PORT=8000
```

### Slack App Setup
- Bot Token Scopes: `chat:write`, `channels:read`, `groups:read`, `im:read`, `mpim:read`
- Event Subscriptions: `message.channels`, `message.groups`, `message.im`, `message.mpim`
- Subscribe to bot events: `app_mention`

## File Structure
```
/
├── main.ts                 # Entry point and HTTP server
├── src/
│   ├── handlers/
│   │   ├── slack-events.ts # Slack event processing
│   │   └── message.ts      # Message handling logic
│   ├── services/
│   │   ├── langchain.ts    # LangChain agent setup
│   │   └── slack.ts        # Slack API client
│   ├── types/
│   │   └── slack.ts        # TypeScript type definitions
│   └── utils/
│       ├── auth.ts         # Slack signature verification
│       └── config.ts       # Configuration management
├── deno.json               # Deno configuration
└── README.md               # Setup and deployment guide
```

## API Endpoints

### POST /slack/events
- Handles Slack event subscriptions
- Validates request signatures
- Processes message events

### GET /health
- Health check endpoint for monitoring

## Deployment

### Deno Deploy
```bash
deployctl deploy --project=slack-langchain-bot main.ts
```

### Environment Setup
- Configure environment variables in Deno Deploy dashboard
- Set up Slack App webhook URL to point to deployed endpoint

## Development Workflow

### Local Development
```bash
deno run --allow-net --allow-env main.ts
```

### Testing
```bash
deno test --allow-net --allow-env
```

## Security Considerations
- Slack signature verification for all incoming requests
- Environment variable validation
- Rate limiting for API calls
- Secure handling of authentication tokens

## Monitoring & Logging
- Structured logging for debugging
- Error tracking and reporting
- Performance metrics for response times