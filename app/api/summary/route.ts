import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";

import { myProvider } from "@/lib/ai/models";
import { systemPrompt, summaryPrompts } from "@/constants/prompts";
import { auth } from "@clerk/nextjs/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    article,
    messages,
    selectedChatModel,
    format = "base",
    style = "social",
    includeImagePrompt = true,
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
  });

  // Create a message with the prompt
  const promptMessages: Message[] = [
    {
      id,
      role: "user",
      content: prompt,
    },
  ];

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel || 'chat-model-large'),
        system: systemPrompt({ selectedChatModel: selectedChatModel || 'chat-model-large' }),
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
