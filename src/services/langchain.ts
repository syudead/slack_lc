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
      const prompt = context 
        ? `Context: ${context}\n\nUser message: ${message}\n\nPlease provide a helpful response:`
        : `User message: ${message}\n\nPlease provide a helpful response:`;

      const response = await this.llm.invoke(prompt);
      return response.content as string;
    } catch (error) {
      console.error(`Error generating response with ${this.provider}:`, error);
      return "Sorry, I encountered an error while processing your message. Please try again.";
    }
  }
}