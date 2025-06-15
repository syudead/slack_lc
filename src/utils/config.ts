export interface Config {
  slackBotToken: string;
  slackSigningSecret: string;
  openaiApiKey: string;
  port: number;
}

export function getConfig(): Config {
  const slackBotToken = Deno.env.get("SLACK_BOT_TOKEN");
  const slackSigningSecret = Deno.env.get("SLACK_SIGNING_SECRET");
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  const port = parseInt(Deno.env.get("PORT") || "8000");

  if (!slackBotToken) {
    throw new Error("SLACK_BOT_TOKEN environment variable is required");
  }
  
  if (!slackSigningSecret) {
    throw new Error("SLACK_SIGNING_SECRET environment variable is required");
  }
  
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  return {
    slackBotToken,
    slackSigningSecret,
    openaiApiKey,
    port,
  };
}