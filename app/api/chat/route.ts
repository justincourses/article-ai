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
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 5,
        maxTokens: 16000,
        experimental_activeTools:
          selectedChatModel === "chat-model-function"
            ? [
                // "getWeather",
                // "createDocument",
                // "updateDocument",
                // "requestSuggestions",
              ]
            : [],
        experimental_transform: smoothStream({ chunking: "word" }),
        // experimental_generateMessageId: generateUUID,
        // tools: {
        //   getWeather,
        //   createDocument: createDocument({ session, dataStream }),
        //   updateDocument: updateDocument({ session, dataStream }),
        //   requestSuggestions: requestSuggestions({
        //     session,
        //     dataStream,
        //   }),
        // },
        onFinish: async ({ response, reasoning }) => {
          if (userId) {
            // try {
            //   const sanitizedResponseMessages = sanitizeResponseMessages({
            //     messages: response.messages,
            //     reasoning,
            //   });

            //   await saveMessages({
            //     messages: sanitizedResponseMessages.map((message) => {
            //       return {
            //         id: message.id,
            //         chatId: id,
            //         role: message.role,
            //         content: message.content,
            //         createdAt: new Date(),
            //       };
            //     }),
            //   });
            // } catch (error) {
            //   console.error("Failed to save chat", error);
            // }
          }
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
      return "Oops, an error occured!";
    },
  });
}

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return new Response("Not Found", { status: 404 });
//   }

//   const { userId } = await auth();

//   if (!userId) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   try {
//     const chat = await getChatById({ id });

//     if (chat.userId !== userId) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     await deleteChatById({ id });

//     return new Response("Chat deleted", { status: 200 });
//   } catch (error) {
//     return new Response("An error occurred while processing your request", {
//       status: 500,
//     });
//   }
// }
