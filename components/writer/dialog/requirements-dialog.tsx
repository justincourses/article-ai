'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUIStore } from '@/store/writer/ui-store'
import { useArticleService } from '../services/article-service'
import { useContentStore } from '@/store/writer/content-store'
import { CONTENT_TABS } from '@/constants/writer'

export function RequirementsDialog() {
  const {
    isDialogOpen,
    setIsDialogOpen,
    additionalRequirements,
    setAdditionalRequirements
  } = useUIStore()

  const { setActiveContentTab } = useContentStore()
  const { handleGenerateArticle, isGeneratingArticle } = useArticleService()

  const handleSubmit = async () => {
    setIsDialogOpen(false)
    setActiveContentTab(CONTENT_TABS.ARTICLE)
    await handleGenerateArticle(additionalRequirements)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>额外生成要求</DialogTitle>
          <DialogDescription>
            请输入您对文章生成的额外要求，例如特定的写作风格、结构或内容要点。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="输入额外要求..."
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="min-h-[150px]"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isGeneratingArticle}
          >
            生成文章
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
