'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useWriterConfig } from '@/store/writer/config'

export function AdvancedConfigTab() {
  const { articleConfig, setArticleConfig } = useWriterConfig()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="exampleArticle">参考文章</Label>
        <Textarea
          id="exampleArticle"
          placeholder="粘贴一篇参考文章，AI将学习其风格和结构"
          value={articleConfig.exampleArticle || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setArticleConfig({ ...articleConfig, exampleArticle: e.target.value })
          }
          className="min-h-[400px]"
        />
      </div>
    </div>
  )
}
