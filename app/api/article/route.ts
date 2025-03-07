import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";

import { myProvider } from "@/lib/ai/models";
import { systemPrompt, articlePrompts, determineContentLength, timeReference } from "@/constants/prompts";
import { auth } from "@clerk/nextjs/server";
import { DEFAULT_MODELS } from "@/constants/writer/models";

// export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    time,
    topic,
    style,
    coreIdeas,
    outline,
    requirements,
    messages,
    length = "medium",
    styleType = "casual",
    wordCount,
  } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Determine length based on wordCount if provided
  const contentLength = wordCount ? determineContentLength(wordCount) : length;

  // Extract requirements from the message content if not provided directly
  let extractedRequirements = requirements;
  if (!extractedRequirements && messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user" && typeof lastMessage.content === "string") {
      const content = lastMessage.content;
      const requirementsMatch = content.match(/要求：([\s\S]*?)(?=\n\n|$)/);
      if (requirementsMatch && requirementsMatch[1]) {
        extractedRequirements = requirementsMatch[1].trim();
      }
    }
  }

  // Generate the prompt using the prompt utility
  const prompt = articlePrompts.getArticlePrompt({
    time,
    topic,
    style,
    coreIdeas,
    outline,
    requirements: extractedRequirements,
    length: contentLength as "mini" | "short" | "medium" | "long",
    styleType,
  });

  // Create a message with the prompt
  const promptMessages: Message[] = [
    {
      id,
      role: "user",
      content: prompt,
    },
  ];

  // Use the article model from constants
  const modelToUse = DEFAULT_MODELS.ARTICLE;

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(modelToUse),
        system: systemPrompt({ selectedChatModel: modelToUse }),
        messages: promptMessages,
        maxSteps: 5,
        maxTokens: 16000,
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
