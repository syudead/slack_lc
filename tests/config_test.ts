import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { getConfig } from "../src/utils/config.ts";

Deno.test("getConfig - with all required environment variables", () => {
  // Set up environment variables
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("OPENAI_API_KEY", "test-openai-key");
  Deno.env.set("PORT", "3000");

  const config = getConfig();

  assertEquals(config.slackBotToken, "xoxb-test-token");
  assertEquals(config.slackSigningSecret, "test-signing-secret");
  assertEquals(config.openaiApiKey, "test-openai-key");
  assertEquals(config.port, 3000);

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("OPENAI_API_KEY");
  Deno.env.delete("PORT");
});

Deno.test("getConfig - with default port", () => {
  // Set up required environment variables
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("OPENAI_API_KEY", "test-openai-key");
  // Don't set PORT

  const config = getConfig();

  assertEquals(config.port, 8000); // Default port

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("OPENAI_API_KEY");
});

Deno.test("getConfig - missing SLACK_BOT_TOKEN", () => {
  // Clean up environment variables
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("OPENAI_API_KEY");

  assertThrows(
    () => getConfig(),
    Error,
    "SLACK_BOT_TOKEN environment variable is required"
  );
});

Deno.test("getConfig - missing SLACK_SIGNING_SECRET", () => {
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("OPENAI_API_KEY");

  assertThrows(
    () => getConfig(),
    Error,
    "SLACK_SIGNING_SECRET environment variable is required"
  );

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
});

Deno.test("getConfig - missing OPENAI_API_KEY", () => {
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.delete("OPENAI_API_KEY");

  assertThrows(
    () => getConfig(),
    Error,
    "OPENAI_API_KEY environment variable is required"
  );

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
});