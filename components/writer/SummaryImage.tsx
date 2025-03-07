'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useImageGeneration } from '@/hooks/use-image-generation';
import { Button } from '@/components/ui/button';

interface SummaryImageProps {
  summaryText: string;
  autoGenerate?: boolean;
}

export function SummaryImage({ summaryText, autoGenerate = false }: SummaryImageProps) {
  const { isGenerating, imageUrl, imagePrompt, error, generateImage } = useImageGeneration();
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);
  const initialRenderRef = useRef(true);
  const [retryCount, setRetryCount] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);

  // 只有当 autoGenerate 为 true 时才自动生成图片
  useEffect(() => {
    if (initialRenderRef.current && summaryText && autoGenerate) {
      initialRenderRef.current = false;
      generateImage(summaryText);
      setHasAttemptedGeneration(true);
    }
  }, [summaryText, autoGenerate, generateImage]);

  const handleGenerateImage = () => {
    if (summaryText) {
      setRetryCount(prev => prev + 1);
      setImageError(null);
      generateImage(summaryText);
      setHasAttemptedGeneration(true);
    }
  };

  const handleImageError = () => {
    console.error('Image failed to load:', imageUrl);
    setImageError('图片加载失败，请重试');
  };

  if (!summaryText) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">文章配图</h3>
        <Button
          onClick={handleGenerateImage}
          disabled={isGenerating}
          variant={hasAttemptedGeneration ? "outline" : "default"}
          size="sm"
        >
          {isGenerating ? '生成中...' : (hasAttemptedGeneration ? '重新生成图片' : '生成图片')}
        </Button>
      </div>

      {(error || imageError) && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
          <p className="font-medium mb-1">生成图片时出错:</p>
          <p>{error || imageError}</p>
          <div className="mt-2">
            <Button
              onClick={handleGenerateImage}
              variant="outline"
              size="sm"
              disabled={isGenerating}
            >
              重试
            </Button>
          </div>
        </div>
      )}

      {imageUrl && !imageError && (
        <div className="space-y-3">
          <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={imageUrl}
              alt="Generated image for the summary"
              fill
              className="object-cover"
              priority
              onError={handleImageError}
            />
          </div>

          {imagePrompt && (
            <div className="text-sm text-gray-500 italic">
              <p className="font-medium">图像提示词:</p>
              <p>{imagePrompt}</p>
            </div>
          )}
        </div>
      )}

      {!imageUrl && !error && !imageError && !isGenerating && hasAttemptedGeneration && (
        <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md">
          无法从摘要中生成图片。请确保摘要中包含图像提示词。
          <div className="mt-2">
            <Button
              onClick={handleGenerateImage}
              variant="outline"
              size="sm"
            >
              重试
            </Button>
          </div>
        </div>
      )}

      {!imageUrl && !error && !imageError && !isGenerating && !hasAttemptedGeneration && (
        <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md flex flex-col items-center">
          <p className="mb-2">点击"生成图片"按钮，根据摘要内容生成相关图片</p>
          <div className="w-full max-w-md aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="p-4 text-sm text-blue-500 bg-blue-50 rounded-md flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          正在生成图片...
        </div>
      )}
    </div>
  );
}
