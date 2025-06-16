import { SlackMessage } from "../types/slack.ts";
import { Config } from "../utils/config.ts";

export interface SlackHistoryMessage {
  text: string;
  user: string;
  ts: string;
  bot_id?: string;
}

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

  async getConversationHistory(channel: string, threadTs?: string, limit: number = 10): Promise<SlackHistoryMessage[]> {
    try {
      const url = threadTs 
        ? "https://slack.com/api/conversations.replies"
        : "https://slack.com/api/conversations.history";
      
      const params = new URLSearchParams({
        channel,
        limit: limit.toString(),
        ...(threadTs && { ts: threadTs })
      });

      const response = await fetch(`${url}?${params}`, {
        headers: {
          "Authorization": `Bearer ${this.token}`,
        },
      });

      const result = await response.json();
      
      if (!result.ok) {
        console.warn(`Slack API warning: ${result.error}`);
        return [];
      }

      return result.messages || [];
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      return [];
    }
  }
}