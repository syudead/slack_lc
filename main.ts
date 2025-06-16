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

// For Deno Deploy, port is automatically handled
// For local development, use config.port
if (Deno.env.get("DENO_DEPLOYMENT_ID")) {
  // Running on Deno Deploy - no port configuration needed
  console.log("🤖 Slack bot starting on Deno Deploy");
  Deno.serve(handler);
} else {
  // Running locally - use configured port
  console.log(`🤖 Slack bot starting locally on port ${config.port}`);
  Deno.serve({ port: config.port }, handler);
}