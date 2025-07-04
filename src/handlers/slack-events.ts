import { verifySlackSignature } from "../utils/auth.ts";
import { SlackEvent, SlackChallenge } from "../types/slack.ts";
import { Config } from "../utils/config.ts";
import { processMessage } from "./message.ts";
import { SlackClient } from "../services/slack.ts";

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
      
      // Handle app mentions (most reliable way to detect bot mentions)
      if (event.event?.type === "app_mention" && !event.event.bot_id) {
        // Process the mention in the background
        processMessage(event, config).catch((error) => {
          console.error("Error processing app mention:", error);
        });
      }
      
      // Handle direct messages
      if (event.event?.type === "message" && !event.event.bot_id) {
        // Check if it's a DM using Slack API
        checkAndProcessDM(event, config).catch((error) => {
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

async function checkAndProcessDM(event: SlackEvent, config: Config): Promise<void> {
  if (!event.event) return;
  
  try {
    const slackClient = new SlackClient(config);
    const channelInfo = await slackClient.getChannelInfo(event.event.channel);
    
    // Check if it's a DM using the official Slack API response
    if (channelInfo.is_im) {
      await processMessage(event, config);
    }
  } catch (error) {
    console.error("Error checking DM status:", error);
  }
}