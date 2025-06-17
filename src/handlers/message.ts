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
    const langchainAgent = new LangChainAgent(config);

    // Get conversation context from Slack history
    const context = await buildConversationContext(slackClient, channel, thread_ts, user);

    // Clean mention from message text for better processing
    const cleanedText = await cleanMentionsFromText(slackClient, text);
    
    // Generate response using LangChain
    const response = await langchainAgent.generateResponse(cleanedText, context);

    // Send response to Slack - always use threads for channel messages
    const responseThreadTs = thread_ts || event.event.ts;
    await slackClient.sendMessage({
      channel,
      text: response,
      thread_ts: responseThreadTs,
    });

  } catch (error) {
    console.error("Error processing message:", error);
    
    // Send error message to Slack - also use threads for error messages
    try {
      const slackClient = new SlackClient(config);
      const errorThreadTs = thread_ts || event.event.ts;
      await slackClient.sendMessage({
        channel,
        text: "Sorry, I encountered an error processing your message.",
        thread_ts: errorThreadTs,
      });
    } catch (sendError) {
      console.error("Error sending error message:", sendError);
    }
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
      
      // Clean mentions from context messages to avoid confusion
      const cleanedMsg = await cleanMentionsFromText(slackClient, msg.text);
      contextMessages.push(`${senderName}: ${cleanedMsg}`);
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

async function cleanMentionsFromText(
  slackClient: SlackClient, 
  text: string
): Promise<string> {
  try {
    // Get bot user ID to specifically remove bot mentions
    const botUserId = await slackClient.getBotUserId();
    
    // Remove bot mention from text
    let cleanedText = text.replace(new RegExp(`<@${botUserId}>`, 'g'), '').trim();
    
    // Also remove other user mentions and replace with readable names
    const mentionPattern = /<@([UW][A-Z0-9]+)>/g;
    const matches = Array.from(cleanedText.matchAll(mentionPattern));
    
    for (const match of matches) {
      const userId = match[1];
      const userInfo = await slackClient.getUserInfo(userId);
      const userName = userInfo?.profile?.display_name || 
                      userInfo?.profile?.real_name || 
                      userInfo?.real_name || 
                      userInfo?.name || 
                      'someone';
      
      cleanedText = cleanedText.replace(match[0], `@${userName}`);
    }
    
    return cleanedText.trim();
  } catch (error) {
    console.warn("Error cleaning mentions from text:", error);
    // Fallback: simple regex to remove mentions
    return text.replace(/<@[UW][A-Z0-9]+>/g, '').trim();
  }
}