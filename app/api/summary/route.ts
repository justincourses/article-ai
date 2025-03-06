import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";

import { myProvider } from "@/lib/ai/models";
import { systemPrompt, summaryPrompts } from "@/constants/prompts";
import { auth } from "@clerk/nextjs/server";
import { DEFAULT_MODELS } from "@/constants/writer/models";

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    article,
    messages,
    format = "base",
    style = "social",
    includeImagePrompt = true,
    length = "short",
  } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Generate the prompt using the prompt utility
  const prompt = summaryPrompts.getSummaryPrompt({
    article,
    format,
    style,
    includeImagePrompt,
    length,
  });

  // Create a message with the prompt
  const promptMessages: Message[] = [
    {
      id,
      role: "user",
      content: prompt,
    },
  ];

  // Use the summary model from constants
  const modelToUse = DEFAULT_MODELS.SUMMARY;

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(modelToUse),
        system: systemPrompt({ selectedChatModel: modelToUse }),
        messages: promptMessages,
        maxSteps: 3,
        experimental_transform: smoothStream({ chunking: "word" }),
        onFinish: async ({ response, reasoning }) => {
          // Handle completion if needed
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
        },
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: (error) => {
      console.error("Stream error:", error);
      return "Oops, an error occurred!";
    },
  });
}
