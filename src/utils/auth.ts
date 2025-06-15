export async function verifySlackSignature(
  body: string,
  signature: string,
  timestamp: string,
  signingSecret: string
): Promise<boolean> {
  const time = parseInt(timestamp);
  const now = Math.floor(Date.now() / 1000);
  
  // Check if timestamp is within 5 minutes
  if (Math.abs(now - time) > 300) {
    return false;
  }

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

  const expectedSignature = `v0=${Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')}`;

  return expectedSignature === signature;
}