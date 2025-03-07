'use client'

import React from 'react'
import { useChat } from 'ai/react'
import { useWriterConfig } from '@/store/writer/config'
import { useContentStore } from '@/store/writer/content-store'
import { useUIStore } from '@/store/writer/ui-store'
import { API_ENDPOINTS, CHAT_IDS } from '@/constants/writer'
import { DEFAULT_MODELS } from '@/constants/writer/models'

export function useArticleService() {
  const { articleConfig } = useWriterConfig()
  const {
    outline, setOutline,
    article, setArticle,
    summary, setSummary,
    setOutlineMessages,
    setArticleMessages,
    setSummaryMessages,
    setIsGeneratingOutline,
    setIsGeneratingArticle,
    setIsGeneratingSummary
  } = useContentStore()
  const { additionalRequirements } = useUIStore()

  // Generate outline
  const {
    messages: outlineMessages,
    append: appendOutline,
    isLoading: isGeneratingOutlineState,
    reload: reloadOutline,
    setMessages: setOutlineMessagesInternal,
  } = useChat({
    api: API_ENDPOINTS.STRUCTURE,
    id: CHAT_IDS.OUTLINE_GENERATOR,
    body: {
      time: new Date().toISOString(),
      topic: articleConfig.topic,
      style: articleConfig.style,
      coreIdeas: articleConfig.coreIdeas,
      wordCount: articleConfig.wordCount,
      targetAudience: articleConfig.targetAudience,
      exampleArticle: articleConfig.exampleArticle
    },
    onFinish: (message) => {
      setOutline(message.content);
    },
  })

  // Generate article
  const {
    messages: articleMessages,
    append: appendArticle,
    isLoading: isGeneratingArticleState,
    reload: reloadArticle,
    setMessages: setArticleMessagesInternal,
  } = useChat({
    api: API_ENDPOINTS.ARTICLE,
    id: CHAT_IDS.ARTICLE_GENERATOR,
    body: {
      time: new Date().toISOString(),
      topic: articleConfig.topic,
      style: articleConfig.style,
      coreIdeas: articleConfig.coreIdeas,
      outline: outline,
      wordCount: articleConfig.wordCount
    },
    onFinish: (message) => {
      setArticle(message.content);
    },
  })

  // Generate summary
  const {
    messages: summaryMessages,
    append: appendSummary,
    isLoading: isGeneratingSummaryState,
    reload: reloadSummary,
    setMessages: setSummaryMessagesInternal,
  } = useChat({
    api: API_ENDPOINTS.SUMMARY,
    id: CHAT_IDS.SUMMARY_GENERATOR,
    body: {
      time: new Date().toISOString(),
      article: article
    },
    onFinish: (message) => {
      setSummary(message.content);
    },
  })

  // Update messages in the content store
  React.useEffect(() => {
    setOutlineMessages(outlineMessages);
    // If messages are empty, ensure outline is also empty
    if (outlineMessages.length === 0) {
      setOutline('');
    }
  }, [outlineMessages, setOutlineMessages, setOutline]);

  React.useEffect(() => {
    setArticleMessages(articleMessages);
    // If messages are empty, ensure article is also empty
    if (articleMessages.length === 0) {
      setArticle('');
    }
  }, [articleMessages, setArticleMessages, setArticle]);

  React.useEffect(() => {
    setSummaryMessages(summaryMessages);
    // If messages are empty, ensure summary is also empty
    if (summaryMessages.length === 0) {
      setSummary('');
    }
  }, [summaryMessages, setSummaryMessages, setSummary]);

  // Update loading states in the content store
  React.useEffect(() => {
    setIsGeneratingOutline(isGeneratingOutlineState);
  }, [isGeneratingOutlineState, setIsGeneratingOutline]);

  React.useEffect(() => {
    setIsGeneratingArticle(isGeneratingArticleState);
  }, [isGeneratingArticleState, setIsGeneratingArticle]);

  React.useEffect(() => {
    setIsGeneratingSummary(isGeneratingSummaryState);
  }, [isGeneratingSummaryState, setIsGeneratingSummary]);

  // Handler functions
  const handleGenerateOutline = async () => {
    // Clear existing outline before generating new one
    setOutline('');
    // Reset the chat messages completely
    setOutlineMessagesInternal([]);

    await appendOutline({
      content: `请根据以下信息生成一个详细的文章大纲：
主题：${articleConfig.topic}
风格：${articleConfig.style}
核心思路：${articleConfig.coreIdeas}
字数：${articleConfig.wordCount}
目标受众：${JSON.stringify(articleConfig.targetAudience)}
${articleConfig.exampleArticle ? `参考文章：${articleConfig.exampleArticle}` : ''}`,
      role: 'user',
    });
  }

  const handleGenerateArticle = async (requirements?: string) => {
    // Clear existing article before generating new one
    setArticle('');
    // Reset the chat messages completely
    setArticleMessagesInternal([]);

    const req = requirements || additionalRequirements;
    await appendArticle({
      content: `请根据以下大纲生成一篇完整的文章：
${outline}
${req ? `额外要求：${req}` : ''}`,
      role: 'user',
    });
  }

  const handleGenerateSummary = async () => {
    // Clear existing summary before generating new one
    setSummary('');
    // Reset the chat messages completely
    setSummaryMessagesInternal([]);

    await appendSummary({
      content: `请为以下文章生成一个简洁的摘要：
${article}`,
      role: 'user',
    });
  }

  return {
    handleGenerateOutline,
    handleGenerateArticle,
    handleGenerateSummary,
    outlineMessages,
    articleMessages,
    summaryMessages,
    isGeneratingOutline: isGeneratingOutlineState,
    isGeneratingArticle: isGeneratingArticleState,
    isGeneratingSummary: isGeneratingSummaryState,
  }
}
