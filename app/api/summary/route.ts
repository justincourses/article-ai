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
    article,
    messages,
    selectedChatModel,
  } = await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Create the prompt on the server side
  const prompt = `请为以下文章生成一个适合在社交媒体（如微信公众号、小红书等）发布的完整摘要：

${article}

要求：
1. 摘要应严格按照以下格式结构呈现：
   # [引人注目的标题（20字以内）]

   [简洁的导语（50字左右）]

   ## 主要内容
   - [要点1（30-50字）]
   - [要点2（30-50字）]
   - [要点3（30-50字）]
   - [可选要点4-5]

   ## 总结
   [总结内容（50字左右）]

   ## 标签
   [#标签1] [#标签2] [#标签3]

2. 在生成摘要时，请分析并考虑原文的以下特点：
   - 文章类型（如：技术文章、观点评论、新闻报道、教程指南等）
   - 文章风格（如：正式学术、轻松幽默、深度思考、实用指导等）
   - 目标受众（如：专业人士、普通大众、特定兴趣群体等）
   - 核心观点和独特见解

3. 总体长度控制在300-500字之间
4. 使用 Markdown 格式
5. 语言要与原文风格保持一致，同时确保生动有吸引力，适合社交媒体传播
6. 可以适当使用emoji表情增加亲和力，但要与文章类型和风格相符

最后，请额外生成一段用于AI图像生成的提示词（英文），描述一张能够直观表达文章核心内容的图片，格式为：

## 图像提示词
[英文图像生成提示词，考虑文章类型和风格，描述具体场景、风格、色调等元素]

直接返回 Markdown 格式的完整内容，不要使用代码块。`;

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
        model: myProvider.languageModel(selectedChatModel || 'chat-model-small'),
        system: systemPrompt({ selectedChatModel: selectedChatModel || 'chat-model-small' }),
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
