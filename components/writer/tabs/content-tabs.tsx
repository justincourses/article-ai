'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditableContent } from '../editable-content'
import { useContentStore } from '@/store/writer/content-store'
import { CONTENT_TABS } from '@/constants/writer'
import { Loader2 } from 'lucide-react'

export function ContentTabs() {
  const {
    outlineMessages,
    articleMessages,
    summaryMessages,
    activeContentTab,
    setActiveContentTab,
    isGeneratingOutline,
    isGeneratingArticle,
    isGeneratingSummary
  } = useContentStore()

  return (
    <Tabs
      value={activeContentTab}
      onValueChange={(value) => setActiveContentTab(value as typeof CONTENT_TABS[keyof typeof CONTENT_TABS])}
      className="flex flex-col h-full"
    >
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value={CONTENT_TABS.OUTLINE} className="flex-1">
          大纲
          {isGeneratingOutline && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </TabsTrigger>
        <TabsTrigger value={CONTENT_TABS.ARTICLE} className="flex-1">
          内容
          {isGeneratingArticle && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </TabsTrigger>
        <TabsTrigger value={CONTENT_TABS.SUMMARY} className="flex-1">
          摘要
          {isGeneratingSummary && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </TabsTrigger>
      </TabsList>

      <TabsContent value={CONTENT_TABS.OUTLINE} className="h-[calc(100%-48px)] overflow-auto">
        <EditableContent
          messages={outlineMessages}
          isLoading={isGeneratingOutline}
          key={`outline-${outlineMessages.length}`}
        />
      </TabsContent>

      <TabsContent value={CONTENT_TABS.ARTICLE} className="h-[calc(100%-48px)] overflow-auto">
        <EditableContent
          messages={articleMessages}
          isLoading={isGeneratingArticle}
          key={`article-${articleMessages.length}`}
        />
      </TabsContent>

      <TabsContent value={CONTENT_TABS.SUMMARY} className="h-[calc(100%-48px)] overflow-auto">
        <EditableContent
          messages={summaryMessages}
          isLoading={isGeneratingSummary}
          key={`summary-${summaryMessages.length}`}
        />
      </TabsContent>
    </Tabs>
  )
}
