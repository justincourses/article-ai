'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUIStore } from '@/store/writer/ui-store'
import { BasicConfigTab } from './tabs/basic-config-tab'
import { AdvancedConfigTab } from './tabs/advanced-config-tab'
import { TABS } from '@/constants/writer'

export function ConfigPanel() {
  const { activeConfigTab, setActiveConfigTab } = useUIStore()

  return (
    <div>
      <Tabs value={activeConfigTab} onValueChange={(value) => setActiveConfigTab(value as typeof TABS[keyof typeof TABS])}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={TABS.BASIC}>基本设置</TabsTrigger>
          <TabsTrigger value={TABS.ADVANCED}>高级设置</TabsTrigger>
        </TabsList>

        <TabsContent value={TABS.BASIC} className="space-y-4">
          <BasicConfigTab />
        </TabsContent>

        <TabsContent value={TABS.ADVANCED} className="space-y-4">
          <AdvancedConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
