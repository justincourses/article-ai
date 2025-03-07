import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";

import { myProvider } from "@/lib/ai/models";
import { systemPrompt, articlePrompts } from "@/constants/prompts";
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
  let contentLength = length;
  if (wordCount) {
    // If wordCount is "mini", use mini length
    if (wordCount === "mini") {
      contentLength = "mini";
    } else {
      // Otherwise try to parse as number
      const count = parseInt(wordCount);
      if (count <= 300) {
        contentLength = "mini";
      } else if (count <= 800) {
        contentLength = "short";
      } else if (count <= 1500) {
        contentLength = "medium";
      } else {
        contentLength = "long";
      }
    }
  }

  // Extract requirements from the message content if not provided directly
  let extractedRequirements = requirements;
  if (!extractedRequirements && messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content;

    // Check if the content contains requirements
    if (content.includes('with requirements:')) {
      extractedRequirements = content.split('with requirements:')[1].trim();
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
    length: contentLength,
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
