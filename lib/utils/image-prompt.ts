/**
 * Extracts image prompts from a summary response
 * @param text The summary text containing image prompts
 * @returns An array of extracted image prompts
 */
export function extractImagePrompts(text: string): string[] {
  if (!text) return [];

  const imagePrompts: string[] = [];
  const imagePromptRegex = /## 图像提示词(?:\d*)\s*\n([\s\S]*?)(?:\n##|$)/g;
  let match;

  while ((match = imagePromptRegex.exec(text)) !== null) {
    if (match[1] && match[1].trim()) {
      imagePrompts.push(match[1].trim());
    }
  }

  return imagePrompts;
}

/**
 * Generates an image using the first valid image prompt from a summary
 * @param summaryText The summary text containing image prompts
 * @returns A Promise that resolves to the image URL or null if no image was generated
 */
export async function generateImageFromSummary(summaryText: string): Promise<string | null> {
  const imagePrompts = extractImagePrompts(summaryText);

  if (imagePrompts.length === 0) {
    return null;
  }

  // Use the first image prompt
  const imagePrompt = imagePrompts[0];

  try {
    // Call our image generation API
    const imageResponse = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: imagePrompt }),
    });

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();

      if (imageData.success && imageData.imageUrl) {
        return imageData.imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
