import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { Config, LLMProvider } from "../utils/config.ts";
import { LLMProvider as ILLMProvider } from "../types/llm.ts";

export class LangChainAgent implements ILLMProvider {
  private llm: ChatOpenAI | ChatAnthropic;
  private provider: LLMProvider;

  constructor(config: Config) {
    this.provider = config.llmProvider;
    
    switch (config.llmProvider) {
      case "openai":
        this.llm = new ChatOpenAI({
          openAIApiKey: config.openaiApiKey!,
          modelName: "gpt-3.5-turbo",
          temperature: 0.7,
        });
        break;
      
      case "claude":
        this.llm = new ChatAnthropic({
          anthropicApiKey: config.claudeApiKey!,
          modelName: "claude-3-sonnet-20240229",
          temperature: 0.7,
        });
        break;
      
      case "deepseek":
        this.llm = new ChatOpenAI({
          openAIApiKey: config.deepseekApiKey!,
          modelName: "deepseek-chat",
          temperature: 0.7,
          configuration: {
            baseURL: "https://api.deepseek.com/v1",
          },
        });
        break;
      
      default:
        throw new Error(`Unsupported LLM provider: ${config.llmProvider}`);
    }
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(message, context);
      
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

      const response = await this.llm.invoke(fullPrompt);
      return response.content as string;
    } catch (error) {
      console.error(`Error generating response with ${this.provider}:`, error);
      return "Sorry, I encountered an error while processing your message. Please try again.";
    }
  }

  private buildSystemPrompt(): string {
    return `You are a helpful AI assistant in a Slack workspace. Your role is to:

1. **Be conversational and friendly**: Use natural language that fits Slack's casual communication style
2. **Be concise but thorough**: Provide complete answers without being overly verbose
3. **Be contextually aware**: Use the conversation history to provide relevant responses
4. **Be professional yet approachable**: Maintain a helpful tone while being informative
5. **Use Slack formatting when appropriate**: You can use *bold*, _italic_, \`code\`, and other Slack markdown

Guidelines:
- If asked about technical topics, provide clear explanations with examples when helpful
- If you don't know something, admit it and suggest alternatives
- For code-related questions, use proper formatting and explain your solutions
- Keep responses focused and avoid unnecessary repetition
- When referencing previous messages, acknowledge the context naturally

Remember: You're participating in an ongoing conversation, so respond appropriately to the flow of discussion.`;
  }

  private buildUserPrompt(message: string, context?: string): string {
    if (context && context.trim()) {
      return `**Conversation Context:**
${context}

**Current Message:**
${message}

Please respond appropriately to the current message, taking into account the conversation context and any relevant information about the participants.`;
    } else {
      return `**Message:**
${message}

Please provide a helpful and appropriate response.`;
    }
  }
}