# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Code Modification Policy
- **Propose before implementing**: Explain approach and get user approval before making code changes
- **Wait for confirmation**: Do not proceed with modifications until user explicitly approves
- **Break down complex changes**: Present clear step-by-step plans for multi-step modifications
- **Explain rationale**: Always explain why changes are necessary and how they solve the problem

## Development Commands
```bash
# Local development
deno run --allow-net --allow-env main.ts

# Testing
deno test --allow-net --allow-env

# Deploy
deno task deploy
```

## Technical Constraints
- **Deno Runtime**: All code must be compatible with Deno (no Node.js APIs)
- **ES Modules Only**: Use ES module imports/exports exclusively
- **Environment Variables**: See `.env.example` for required configuration

## Git Commit Policy
- **Commit after every code change**: Create a git commit after each logical modification
- **Descriptive commit messages**: Use clear messages that explain the "why" behind changes
- **Atomic commits**: Each commit should represent a single, complete change

### Commit Message Format
```
<type>: <description>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Project Information
For detailed project information, configuration, and setup instructions, see:
- **Project Overview**: `README.md`
- **Setup Guide**: `docs/SLACK_SETUP.md`
- **Deployment**: `docs/DEPLOYMENT_GUIDE.md`
- **Architecture**: `docs/PROJECT_SPEC.md`