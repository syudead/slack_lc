import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { verifySlackSignature } from "../src/utils/auth.ts";

Deno.test("verifySlackSignature - valid signature", async () => {
  const body = '{"type":"url_verification","challenge":"test123"}';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signingSecret = "test_signing_secret";
  
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

Deno.test("verifySlackSignature - invalid signature", async () => {
  const body = '{"type":"url_verification","challenge":"test123"}';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signingSecret = "test_signing_secret";
  const invalidSignature = "v0=invalid_signature";

  const result = await verifySlackSignature(body, invalidSignature, timestamp, signingSecret);
  assertEquals(result, false);
});

Deno.test("verifySlackSignature - old timestamp", async () => {
  const body = '{"type":"url_verification","challenge":"test123"}';
  const oldTimestamp = (Math.floor(Date.now() / 1000) - 400).toString(); // 400 seconds ago
  const signingSecret = "test_signing_secret";
  const signature = "v0=any_signature";

  const result = await verifySlackSignature(body, signature, oldTimestamp, signingSecret);
  assertEquals(result, false);
});