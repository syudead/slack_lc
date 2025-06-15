import { ChatOpenAI } from "@langchain/openai";
import { Config } from "../utils/config.ts";

export class LangChainAgent {
  private llm: ChatOpenAI;

  constructor(config: Config) {
    this.llm = new ChatOpenAI({
      openAIApiKey: config.openaiApiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
    });
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const prompt = context 
        ? `Context: ${context}\n\nUser message: ${message}\n\nPlease provide a helpful response:`
        : `User message: ${message}\n\nPlease provide a helpful response:`;

      const response = await this.llm.invoke(prompt);
      return response.content as string;
    } catch (error) {
      console.error("Error generating response:", error);
      return "Sorry, I encountered an error while processing your message. Please try again.";
    }
  }
}