'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUIStore } from '@/store/writer/ui-store'
import { BasicConfigTab } from './tabs/basic-config-tab'
import { AdvancedConfigTab } from './tabs/advanced-config-tab'
import { TABS } from '@/constants/writer'

// Import the AudienceConfigTab dynamically to avoid TypeScript errors
const AudienceConfigTab = dynamic(() => import('./tabs/audience-config-tab').then(mod => mod.AudienceConfigTab), {
  loading: () => <div className="p-4">Loading audience configuration...</div>,
  ssr: false
})

export function ConfigPanel() {
  const { activeConfigTab, setActiveConfigTab } = useUIStore()

  return (
    <div>
      <Tabs value={activeConfigTab} onValueChange={(value) => setActiveConfigTab(value as typeof TABS[keyof typeof TABS])}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value={TABS.BASIC}>基本设置</TabsTrigger>
          <TabsTrigger value={TABS.AUDIENCE}>受众设置</TabsTrigger>
          <TabsTrigger value={TABS.ADVANCED}>高级设置</TabsTrigger>
        </TabsList>

        <TabsContent value={TABS.BASIC} className="space-y-4">
          <BasicConfigTab />
        </TabsContent>

        <TabsContent value={TABS.AUDIENCE} className="space-y-4">
          <AudienceConfigTab />
        </TabsContent>

        <TabsContent value={TABS.ADVANCED} className="space-y-4">
          <AdvancedConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
