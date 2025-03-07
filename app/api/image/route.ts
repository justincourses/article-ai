import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { myProvider } from "@/lib/ai/models";
import { IMAGE_SIZE } from "@/constants/writer/models";

// 定义 OpenAI 图像生成响应格式
interface OpenAIImageResponse {
  created?: number;
  data: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const { prompt, size = "square" } = await request.json();

    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!prompt || typeof prompt !== "string") {
      return new Response("Invalid prompt", { status: 400 });
    }

    // 获取图像尺寸
    const imageSize = IMAGE_SIZE(size);
    console.log(`Generating image with size: ${imageSize}, prompt: ${prompt.substring(0, 50)}...`);

    // Generate image using the small-model (DALL-E 2)
    const imageModel = myProvider.imageModel("small-model");

    try {
      // 调用 OpenAI 图像生成 API
      const result = await imageModel.doGenerate({
        prompt: prompt,
        n: 1,
        size: imageSize,
        aspectRatio: undefined,
        seed: undefined,
        providerOptions: {},
      });

      console.log("Image generation result structure:", Object.keys(result));

      // 检查返回的图像数据
      if (!result || !result.images || !result.images.length) {
        console.error("No images in result:", result);
        throw new Error("No image data returned from the API");
      }

      // 获取第一个图像数据
      const imageData = result.images[0];
      console.log("Image data type:", typeof imageData);

      // 如果是字符串，记录前 100 个字符以便调试
      if (typeof imageData === 'string') {
        console.log("Image data preview:", imageData.substring(0, 100));
      }

      let imageUrl;

      // 处理图像数据
      if (typeof imageData === 'string') {
        // 如果是字符串类型的数据
        if (imageData.startsWith('http')) {
          // 如果已经是 URL，直接使用
          imageUrl = imageData;
          console.log("Using HTTP URL directly");
        } else if (imageData.startsWith('data:')) {
          // 如果已经是 data URL，直接使用
          imageUrl = imageData;
          console.log("Using data URL directly");
        } else {
          // 否则假设是 base64 数据，构造 data URL
          imageUrl = `data:image/png;base64,${imageData}`;
          console.log("Constructed data URL from base64 string");
        }
      } else if (imageData instanceof Uint8Array) {
        // 如果是二进制数据，转换为 base64
        const base64 = Buffer.from(imageData).toString('base64');
        imageUrl = `data:image/png;base64,${base64}`;
        console.log("Constructed data URL from Uint8Array");
      } else {
        console.error("Unexpected image data format:", imageData);
        throw new Error("Unexpected image data format");
      }

      // 返回图像 URL
      return NextResponse.json({
        success: true,
        imageUrl: imageUrl,
      });
    } catch (apiError) {
      console.error("API Error details:", apiError);

      // 尝试使用默认尺寸重试一次
      if (imageSize !== "1024x1024") {
        console.log("Retrying with default size: 1024x1024");

        try {
          const retryResult = await imageModel.doGenerate({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            aspectRatio: undefined,
            seed: undefined,
            providerOptions: {},
          });

          console.log("Retry result structure:", Object.keys(retryResult));

          if (!retryResult || !retryResult.images || !retryResult.images.length) {
            console.error("No images in retry result:", retryResult);
            throw new Error("No image data returned from the API on retry");
          }

          // 获取第一个图像数据
          const retryImageData = retryResult.images[0];
          console.log("Retry image data type:", typeof retryImageData);

          // 如果是字符串，记录前 100 个字符以便调试
          if (typeof retryImageData === 'string') {
            console.log("Retry image data preview:", retryImageData.substring(0, 100));
          }

          let retryImageUrl;

          // 处理图像数据
          if (typeof retryImageData === 'string') {
            // 如果是字符串类型的数据
            if (retryImageData.startsWith('http')) {
              // 如果已经是 URL，直接使用
              retryImageUrl = retryImageData;
              console.log("Using HTTP URL directly (retry)");
            } else if (retryImageData.startsWith('data:')) {
              // 如果已经是 data URL，直接使用
              retryImageUrl = retryImageData;
              console.log("Using data URL directly (retry)");
            } else {
              // 否则假设是 base64 数据，构造 data URL
              retryImageUrl = `data:image/png;base64,${retryImageData}`;
              console.log("Constructed data URL from base64 string (retry)");
            }
          } else if (retryImageData instanceof Uint8Array) {
            // 如果是二进制数据，转换为 base64
            const base64 = Buffer.from(retryImageData).toString('base64');
            retryImageUrl = `data:image/png;base64,${base64}`;
            console.log("Constructed data URL from Uint8Array (retry)");
          } else {
            console.error("Unexpected retry image data format:", retryImageData);
            throw new Error("Unexpected retry image data format");
          }

          return NextResponse.json({
            success: true,
            imageUrl: retryImageUrl,
          });
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          throw retryError;
        }
      }

      throw apiError;
    }
  } catch (error) {
    console.error("Error generating image:", error);

    // 返回更详细的错误信息
    return new Response(
      JSON.stringify({
        error: "Error generating image",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
