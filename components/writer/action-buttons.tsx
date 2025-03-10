'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useContentStore } from '@/store/writer/content-store'
import { useUIStore } from '@/store/writer/ui-store'
import { useArticleService } from './services/article-service'
import { CONTENT_TABS } from '@/constants/writer'
import { useWriterConfig } from '@/store/writer/config'
import { Eraser } from 'lucide-react'

export function ActionButtons() {
  const {
    outline,
    article,
    summary,
    activeContentTab,
    setActiveContentTab
  } = useContentStore()

  const { setIsDialogOpen } = useUIStore()
  const { articleConfig } = useWriterConfig()

  const {
    handleGenerateOutline,
    handleGenerateArticle,
    handleGenerateSummary,
    isGeneratingOutline,
    isGeneratingArticle,
    isGeneratingSummary
  } = useArticleService()

  const handleReset = () => {
    if (window.confirm('确定要重置所有配置吗？这将清除所有已保存的设置。')) {
      if (typeof window !== 'undefined') {
        localStorage.clear()
        window.location.reload()
      }
    }
  }

  const handleOutlineGeneration = () => {
    if (!articleConfig.topic || !articleConfig.style || !articleConfig.wordCount || !articleConfig.coreIdeas) {
      setIsDialogOpen(true)
      return
    }
    handleGenerateOutline()
    setActiveContentTab(CONTENT_TABS.OUTLINE)
  }

  const handleArticleGeneration = () => {
    if (!outline) {
      handleOutlineGeneration()
      return
    }
    handleGenerateArticle()
    setActiveContentTab(CONTENT_TABS.ARTICLE)
  }

  const handleSummaryGeneration = () => {
    if (!article) {
      handleArticleGeneration()
      return
    }
    handleGenerateSummary()
    setActiveContentTab(CONTENT_TABS.SUMMARY)
  }

  return (
    <div className="flex flex-col gap-2 flex-wrap lg:flex-row lg:gap-1 mt-12 border-t pt-4">
      <Button
        onClick={handleOutlineGeneration}
        disabled={isGeneratingOutline}
        size="sm"
        className="w-auto px-4 bg-blue-500 hover:bg-blue-400 transition-colors text-white rounded-md"
      >
        {isGeneratingOutline
          ? "✨ 生成大纲中..."
          : outline
            ? "✨ 再次生成大纲"
            : "✨ 生成大纲"}
      </Button>
      <Button
        onClick={handleArticleGeneration}
        disabled={isGeneratingArticle || !outline}
        size="sm"
        className="w-auto px-4 bg-purple-500 hover:bg-purple-400 transition-colors text-white rounded-md"
      >
        {isGeneratingArticle
          ? "🔮 生成文章中..."
          : article
            ? "🔮 再次生成文章"
            : "🔮 生成文章"}
      </Button>
      <Button
        onClick={handleSummaryGeneration}
        disabled={isGeneratingSummary || !article}
        size="sm"
        className="w-auto px-4 bg-teal-600 hover:bg-teal-500 transition-colors text-white rounded-md"
      >
        {isGeneratingSummary
          ? "⚡ 生成摘要中..."
          : summary
            ? "⚡ 再次生成摘要"
            : "⚡ 生成摘要"}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReset}
        className="ml-auto"
        title="重置所有配置"
      >
        <Eraser className="h-4 w-4 text-gray-500 hover:text-red-500" />
      </Button>
    </div>
  );
}
