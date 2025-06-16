import { SlackEvent } from "../types/slack.ts";
import { Config } from "../utils/config.ts";
import { LangChainAgent } from "../services/langchain.ts";
import { SlackClient, SlackHistoryMessage } from "../services/slack.ts";

export async function processMessage(
  event: SlackEvent,
  config: Config
): Promise<void> {
  if (!event.event) return;

  const { user, text, channel, thread_ts } = event.event;

  // Skip bot messages
  if (event.event.bot_id) return;

  try {
    const langchainAgent = new LangChainAgent(config);
    const slackClient = new SlackClient(config);

    // Get conversation context from Slack history
    const context = await buildConversationContext(slackClient, channel, thread_ts);

    // Generate response using LangChain
    const response = await langchainAgent.generateResponse(text, context);

    // Send response to Slack
    await slackClient.sendMessage({
      channel,
      text: response,
      thread_ts,
    });

  } catch (error) {
    console.error("Error processing message:", error);
    
    // Send error message to Slack
    try {
      const slackClient = new SlackClient(config);
      await slackClient.sendMessage({
        channel,
        text: "Sorry, I encountered an error processing your message.",
        thread_ts,
      });
    } catch (sendError) {
      console.error("Error sending error message:", sendError);
    }
  }
}

async function buildConversationContext(
  slackClient: SlackClient, 
  channel: string, 
  threadTs?: string
): Promise<string> {
  try {
    const messages = await slackClient.getConversationHistory(channel, threadTs, 5);
    
    // Filter out the current message and format for context
    const contextMessages = messages
      .filter(msg => msg.text && msg.text.trim())
      .slice(0, -1) // Remove the current message
      .slice(-4) // Keep last 4 messages for context
      .map(msg => {
        const sender = msg.bot_id ? "Bot" : `User`;
        return `${sender}: ${msg.text}`;
      });

    return contextMessages.join("\n");
  } catch (error) {
    console.warn("Failed to build context from Slack history:", error);
    return "";
  }
}