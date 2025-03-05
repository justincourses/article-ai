'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWriterConfig } from '@/store/writer/config'
import { AGE_RANGE_OPTIONS, GENDER_OPTIONS, INCOME_LEVEL_OPTIONS } from '@/constants/writer'

export function AdvancedConfigTab() {
  const { articleConfig, setArticleConfig } = useWriterConfig()

  const handleTargetAudienceChange = (field: string, value: string) => {
    setArticleConfig({
      ...articleConfig,
      targetAudience: {
        ...articleConfig.targetAudience,
        [field]: value
      }
    })
  }

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
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>目标受众</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ageRange">年龄范围</Label>
            <Select
              value={articleConfig.targetAudience.ageRange}
              onValueChange={(value: string) => handleTargetAudienceChange('ageRange', value)}
            >
              <SelectTrigger id="ageRange">
                <SelectValue placeholder="选择年龄范围" />
              </SelectTrigger>
              <SelectContent>
                {AGE_RANGE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">性别</Label>
            <Select
              value={articleConfig.targetAudience.gender}
              onValueChange={(value: string) => handleTargetAudienceChange('gender', value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="选择性别" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incomeLevel">收入水平</Label>
            <Select
              value={articleConfig.targetAudience.incomeLevel}
              onValueChange={(value: string) => handleTargetAudienceChange('incomeLevel', value)}
            >
              <SelectTrigger id="incomeLevel">
                <SelectValue placeholder="选择收入水平" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_LEVEL_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userTraits">用户特征</Label>
        <Textarea
          id="userTraits"
          placeholder="描述目标用户的特征、行为和需求"
          value={articleConfig.targetAudience.userTraits}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleTargetAudienceChange('userTraits', e.target.value)
          }
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
