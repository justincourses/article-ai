import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  structureTemplate: string
  style: string
  coreIdeas: string
  exampleArticle: string
}

// Define the store state and actions
interface WriterConfigState {
  config: WriterConfig
  articleConfig: ArticleConfig
  paragraphs: ArticleParagraph[]
  markdownContent: string
  configComplete: boolean
  paragraphsComplete: boolean
  activeTab: 'config' | 'paragraphs' | 'preview'

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
}

// Default configuration
const defaultConfig: WriterConfig = {
  fontSize: 16,
  fontFamily: 'Inter',
  theme: 'system',
  lineSpacing: 1.5,
  autoSave: true,
  spellCheck: true,
  wordCount: true,
  focusMode: false,
  customShortcuts: {}
}

// Default article configuration
const defaultArticleConfig: ArticleConfig = {
  topic: '',
  structureTemplate: '',
  style: '',
  coreIdeas: '',
  exampleArticle: ''
}

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
          // Reset dependencies when config changes
          paragraphs: [],
          markdownContent: '',
          paragraphsComplete: false
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
          activeTab: 'config'
        }),

      resetParagraphs: () =>
        set({
          paragraphs: [],
          markdownContent: '',
          paragraphsComplete: false
        }),

      resetPreview: () =>
        set({ markdownContent: '' })
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
        activeTab: state.activeTab
      }), // persist all article generation state
    }
  )
)
