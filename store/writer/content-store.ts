import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CONTENT_TABS } from '@/constants/writer'
import { Message } from 'ai'

export type ContentTab = typeof CONTENT_TABS[keyof typeof CONTENT_TABS]

interface ContentState {
  // Content data
  outlineMessages: Message[]
  articleMessages: Message[]
  summaryMessages: Message[]

  // Content strings (for convenience)
  outline: string
  article: string
  summary: string

  // Active tab
  activeContentTab: ContentTab

  // Loading states
  isGeneratingOutline: boolean
  isGeneratingArticle: boolean
  isGeneratingSummary: boolean

  // Actions
  setOutlineMessages: (messages: Message[]) => void
  setArticleMessages: (messages: Message[]) => void
  setSummaryMessages: (messages: Message[]) => void
  setOutline: (outline: string) => void
  setArticle: (article: string) => void
  setSummary: (summary: string) => void
  setActiveContentTab: (tab: ContentTab) => void
  setIsGeneratingOutline: (isGenerating: boolean) => void
  setIsGeneratingArticle: (isGenerating: boolean) => void
  setIsGeneratingSummary: (isGenerating: boolean) => void
  resetContent: () => void
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      // Initial state
      outlineMessages: [],
      articleMessages: [],
      summaryMessages: [],
      outline: '',
      article: '',
      summary: '',
      activeContentTab: CONTENT_TABS.OUTLINE,
      isGeneratingOutline: false,
      isGeneratingArticle: false,
      isGeneratingSummary: false,

      // Actions
      setOutlineMessages: (outlineMessages) => set({ outlineMessages }),
      setArticleMessages: (articleMessages) => set({ articleMessages }),
      setSummaryMessages: (summaryMessages) => set({ summaryMessages }),
      setOutline: (outline) => set({ outline }),
      setArticle: (article) => set({ article }),
      setSummary: (summary) => set({ summary }),
      setActiveContentTab: (activeContentTab) => set({ activeContentTab }),
      setIsGeneratingOutline: (isGeneratingOutline) => set({ isGeneratingOutline }),
      setIsGeneratingArticle: (isGeneratingArticle) => set({ isGeneratingArticle }),
      setIsGeneratingSummary: (isGeneratingSummary) => set({ isGeneratingSummary }),
      resetContent: () => set({
        outlineMessages: [],
        articleMessages: [],
        summaryMessages: [],
        outline: '',
        article: '',
        summary: '',
        isGeneratingOutline: false,
        isGeneratingArticle: false,
        isGeneratingSummary: false,
      }),
    }),
    {
      name: 'writer-content',
    }
  )
)
