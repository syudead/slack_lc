import { SlackEvent } from "../types/slack.ts";
import { Config } from "../utils/config.ts";
import { LangChainAgent } from "../services/langchain.ts";
import { SlackClient, SlackHistoryMessage, SlackUser } from "../services/slack.ts";

export async function processMessage(
  event: SlackEvent,
  config: Config
): Promise<void> {
  if (!event.event) return;

  const { user, text, channel, thread_ts, type } = event.event;

  // Skip bot messages
  if (event.event.bot_id) return;

  try {
    const slackClient = new SlackClient(config);

    // Check if this message should trigger a response
    const shouldRespond = await shouldBotRespond(slackClient, text, channel, type);
    if (!shouldRespond) {
      console.log("Message doesn't require bot response, skipping");
      return;
    }

    const langchainAgent = new LangChainAgent(config);

    // Get conversation context from Slack history
    const context = await buildConversationContext(slackClient, channel, thread_ts, user);

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

async function shouldBotRespond(
  slackClient: SlackClient,
  text: string,
  channel: string,
  eventType?: string
): Promise<boolean> {
  try {
    // If it's an app_mention event, always respond
    if (eventType === "app_mention") {
      return true;
    }

    // For regular message events, only respond to DMs
    if (eventType === "message") {
      const channelInfo = await slackClient.getChannelInfo(channel);
      const isDM = channelInfo.is_im || channel.startsWith('D');
      return isDM;
    }

    return false;
  } catch (error) {
    console.error("Error checking if bot should respond:", error);
    // Default to not responding on error
    return false;
  }
}

async function buildConversationContext(
  slackClient: SlackClient, 
  channel: string, 
  threadTs?: string,
  currentUserId?: string
): Promise<string> {
  try {
    // Get more messages for better context
    const messages = await slackClient.getConversationHistory(channel, threadTs, 10);
    
    // Get current user info
    let currentUserInfo: SlackUser | null = null;
    if (currentUserId) {
      currentUserInfo = await slackClient.getUserInfo(currentUserId);
    }

    // Cache for user info to avoid multiple API calls
    const userCache: Map<string, SlackUser | null> = new Map();
    
    // Filter out the current message and format for context
    const contextMessages: string[] = [];
    const messagesToProcess = messages
      .filter(msg => msg.text && msg.text.trim())
      .slice(0, -1) // Remove the current message
      .slice(-6); // Keep last 6 messages for more context

    for (const msg of messagesToProcess) {
      let senderName = "User";
      
      if (msg.bot_id) {
        senderName = "Bot";
      } else if (msg.user) {
        // Try to get cached user info first
        if (!userCache.has(msg.user)) {
          userCache.set(msg.user, await slackClient.getUserInfo(msg.user));
        }
        
        const userInfo = userCache.get(msg.user);
        if (userInfo) {
          senderName = userInfo.profile?.display_name || 
                      userInfo.profile?.real_name || 
                      userInfo.real_name || 
                      userInfo.name || 
                      "User";
        }
      }
      
      contextMessages.push(`${senderName}: ${msg.text}`);
    }

    // Add current user info to context if available
    let contextString = contextMessages.join("\n");
    if (currentUserInfo) {
      const userName = currentUserInfo.profile?.display_name || 
                      currentUserInfo.profile?.real_name || 
                      currentUserInfo.real_name || 
                      currentUserInfo.name || 
                      "User";
      contextString = `[Current user: ${userName}]\n${contextString}`;
    }

    return contextString;
  } catch (error) {
    console.warn("Failed to build context from Slack history:", error);
    return "";
  }
}