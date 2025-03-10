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
    dialogType,
    additionalRequirements,
    setAdditionalRequirements
  } = useUIStore()

  const { setActiveContentTab } = useContentStore()
  const {
    handleGenerateOutline,
    handleGenerateArticle,
    isGeneratingOutline,
    isGeneratingArticle
  } = useArticleService()

  const handleSubmit = async () => {
    setIsDialogOpen(false)
    if (dialogType === 'outline') {
      setActiveContentTab(CONTENT_TABS.OUTLINE)
      await handleGenerateOutline(additionalRequirements)
    } else if (dialogType === 'article') {
      setActiveContentTab(CONTENT_TABS.ARTICLE)
      await handleGenerateArticle(additionalRequirements)
    }
  }

  const isGenerating = dialogType === 'outline' ? isGeneratingOutline : isGeneratingArticle
  const dialogTitle = dialogType === 'outline' ? '大纲生成要求' : '文章生成要求'
  const dialogDescription = dialogType === 'outline'
    ? '请输入您对大纲生成的额外要求，例如特定的结构或内容要点。'
    : '请输入您对文章生成的额外要求，例如特定的写作风格、结构或内容要点。'
  const buttonText = dialogType === 'outline' ? '生成大纲' : '生成文章'

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
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
            disabled={isGenerating}
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
