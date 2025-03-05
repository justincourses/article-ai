import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";

import { myProvider } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/prompts";
import { auth } from "@clerk/nextjs/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    topic,
    style,
    coreIdeas,
    outline,
    requirements,
    messages,
    selectedChatModel,
  } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
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

  // Create the prompt on the server side
  const prompt = `根据以下文章结构生成一篇完整的文章：

# 文章要求
主题：${topic}
风格：${style}
核心思路：${coreIdeas}
${extractedRequirements ? `补充要求：${extractedRequirements}` : ''}

# 文章结构
${outline}

要求：
1. 按照上述结构生成一篇完整的文章
2. 保持文章结构的层次性和逻辑性
3. 使用 Markdown 格式
4. 语言要流畅自然，符合指定的风格

直接返回 Markdown 格式的文章内容，不要使用代码块。`;

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
        model: myProvider.languageModel(selectedChatModel || 'chat-model-reasoning'),
        system: systemPrompt({ selectedChatModel: selectedChatModel || 'chat-model-reasoning' }),
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
