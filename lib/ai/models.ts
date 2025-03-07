import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { openai } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

const OPENAI_COMPLETIONS_MODEL_SMALL =
  process.env.OPENAI_COMPLETIONS_MODEL_SMALL || "doubao-1-5-lite-32k-250115";
const OPENAI_COMPLETIONS_MODEL_LARGE = process.env.OPENAI_COMPLETIONS_MODEL_LARGE || 'deepseek-v3-241226';
const OPENAI_COMPLETIONS_MODEL_REASONING = process.env.OPENAI_COMPLETIONS_MODEL_REASONING || 'deepseek-r1-250120';
const OPENAI_COMPLETIONS_MODEL_FUNCTION =
  process.env.OPENAI_COMPLETIONS_MODEL_FUNCTION ||
  "doubao-pro-32k-functioncall-241028";
// const OPENAI_COMPLETIONS_MODEL_FUNCTION = "gpt-4o-mini";

const provider = createOpenAICompatible({
  name: "deepseek",
  apiKey: process.env.OPENAI_COMPLETIONS_API_KEY || "",
  baseURL: process.env.OPENAI_COMPLETIONS_BASE_URL || "",
});

export const myProvider = customProvider({
  languageModels: {
    "chat-model-small": provider(OPENAI_COMPLETIONS_MODEL_SMALL) as any,
    "chat-model-large": provider(OPENAI_COMPLETIONS_MODEL_LARGE) as any,
    "chat-model-function": provider(OPENAI_COMPLETIONS_MODEL_FUNCTION) as any,
    // "chat-model-function": openai(OPENAI_COMPLETIONS_MODEL_FUNCTION) as any,
    "chat-model-reasoning": wrapLanguageModel({
      model: provider(OPENAI_COMPLETIONS_MODEL_REASONING) as any,
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": provider(OPENAI_COMPLETIONS_MODEL_SMALL) as any,
    "artifact-model": provider(OPENAI_COMPLETIONS_MODEL_LARGE) as any,
  },
  imageModels: {
    "small-model": openai.image("dall-e-2"),
    "large-model": openai.image("dall-e-3"),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: "chat-model-small",
    name: "Small model",
    description: `Model: ${OPENAI_COMPLETIONS_MODEL_SMALL}`,
  },
  {
    id: "chat-model-large",
    name: "Large model",
    description: `Model: ${OPENAI_COMPLETIONS_MODEL_LARGE}`,
  },
  {
    id: "chat-model-reasoning",
    name: "Reasoning model",
    description: `Model: ${OPENAI_COMPLETIONS_MODEL_REASONING}`,
  },
  // Using function calling model
  // URL: https://console.volcengine.com/ark/region:ark+cn-beijing/model/detail?Id=doubao-pro-32k
  {
    id: "chat-model-function",
    name: "Function calling model",
    description: `Model: ${OPENAI_COMPLETIONS_MODEL_FUNCTION}`,
  },
];
