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

// Define the store state and actions
interface WriterConfigState {
  config: WriterConfig
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

// Create the store with persistence
export const useWriterConfig = create<WriterConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,

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
        set({ config: defaultConfig })
    }),
    {
      name: 'writer-config-storage', // name for the localStorage key
      partialize: (state) => ({ config: state.config }), // only persist the config
    }
  )
)
