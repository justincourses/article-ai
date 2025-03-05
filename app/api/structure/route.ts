import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";

import { myProvider } from "@/lib/ai/models";
import { systemPrompt, structurePrompts } from "@/constants/prompts";
import { auth } from "@clerk/nextjs/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    topic,
    style,
    coreIdeas,
    wordCount,
    targetAudience,
    exampleArticle,
    messages,
    selectedChatModel,
    detailLevel = "base",
    length,
  } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Determine length based on wordCount if not explicitly provided
  let contentLength = length;
  if (!contentLength && wordCount) {
    const count = parseInt(wordCount);
    if (count <= 800) {
      contentLength = "short";
    } else if (count <= 1500) {
      contentLength = "medium";
    } else {
      contentLength = "long";
    }
  } else if (!contentLength) {
    contentLength = "medium";
  }

  // Generate the prompt using the prompt utility
  const prompt = structurePrompts.getStructurePrompt({
    topic,
    style,
    coreIdeas,
    wordCount,
    targetAudience,
    exampleArticle,
    detailLevel,
    length: contentLength,
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
        maxSteps: 5,
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
