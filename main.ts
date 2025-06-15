import { getConfig } from "./src/utils/config.ts";
import { handleSlackEvent } from "./src/handlers/slack-events.ts";

const config = getConfig();

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // Health check endpoint
  if (url.pathname === "/health" && request.method === "GET") {
    return new Response("OK", { status: 200 });
  }
  
  // Slack events endpoint
  if (url.pathname === "/slack/events" && request.method === "POST") {
    return await handleSlackEvent(request, config);
  }
  
  return new Response("Not Found", { status: 404 });
}

console.log(`🤖 Slack bot starting on port ${config.port}`);
Deno.serve({ port: config.port }, handler);