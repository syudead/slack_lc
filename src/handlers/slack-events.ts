import { verifySlackSignature } from "../utils/auth.ts";
import { SlackEvent, SlackChallenge } from "../types/slack.ts";
import { Config } from "../utils/config.ts";
import { processMessage } from "./message.ts";

export async function handleSlackEvent(
  request: Request,
  config: Config
): Promise<Response> {
  try {
    const body = await request.text();
    const signature = request.headers.get("X-Slack-Signature");
    const timestamp = request.headers.get("X-Slack-Request-Timestamp");

    if (!signature || !timestamp) {
      return new Response("Missing signature or timestamp", { status: 400 });
    }

    // Verify Slack signature
    const isValid = await verifySlackSignature(
      body,
      signature,
      timestamp,
      config.slackSigningSecret
    );

    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    const data = JSON.parse(body) as SlackEvent | SlackChallenge;

    // Handle URL verification challenge
    if (data.type === "url_verification") {
      const challenge = data as SlackChallenge;
      return new Response(challenge.challenge, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Handle event callbacks
    if (data.type === "event_callback") {
      const event = data as SlackEvent;
      
      if (event.event?.type === "message" && !event.event.bot_id) {
        // Process the message in the background
        processMessage(event, config).catch((error) => {
          console.error("Error processing message:", error);
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error handling Slack event:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}