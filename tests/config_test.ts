import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { getConfig } from "../src/utils/config.ts";

Deno.test("getConfig - with OpenAI provider (default)", () => {
  // Set up environment variables
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("OPENAI_API_KEY", "test-openai-key");
  Deno.env.set("PORT", "3000");

  const config = getConfig();

  assertEquals(config.slackBotToken, "xoxb-test-token");
  assertEquals(config.slackSigningSecret, "test-signing-secret");
  assertEquals(config.llmProvider, "openai");
  assertEquals(config.openaiApiKey, "test-openai-key");
  assertEquals(config.port, 3000);

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("OPENAI_API_KEY");
  Deno.env.delete("PORT");
});

Deno.test("getConfig - with Claude provider", () => {
  // Set up environment variables
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("LLM_PROVIDER", "claude");
  Deno.env.set("CLAUDE_API_KEY", "test-claude-key");

  const config = getConfig();

  assertEquals(config.slackBotToken, "xoxb-test-token");
  assertEquals(config.slackSigningSecret, "test-signing-secret");
  assertEquals(config.llmProvider, "claude");
  assertEquals(config.claudeApiKey, "test-claude-key");
  assertEquals(config.port, 8000);

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("LLM_PROVIDER");
  Deno.env.delete("CLAUDE_API_KEY");
});

Deno.test("getConfig - with DeepSeek provider", () => {
  // Set up environment variables
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("LLM_PROVIDER", "deepseek");
  Deno.env.set("DEEPSEEK_API_KEY", "test-deepseek-key");

  const config = getConfig();

  assertEquals(config.slackBotToken, "xoxb-test-token");
  assertEquals(config.slackSigningSecret, "test-signing-secret");
  assertEquals(config.llmProvider, "deepseek");
  assertEquals(config.deepseekApiKey, "test-deepseek-key");
  assertEquals(config.port, 8000);

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("LLM_PROVIDER");
  Deno.env.delete("DEEPSEEK_API_KEY");
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

Deno.test("getConfig - missing OPENAI_API_KEY for OpenAI provider", () => {
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("LLM_PROVIDER", "openai");
  Deno.env.delete("OPENAI_API_KEY");

  assertThrows(
    () => getConfig(),
    Error,
    "OPENAI_API_KEY environment variable is required when LLM_PROVIDER=openai"
  );

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("LLM_PROVIDER");
});

Deno.test("getConfig - missing CLAUDE_API_KEY for Claude provider", () => {
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("LLM_PROVIDER", "claude");
  Deno.env.delete("CLAUDE_API_KEY");

  assertThrows(
    () => getConfig(),
    Error,
    "CLAUDE_API_KEY environment variable is required when LLM_PROVIDER=claude"
  );

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("LLM_PROVIDER");
});

Deno.test("getConfig - missing DEEPSEEK_API_KEY for DeepSeek provider", () => {
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("LLM_PROVIDER", "deepseek");
  Deno.env.delete("DEEPSEEK_API_KEY");

  assertThrows(
    () => getConfig(),
    Error,
    "DEEPSEEK_API_KEY environment variable is required when LLM_PROVIDER=deepseek"
  );

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("LLM_PROVIDER");
});

Deno.test("getConfig - unsupported LLM provider", () => {
  Deno.env.set("SLACK_BOT_TOKEN", "xoxb-test-token");
  Deno.env.set("SLACK_SIGNING_SECRET", "test-signing-secret");
  Deno.env.set("LLM_PROVIDER", "unsupported");

  assertThrows(
    () => getConfig(),
    Error,
    "Unsupported LLM provider: unsupported. Supported providers: openai, claude, deepseek"
  );

  // Clean up
  Deno.env.delete("SLACK_BOT_TOKEN");
  Deno.env.delete("SLACK_SIGNING_SECRET");
  Deno.env.delete("LLM_PROVIDER");
});