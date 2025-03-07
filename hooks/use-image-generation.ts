import { useState, useCallback } from 'react';
import { extractImagePrompts } from '@/lib/utils/image-prompt';
import { API_ENDPOINTS } from '@/constants/writer';

interface UseImageGenerationResult {
  isGenerating: boolean;
  imageUrl: string | null;
  imagePrompt: string | null;
  error: string | null;
  generateImage: (summaryText: string) => Promise<string | null>;
}

/**
 * Hook for generating images from summary text
 */
export function useImageGeneration(): UseImageGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (summaryText: string): Promise<string | null> => {
    if (!summaryText) {
      setError('No summary text provided');
      return null;
    }

    if (isGenerating) {
      return null;
    }

    setIsGenerating(true);
    setError(null);
    setImageUrl(null); // 清除之前的图片

    try {
      // Extract image prompts from the summary
      const imagePrompts = extractImagePrompts(summaryText);

      if (imagePrompts.length === 0) {
        setError('未在摘要中找到图像提示词');
        setIsGenerating(false);
        return null;
      }

      // Use the first image prompt
      const prompt = imagePrompts[0];
      setImagePrompt(prompt);

      console.log('Generating image with prompt:', prompt.substring(0, 50) + '...');

      // Call the image generation API
      const response = await fetch(API_ENDPOINTS.IMAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size: 'square' // 使用正方形尺寸，最稳定
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('无法解析API响应');
      }

      console.log('Image API response:', data);

      if (!response.ok) {
        // 尝试从响应中提取错误信息
        const errorMessage = data.message || data.error || response.statusText;
        throw new Error(`图像生成失败: ${errorMessage}`);
      }

      if (!data || !data.success) {
        throw new Error('API返回了失败状态');
      }

      if (!data.imageUrl) {
        throw new Error('API返回的数据中没有图片URL');
      }

      // 验证URL格式
      if (typeof data.imageUrl !== 'string') {
        console.error('Invalid image URL format:', data.imageUrl);
        throw new Error('API返回了无效的图片URL格式');
      }

      // 接受 http URL 或 data URL
      if (!data.imageUrl.startsWith('http') && !data.imageUrl.startsWith('data:')) {
        console.error('Invalid image URL format:', data.imageUrl);
        throw new Error('API返回了无效的图片URL格式');
      }

      console.log('Image generated successfully:', data.imageUrl.substring(0, 50) + '...');
      setImageUrl(data.imageUrl);
      setIsGenerating(false);
      return data.imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      console.error('Error in generateImage:', errorMessage);
      setError(`图像生成错误: ${errorMessage}`);
      setIsGenerating(false);
      return null;
    }
  }, [isGenerating]); // 只依赖 isGenerating 状态

  return {
    isGenerating,
    imageUrl,
    imagePrompt,
    error,
    generateImage,
  };
}
