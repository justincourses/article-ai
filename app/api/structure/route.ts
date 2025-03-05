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
    wordCount,
    targetAudience,
    exampleArticle,
    messages,
    selectedChatModel,
  } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Create the prompt on the server side
  const prompt = `根据以下要求生成一篇文章的思维导图结构：

主题：${topic}
风格：${style}
核心思路：${coreIdeas}
文章篇幅：${wordCount}
目标人群：
- 年龄层次：${targetAudience?.ageRange || '不限'}
- 性别倾向：${targetAudience?.gender || '不限'}
- 消费层次：${targetAudience?.incomeLevel || '不限'}
- 兴趣类目：${targetAudience?.interests?.join('、') || '不限'}
- 用户特征：${targetAudience?.userTraits || '不限'}
${exampleArticle ? `参考文章：${exampleArticle}` : ''}

要求：
1. 使用 Markdown 格式的缩进列表
2. 结构要清晰，层次分明
3. 每个要点要简洁明了
4. 保持适当的缩进以表示层级关系
5. 确保内容适合目标人群的阅读习惯和兴趣
6. 根据指定篇幅合理规划各部分内容比例
7. 内容要符合用户特征描述的偏好和行为习惯

直接返回 Markdown 格式的内容，不要使用代码块。`;

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
