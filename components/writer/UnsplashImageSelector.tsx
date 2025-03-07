'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUnsplashImages, extractSearchTermsFromSummary, extractUnsplashKeywordFromSummary } from '@/hooks/use-unsplash-images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UnsplashImageSelectorProps {
  summaryText: string;
  autoSearch?: boolean;
  isApiComplete?: boolean;
}

export function UnsplashImageSelector({
  summaryText,
  autoSearch = true,
  isApiComplete = false
}: UnsplashImageSelectorProps) {
  const { isLoading, photos, selectedPhoto, error, searchImages, selectPhoto, trackDownload } = useUnsplashImages();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const initialSearchRef = useRef(true);
  const contentCompleteRef = useRef(false);
  const [extractedKeyword, setExtractedKeyword] = useState<string | null>(null);
  const [keywordSource, setKeywordSource] = useState<string>('');

  // 检测内容是否完整，只在内容完成后触发搜索
  useEffect(() => {
    // 检查 summaryText 是否完整（不包含加载指示器或者占位符）
    const isContentComplete = summaryText &&
                             !summaryText.includes('...') &&
                             summaryText.length > 50 && // 假设完整内容至少有50个字符
                             isApiComplete; // 确保 API 已完成

    console.log('Content check:', {
      summaryLength: summaryText?.length || 0,
      isComplete: isContentComplete,
      hasSearched,
      autoSearch,
      isApiComplete
    });

    // 如果内容完整且之前未完成过，且未搜索过，则进行搜索
    if (isContentComplete && !contentCompleteRef.current && !hasSearched && autoSearch) {
      contentCompleteRef.current = true;

      // 提取 Unsplash 搜索关键词
      const keyword = extractUnsplashKeywordFromSummary(summaryText);
      console.log('Extracted Unsplash keyword:', keyword);

      if (keyword) {
        setExtractedKeyword(keyword);
        setSearchQuery(keyword);
        setKeywordSource('从 Unsplash搜索关键词 部分提取');
        searchImages(keyword);
        setHasSearched(true);
      } else {
        // 如果没有找到专门的关键词部分，尝试从摘要中提取
        const fallbackKeyword = extractSearchTermsFromSummary(summaryText)[0];
        if (fallbackKeyword) {
          setExtractedKeyword(fallbackKeyword);
          setSearchQuery(fallbackKeyword);
          setKeywordSource('从摘要内容提取');
          searchImages(fallbackKeyword);
          setHasSearched(true);
        }
      }
    }
  }, [summaryText, autoSearch, hasSearched, searchImages, isApiComplete]);

  // 当 API 状态从未完成变为完成时，重置状态以触发新的搜索
  useEffect(() => {
    if (isApiComplete && !contentCompleteRef.current) {
      console.log('API 状态已完成，准备重新提取关键词');
      // 不立即重置，给上面的 useEffect 一个机会先执行
      const timer = setTimeout(() => {
        if (!hasSearched) {
          contentCompleteRef.current = false;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isApiComplete, hasSearched]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchImages(searchQuery);
      setHasSearched(true);
      setKeywordSource('用户手动搜索');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectPhoto = (photo: any) => {
    selectPhoto(photo);
    trackDownload(photo);
  };

  if (!summaryText) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="输入关键词搜索图片"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
          {isLoading ? '搜索中...' : '搜索'}
        </Button>
      </div>

      {searchQuery && !hasSearched && extractedKeyword && (
        <div className="text-xs text-gray-500 mt-1">
          系统已从摘要中提取关键词: <span className="font-medium">{extractedKeyword}</span>
        </div>
      )}

      {extractedKeyword && hasSearched && (
        <div className="text-xs text-gray-500 mt-1 mb-2">
          当前使用的关键词: <span className="font-medium">{searchQuery}</span>
          {keywordSource && <span className="ml-1">({keywordSource})</span>}
          {searchQuery !== extractedKeyword && (
            <button
              className="ml-2 text-blue-500 hover:underline"
              onClick={() => {
                setSearchQuery(extractedKeyword);
                searchImages(extractedKeyword);
              }}
            >
              恢复原关键词
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {selectedPhoto ? (
        <div className="space-y-3">
          <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg border border-gray-200 group cursor-pointer"
               onClick={() => {
                 window.open(selectedPhoto.url, '_blank');
                 trackDownload(selectedPhoto);
               }}>
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.description || "Selected image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                在新标签页查看原图
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Photo by{' '}
            <a
              href={`${selectedPhoto.user.link}?utm_source=article_writer_app&utm_medium=referral`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {selectedPhoto.user.name}
            </a>{' '}
            on{' '}
            <a
              href="https://unsplash.com/?utm_source=article_writer_app&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Unsplash
            </a>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={() => selectPhoto(null)}>
              选择其他图片
            </Button>
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="p-4 text-sm text-blue-500 bg-blue-50 rounded-md flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在搜索图片...
            </div>
          ) : photos.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square cursor-pointer rounded-md overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors group"
                    onClick={() => handleSelectPhoto(photo)}
                  >
                    <Image
                      src={photo.thumb}
                      alt={photo.description || "Unsplash image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-0 right-0 p-1">
                      <button
                        className="bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止事件冒泡，不触发选择图片
                          window.open(photo.url, '_blank');
                          trackDownload(photo);
                        }}
                        title="在新标签页查看原图"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">
                Photos from{' '}
                <a
                  href="https://unsplash.com/?utm_source=article_writer_app&utm_medium=referral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Unsplash
                </a>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md text-center">
              未找到相关图片，请尝试其他关键词
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-md flex flex-col items-center">
              <p className="mb-2">输入关键词搜索相关图片</p>

              {extractedKeyword && (
                <div className="mb-3 text-xs text-blue-600 bg-blue-50 p-2 rounded-md w-full text-center">
                  系统已从摘要中提取关键词: <span className="font-medium">{extractedKeyword}</span>
                  <button
                    className="ml-2 underline"
                    onClick={() => {
                      setSearchQuery(extractedKeyword);
                      searchImages(extractedKeyword);
                      setHasSearched(true);
                    }}
                  >
                    立即搜索
                  </button>
                </div>
              )}

              <div className="w-full max-w-md aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <div className="mt-4 w-full">
                <p className="text-xs mb-2">推荐关键词:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "nature", "business", "technology", "education", "health",
                    "travel", "food", "fitness", "art", "music",
                    "science", "sports", "fashion", "architecture", "animals",
                    "people", "city", "landscape", "abstract", "work",
                    "office", "meeting", "coding", "design", "marketing",
                    "finance", "meditation", "family", "friends", "celebration"
                  ].map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => {
                        setSearchQuery(keyword);
                        searchImages(keyword);
                        setHasSearched(true);
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
