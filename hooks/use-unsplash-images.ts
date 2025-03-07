import { useState, useCallback } from 'react';
import { extractImagePrompts } from '@/lib/utils/image-prompt';
import { API_ENDPOINTS } from '@/constants/writer';

interface UnsplashPhoto {
  id: string;
  url: string;
  thumb: string;
  download: string;
  width: number;
  height: number;
  color: string;
  description: string;
  user: {
    name: string;
    username: string;
    link: string;
  };
}

interface UseUnsplashImagesResult {
  isLoading: boolean;
  photos: UnsplashPhoto[];
  selectedPhoto: UnsplashPhoto | null;
  error: string | null;
  searchImages: (query: string) => Promise<UnsplashPhoto[]>;
  selectPhoto: (photo: UnsplashPhoto | null) => void;
  trackDownload: (photo: UnsplashPhoto) => Promise<void>;
}

/**
 * Hook for searching and selecting Unsplash images
 */
export function useUnsplashImages(): UseUnsplashImagesResult {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to search for images
  const searchImages = useCallback(async (query: string): Promise<UnsplashPhoto[]> => {
    if (!query) {
      setError('请输入搜索关键词');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching for images with query:', query);

      // Call the Unsplash API endpoint
      const response = await fetch(`/api/picture?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        let errorMessage = `搜索图片失败: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Ignore JSON parsing error
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API response received:', data);

      if (!data.success) {
        throw new Error(data.message || '搜索图片失败');
      }

      // 确保 data.photos 存在且是数组
      if (!data.photos || !Array.isArray(data.photos)) {
        console.error('API返回的数据格式不正确:', data);
        throw new Error('API返回的数据格式不正确');
      }

      console.log(`Found ${data.photos.length} images`);
      setPhotos(data.photos);
      return data.photos;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      console.error('Error searching images:', errorMessage);
      setError(`搜索图片错误: ${errorMessage}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to select a photo
  const selectPhoto = useCallback((photo: UnsplashPhoto | null) => {
    setSelectedPhoto(photo);
  }, []);

  // Function to track downloads (required by Unsplash API guidelines)
  const trackDownload = useCallback(async (photo: UnsplashPhoto) => {
    if (!photo || !photo.download) {
      return;
    }

    try {
      await fetch('/api/picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          downloadLocation: photo.download,
        }),
      });
    } catch (err) {
      console.error('Error tracking download:', err);
      // Don't throw error as this is not critical for the user experience
    }
  }, []);

  return {
    isLoading,
    photos,
    selectedPhoto,
    error,
    searchImages,
    selectPhoto,
    trackDownload,
  };
}

// Helper function to extract search terms from summary text
export function extractSearchTermsFromSummary(summaryText: string): string[] {
  // 首先尝试使用图像提示词（如果有的话）
  const imagePrompts = extractImagePrompts(summaryText);
  if (imagePrompts.length > 0) {
    // 从图像提示词中提取主要主题
    return imagePrompts.map(prompt => {
      // 提取前几个单词（可能是主要主题）
      // 对于中文，我们取前10个字符作为搜索词
      if (/[\u4e00-\u9fa5]/.test(prompt)) { // 检测是否包含中文字符
        return prompt.substring(0, 10).trim();
      }
      // 对于英文，我们取前3个单词
      const words = prompt.split(' ').slice(0, 3).join(' ');
      return words;
    });
  }

  // 如果没有图像提示词，从摘要中提取关键词
  // 这是一个简单的实现 - 可以使用NLP进行改进

  // 1. 尝试从标题中提取
  const lines = summaryText.split('\n');
  const titleMatch = lines[0]?.match(/^#\s+(.+)$/);
  const title = titleMatch ? titleMatch[1].trim() : lines[0]?.replace(/^#\s+/, '').trim();

  if (title && title.length > 3) {
    // 对于中文标题，取前10个字符
    if (/[\u4e00-\u9fa5]/.test(title)) {
      return [title.substring(0, 10)];
    }
    // 对于英文标题，取前3个单词
    return [title.split(' ').slice(0, 3).join(' ')];
  }

  // 2. 尝试从标签中提取
  const tagsMatch = summaryText.match(/##\s+标签\s*\n([^#]+)/);
  if (tagsMatch) {
    const tagsText = tagsMatch[1].trim();
    const tags = tagsText.match(/\[#([^\]]+)\]/g);
    if (tags && tags.length > 0) {
      // 使用第一个标签作为搜索词
      const firstTag = tags[0].replace(/\[#|\]/g, '').trim();
      if (firstTag) return [firstTag];
    }
  }

  // 3. 尝试从主要内容部分提取
  const contentMatch = summaryText.match(/##\s+主要内容\s*\n([^#]+)/);
  if (contentMatch) {
    const contentText = contentMatch[1].trim();
    const points = contentText.split('\n').map(line => line.replace(/^-\s+/, '').trim());
    if (points.length > 0) {
      // 使用第一个要点作为搜索词
      const firstPoint = points[0];
      // 对于中文，取前10个字符
      if (/[\u4e00-\u9fa5]/.test(firstPoint)) {
        return [firstPoint.substring(0, 10)];
      }
      // 对于英文，取前3个单词
      return [firstPoint.split(' ').slice(0, 3).join(' ')];
    }
  }

  // 4. 回退到第一句话
  const firstSentence = summaryText.split(/[.。!！?？]/, 1)[0].trim();
  if (firstSentence) {
    // 对于中文，取前10个字符
    if (/[\u4e00-\u9fa5]/.test(firstSentence)) {
      return [firstSentence.substring(0, 10)];
    }
    // 对于英文，取前5个单词
    return [firstSentence.split(' ').slice(0, 5).join(' ')];
  }

  // 5. 最后的回退方案
  return ["nature landscape"]; // 默认搜索词
}
