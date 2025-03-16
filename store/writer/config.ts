import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_WRITER_CONFIG, DEFAULT_ARTICLE_CONFIG } from '@/constants/writer/models'

// Define the type for writer configuration
export interface WriterConfig {
  fontSize: number
  fontFamily: string
  theme: 'light' | 'dark' | 'system'
  lineSpacing: number
  autoSave: boolean
  spellCheck: boolean
  wordCount: boolean
  focusMode: boolean
  customShortcuts: Record<string, string>
}

// Define article paragraph type
export interface ArticleParagraph {
  id: string
  title: string
  content: string
}

// Define article configuration type
export interface ArticleConfig {
  topic: string
  articleType: string
  style: string
  coreIdeas: string
  exampleArticle?: string
  model: string
  wordCount: string
  outline?: string
  structureAnalysis?: string
  emojiUsage: string
  targetAudience: {
    ageRange: string
    gender: string
    incomeLevel: string
    interests: string[]
    userTraits: string
  }
  writerPersona: {
    type: string
    style: string
    characteristics: string
  }
  reviewerInfo: {
    hasReviewer: boolean
    reviewerType: string
    reviewerRequirements: string
  }
}

export type Step = 'outline' | 'article' | 'summary'

// Define the store state and actions
interface WriterConfigState {
  config: WriterConfig
  articleConfig: ArticleConfig
  paragraphs: ArticleParagraph[]
  markdownContent: string
  configComplete: boolean
  paragraphsComplete: boolean
  activeTab: 'config' | 'paragraphs' | 'preview'
  outline: string
  article: string
  summary: string
  activeStep: Step

  // Writer config actions
  setFontSize: (size: number) => void
  setFontFamily: (family: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLineSpacing: (spacing: number) => void
  toggleAutoSave: () => void
  toggleSpellCheck: () => void
  toggleWordCount: () => void
  toggleFocusMode: () => void
  setCustomShortcut: (key: string, action: string) => void
  resetConfig: () => void

  // Article generation actions
  setArticleConfig: (config: Partial<ArticleConfig>) => void
  setParagraphs: (paragraphs: ArticleParagraph[]) => void
  updateParagraph: (id: string, content: string) => void
  setMarkdownContent: (content: string) => void
  setConfigComplete: (complete: boolean) => void
  setParagraphsComplete: (complete: boolean) => void
  setActiveTab: (tab: 'config' | 'paragraphs' | 'preview') => void
  resetArticle: () => void
  resetParagraphs: () => void
  resetPreview: () => void
  setOutline: (outline: string) => void
  setArticle: (article: string) => void
  setSummary: (summary: string) => void
  setActiveStep: (step: Step) => void
}

// Default configuration
const defaultConfig: WriterConfig = DEFAULT_WRITER_CONFIG

// Default article configuration
export const defaultArticleConfig: ArticleConfig = DEFAULT_ARTICLE_CONFIG

// Create the store with persistence
export const useWriterConfig = create<WriterConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      articleConfig: defaultArticleConfig,
      paragraphs: [],
      markdownContent: '',
      configComplete: false,
      paragraphsComplete: false,
      activeTab: 'config',
      outline: '',
      article: '',
      summary: '',
      activeStep: 'outline',

      // Writer config actions
      setFontSize: (size) =>
        set((state) => ({ config: { ...state.config, fontSize: size } })),

      setFontFamily: (family) =>
        set((state) => ({ config: { ...state.config, fontFamily: family } })),

      setTheme: (theme) =>
        set((state) => ({ config: { ...state.config, theme } })),

      setLineSpacing: (spacing) =>
        set((state) => ({ config: { ...state.config, lineSpacing: spacing } })),

      toggleAutoSave: () =>
        set((state) => ({ config: { ...state.config, autoSave: !state.config.autoSave } })),

      toggleSpellCheck: () =>
        set((state) => ({ config: { ...state.config, spellCheck: !state.config.spellCheck } })),

      toggleWordCount: () =>
        set((state) => ({ config: { ...state.config, wordCount: !state.config.wordCount } })),

      toggleFocusMode: () =>
        set((state) => ({ config: { ...state.config, focusMode: !state.config.focusMode } })),

      setCustomShortcut: (key, action) =>
        set((state) => ({
          config: {
            ...state.config,
            customShortcuts: {
              ...state.config.customShortcuts,
              [key]: action
            }
          }
        })),

      resetConfig: () =>
        set({ config: defaultConfig }),

      // Article generation actions
      setArticleConfig: (config) =>
        set((state) => ({
          articleConfig: { ...state.articleConfig, ...config },
        })),

      setParagraphs: (paragraphs) =>
        set({
          paragraphs,
          // Reset preview when paragraphs change
          markdownContent: '',
          paragraphsComplete: false
        }),

      updateParagraph: (id, content) =>
        set((state) => ({
          paragraphs: state.paragraphs.map(p =>
            p.id === id ? { ...p, content } : p
          ),
          // Reset preview when a paragraph is updated
          markdownContent: '',
          paragraphsComplete: false
        })),

      setMarkdownContent: (content) =>
        set({ markdownContent: content }),

      setConfigComplete: (complete) =>
        set({ configComplete: complete }),

      setParagraphsComplete: (complete) =>
        set({ paragraphsComplete: complete }),

      setActiveTab: (tab) =>
        set({ activeTab: tab }),

      resetArticle: () =>
        set({
          articleConfig: defaultArticleConfig,
          paragraphs: [],
          markdownContent: '',
          configComplete: false,
          paragraphsComplete: false,
          activeTab: 'config',
          outline: '',
          article: '',
          summary: '',
          activeStep: 'outline'
        }),

      resetParagraphs: () =>
        set({
          paragraphs: [],
          markdownContent: '',
          paragraphsComplete: false
        }),

      resetPreview: () =>
        set({ markdownContent: '' }),

      setOutline: (outline) => set({ outline }),

      setArticle: (article) => set({ article }),

      setSummary: (summary) => set({ summary }),

      setActiveStep: (step) => set({ activeStep: step }),
    }),
    {
      name: 'writer-config-storage', // name for the localStorage key
      partialize: (state) => ({
        config: state.config,
        articleConfig: state.articleConfig,
        paragraphs: state.paragraphs,
        markdownContent: state.markdownContent,
        configComplete: state.configComplete,
        paragraphsComplete: state.paragraphsComplete,
        activeTab: state.activeTab,
        outline: state.outline,
        article: state.article,
        summary: state.summary,
        activeStep: state.activeStep
      }), // persist all article generation state
    }
  )
)
