import { SlackEvent } from "../types/slack.ts";
import { Config } from "../utils/config.ts";
import { LangChainAgent } from "../services/langchain.ts";
import { SlackClient } from "../services/slack.ts";

const conversationMemory = new Map<string, string[]>();

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

    // Get conversation context from memory
    const conversationKey = thread_ts || channel;
    const context = getConversationContext(conversationKey);

    // Generate response using LangChain
    const response = await langchainAgent.generateResponse(text, context);

    // Send response to Slack
    await slackClient.sendMessage({
      channel,
      text: response,
      thread_ts,
    });

    // Update conversation memory
    updateConversationMemory(conversationKey, user, text, response);

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

function getConversationContext(conversationKey: string): string {
  const messages = conversationMemory.get(conversationKey) || [];
  return messages.slice(-5).join("\n"); // Keep last 5 messages for context
}

function updateConversationMemory(
  conversationKey: string,
  user: string,
  userMessage: string,
  botResponse: string
): void {
  const messages = conversationMemory.get(conversationKey) || [];
  
  messages.push(`User (${user}): ${userMessage}`);
  messages.push(`Bot: ${botResponse}`);
  
  // Keep only last 10 messages to manage memory
  if (messages.length > 10) {
    messages.splice(0, messages.length - 10);
  }
  
  conversationMemory.set(conversationKey, messages);
}