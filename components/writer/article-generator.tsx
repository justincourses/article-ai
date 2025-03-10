'use client'

import React from 'react'
import { ConfigPanel } from './config-panel'
import { ContentTabs } from './tabs/content-tabs'
import { ActionButtons } from './action-buttons'
import { RequirementsDialog } from './dialog/requirements-dialog'

export function ArticleGenerator() {
  return (
    <div className="mx-auto p-4">
      <div className="flex h-[calc(100vh-200px)]">
        <div className="w-5/12 pr-4 overflow-y-auto">
          <ConfigPanel />
          <div className="mt-6 mb-4">
            <ActionButtons />
          </div>
        </div>

        <div className="w-7/12 border-l pl-4 flex flex-col">
          <ContentTabs />
        </div>
      </div>

      <RequirementsDialog />
    </div>
  )
}
