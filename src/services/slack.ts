import { SlackMessage } from "../types/slack.ts";
import { Config } from "../utils/config.ts";

export class SlackClient {
  private token: string;

  constructor(config: Config) {
    this.token = config.slackBotToken;
  }

  async sendMessage(message: SlackMessage): Promise<void> {
    try {
      const response = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: message.channel,
          text: message.text,
          thread_ts: message.thread_ts,
        }),
      });

      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending message to Slack:", error);
      throw error;
    }
  }
}