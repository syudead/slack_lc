export interface LLMOptions {
  temperature?: number;
  modelName?: string;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
}

export interface LLMProvider {
  generateResponse(message: string, context?: string): Promise<string>;
}

export interface OpenAIOptions extends LLMOptions {
  apiKey: string;
  modelName?: string;
}

export interface ClaudeOptions extends LLMOptions {
  apiKey: string;
  modelName?: string;
}

export interface DeepSeekOptions extends LLMOptions {
  apiKey: string;
  modelName?: string;
  baseURL?: string;
}