export type LLMProvider = "openai" | "claude" | "deepseek";

export interface Config {
  slackBotToken: string;
  slackSigningSecret: string;
  llmProvider: LLMProvider;
  openaiApiKey?: string;
  claudeApiKey?: string;
  deepseekApiKey?: string;
  port: number;
}

export function getConfig(): Config {
  const slackBotToken = Deno.env.get("SLACK_BOT_TOKEN");
  const slackSigningSecret = Deno.env.get("SLACK_SIGNING_SECRET");
  const llmProvider = (Deno.env.get("LLM_PROVIDER") || "openai") as LLMProvider;
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  const claudeApiKey = Deno.env.get("CLAUDE_API_KEY");
  const deepseekApiKey = Deno.env.get("DEEPSEEK_API_KEY");
  // Port is only used for local development, Deno Deploy handles this automatically
  const port = parseInt(Deno.env.get("PORT") || "8000");

  if (!slackBotToken) {
    throw new Error("SLACK_BOT_TOKEN environment variable is required");
  }
  
  if (!slackSigningSecret) {
    throw new Error("SLACK_SIGNING_SECRET environment variable is required");
  }

  // Validate that the required API key exists for the selected provider
  switch (llmProvider) {
    case "openai":
      if (!openaiApiKey) {
        throw new Error("OPENAI_API_KEY environment variable is required when LLM_PROVIDER=openai");
      }
      break;
    case "claude":
      if (!claudeApiKey) {
        throw new Error("CLAUDE_API_KEY environment variable is required when LLM_PROVIDER=claude");
      }
      break;
    case "deepseek":
      if (!deepseekApiKey) {
        throw new Error("DEEPSEEK_API_KEY environment variable is required when LLM_PROVIDER=deepseek");
      }
      break;
    default:
      throw new Error(`Unsupported LLM provider: ${llmProvider}. Supported providers: openai, claude, deepseek`);
  }

  return {
    slackBotToken,
    slackSigningSecret,
    llmProvider,
    openaiApiKey,
    claudeApiKey,
    deepseekApiKey,
    port,
  };
}