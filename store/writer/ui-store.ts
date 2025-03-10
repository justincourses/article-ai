import { create } from 'zustand'
import { TABS } from '@/constants/writer'

export type ConfigTab = typeof TABS[keyof typeof TABS]
export type DialogType = 'outline' | 'article' | null

interface UIState {
  // Dialog state
  isDialogOpen: boolean
  dialogType: DialogType
  additionalRequirements: string

  // Config tabs
  activeConfigTab: ConfigTab

  // Actions
  setIsDialogOpen: (isOpen: boolean) => void
  setDialogType: (type: DialogType) => void
  setAdditionalRequirements: (requirements: string) => void
  setActiveConfigTab: (tab: ConfigTab) => void
  resetUI: () => void
  clearStorage: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isDialogOpen: false,
  dialogType: null,
  additionalRequirements: '',
  activeConfigTab: TABS.BASIC,

  // Actions
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
  setDialogType: (dialogType) => set({ dialogType }),
  setAdditionalRequirements: (additionalRequirements) => set({ additionalRequirements }),
  setActiveConfigTab: (activeConfigTab) => set({ activeConfigTab }),
  resetUI: () => set({
    isDialogOpen: false,
    dialogType: null,
    additionalRequirements: '',
    activeConfigTab: TABS.BASIC,
  }),
  clearStorage: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      window.location.reload()
    }
  }
}))
