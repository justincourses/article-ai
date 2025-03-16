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
import { ArticleConfig } from "@/store/writer/config";

// export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    time,
    topic,
    articleType,
    style,
    coreIdeas,
    outline,
    requirements,
    messages,
    wordCount,
    targetAudience,
    writerPersona,
    reviewerInfo,
    model = DEFAULT_MODELS.ARTICLE,
  } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

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

  // Create an article config object for the prompt
  const articleConfig: ArticleConfig = {
    topic: topic || "",
    articleType: articleType || "social_media",
    style: style || "",
    coreIdeas: coreIdeas || "",
    exampleArticle: "",
    model: model,
    wordCount: wordCount || "medium",
    emojiUsage: "none",
    targetAudience: targetAudience || {
      ageRange: "",
      gender: "",
      incomeLevel: "",
      interests: [],
      userTraits: ""
    },
    writerPersona: writerPersona || {
      type: "",
      style: "",
      characteristics: ""
    },
    reviewerInfo: reviewerInfo || {
      hasReviewer: false,
      reviewerType: "",
      reviewerRequirements: ""
    },
    outline: outline || ""
  };

  // Generate the prompt using the prompt utility
  const prompt = articlePrompts.getArticlePrompt(articleConfig);

  // Create a message with the prompt
  const promptMessages: Message[] = [
    {
      id,
      role: "user",
      content: prompt,
    },
  ];

  // Use the article model from constants or the one provided
  const modelToUse = model || DEFAULT_MODELS.ARTICLE;

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
