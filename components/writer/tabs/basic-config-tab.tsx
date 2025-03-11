'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWriterConfig } from '@/store/writer/config'
import { ARTICLE_TYPES, STYLE_OPTIONS_BY_TYPE, WORD_COUNT_OPTIONS } from '@/constants/writer'

export function BasicConfigTab() {
  const { articleConfig, setArticleConfig } = useWriterConfig()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">
          文章主题 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="topic"
          placeholder="输入文章主题"
          value={articleConfig.topic}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArticleConfig({ ...articleConfig, topic: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="articleType">
          文章类型 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={articleConfig.articleType}
          onValueChange={(value: string) => {
            setArticleConfig({
              ...articleConfig,
              articleType: value,
              style: '' // Reset style when article type changes
            })
          }}
        >
          <SelectTrigger id="articleType">
            <SelectValue placeholder="选择文章类型" />
          </SelectTrigger>
          <SelectContent>
            {ARTICLE_TYPES.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">
          文章风格 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={articleConfig.style}
          onValueChange={(value: string) => setArticleConfig({ ...articleConfig, style: value })}
        >
          <SelectTrigger id="style">
            <SelectValue placeholder="选择文章风格" />
          </SelectTrigger>
          <SelectContent>
            {(articleConfig.articleType && STYLE_OPTIONS_BY_TYPE[articleConfig.articleType as keyof typeof STYLE_OPTIONS_BY_TYPE]
              ? STYLE_OPTIONS_BY_TYPE[articleConfig.articleType as keyof typeof STYLE_OPTIONS_BY_TYPE]
              : STYLE_OPTIONS_BY_TYPE.social_media).map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wordCount">
          文章篇幅 <span className="text-red-500">*</span>
        </Label>
        <Select
          value={articleConfig.wordCount}
          onValueChange={(value: string) => setArticleConfig({ ...articleConfig, wordCount: value })}
        >
          <SelectTrigger id="wordCount">
            <SelectValue placeholder="选择文章篇幅" />
          </SelectTrigger>
          <SelectContent>
            {WORD_COUNT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coreIdeas">
          核心思路 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="coreIdeas"
          placeholder="描述您文章的核心思路和要点"
          value={articleConfig.coreIdeas}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setArticleConfig({ ...articleConfig, coreIdeas: e.target.value })}
          className="min-h-[120px]"
        />
      </div>
    </div>
  )
}
