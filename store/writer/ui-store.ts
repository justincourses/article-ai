import { create } from 'zustand'
import { TABS } from '@/constants/writer'

export type ConfigTab = typeof TABS[keyof typeof TABS]

interface UIState {
  // Dialog state
  isDialogOpen: boolean
  additionalRequirements: string

  // Config tabs
  activeConfigTab: ConfigTab

  // Actions
  setIsDialogOpen: (isOpen: boolean) => void
  setAdditionalRequirements: (requirements: string) => void
  setActiveConfigTab: (tab: ConfigTab) => void
  resetUI: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isDialogOpen: false,
  additionalRequirements: '',
  activeConfigTab: TABS.BASIC,

  // Actions
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
  setAdditionalRequirements: (additionalRequirements) => set({ additionalRequirements }),
  setActiveConfigTab: (activeConfigTab) => set({ activeConfigTab }),
  resetUI: () => set({
    isDialogOpen: false,
    additionalRequirements: '',
    activeConfigTab: TABS.BASIC,
  }),
}))
