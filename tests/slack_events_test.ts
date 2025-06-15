import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { verifySlackSignature } from "../src/utils/auth.ts";
import { Config } from "../src/utils/config.ts";

const mockConfig: Config = {
  slackBotToken: "xoxb-test-token",
  slackSigningSecret: "test-signing-secret",
  openaiApiKey: "test-openai-key",
  port: 8000,
};

Deno.test("verifySlackSignature - integration test", async () => {
  const body = '{"type":"url_verification","challenge":"test123"}';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signingSecret = mockConfig.slackSigningSecret;
  
  // Generate a valid signature
  const baseString = `v0:${timestamp}:${body}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(signingSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(baseString)
  );
  
  const signature = `v0=${Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')}`;

  const result = await verifySlackSignature(body, signature, timestamp, signingSecret);
  assertEquals(result, true);
});