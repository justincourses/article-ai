'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useContentStore } from '@/store/writer/content-store'
import { useUIStore } from '@/store/writer/ui-store'
import { useArticleService } from './services/article-service'
import { CONTENT_TABS } from '@/constants/writer'
import { useWriterConfig } from '@/store/writer/config'

export function ActionButtons() {
  const {
    outline,
    article,
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

  // 检查表单是否有效
  const isFormValid = articleConfig.topic &&
    articleConfig.style &&
    articleConfig.coreIdeas &&
    articleConfig.wordCount;

  const handleArticleGeneration = () => {
    if (outline) {
      setIsDialogOpen(true)
    }
  }

  const handleSummaryGeneration = () => {
    if (article) {
      handleGenerateSummary()
      setActiveContentTab(CONTENT_TABS.SUMMARY)
    }
  }

  const handleOutlineGeneration = () => {
    if (isFormValid) {
      handleGenerateOutline()
      setActiveContentTab(CONTENT_TABS.OUTLINE)
    }
  }

  return (
    <div className="flex flex-col-3 space-x-3">
      <Button
        onClick={handleOutlineGeneration}
        disabled={!isFormValid || isGeneratingOutline}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md"
      >
        ✨ {isGeneratingOutline ? '生成大纲中...' : '生成大纲'}
      </Button>

      <Button
        onClick={handleArticleGeneration}
        disabled={!outline || isGeneratingArticle}
        className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 text-white shadow-md"
      >
        🔮 {isGeneratingArticle ? '生成文章中...' : '生成文章'}
      </Button>

      <Button
        onClick={handleSummaryGeneration}
        disabled={!article || isGeneratingSummary}
        className="w-full bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white shadow-md"
      >
        ⚡ {isGeneratingSummary ? '生成摘要中...' : '生成摘要'}
      </Button>
    </div>
  )
}
