'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useWriterConfig } from '@/store/writer/config'
import { AGE_RANGE_OPTIONS, GENDER_OPTIONS, INCOME_LEVEL_OPTIONS } from '@/constants/writer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

function AudienceConfigTab() {
  const { articleConfig, setArticleConfig } = useWriterConfig()
  const [initialized, setInitialized] = useState(false)
  const initRef = useRef(false)

  // Initialize writerPersona and reviewerInfo if they don't exist
  useEffect(() => {
    // Only run once
    if (initRef.current) return
    initRef.current = true

    try {
      const updatedConfig = { ...articleConfig }
      let needsUpdate = false

      if (!updatedConfig.writerPersona) {
        updatedConfig.writerPersona = {
          type: '',
          style: '',
          characteristics: ''
        }
        needsUpdate = true
      }

      if (!updatedConfig.reviewerInfo) {
        updatedConfig.reviewerInfo = {
          hasReviewer: false,
          reviewerType: '',
          reviewerRequirements: ''
        }
        needsUpdate = true
      }

      if (needsUpdate) {
        setArticleConfig(updatedConfig)
      } else {
        setInitialized(true)
      }
    } catch (error) {
      console.error('Error initializing audience config:', error)
      // Create default config if there's an error
      setArticleConfig({
        ...articleConfig,
        writerPersona: {
          type: '',
          style: '',
          characteristics: ''
        },
        reviewerInfo: {
          hasReviewer: false,
          reviewerType: '',
          reviewerRequirements: ''
        }
      })
    }
  }, [])

  // Set initialized to true once writerPersona and reviewerInfo exist
  useEffect(() => {
    try {
      if (articleConfig.writerPersona && articleConfig.reviewerInfo) {
        setInitialized(true)
      }
    } catch (error) {
      console.error('Error checking initialization:', error)
    }
  }, [articleConfig])

  // Safe access to properties
  const safeAccess = (obj: any, path: string[], defaultValue: any = '') => {
    try {
      return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
    } catch (error) {
      return defaultValue;
    }
  };

  if (!initialized) {
    return <div className="p-4">Initializing configuration...</div>
  }

  const handleTargetAudienceChange = (field: string, value: string) => {
    setArticleConfig({
      ...articleConfig,
      targetAudience: {
        ...articleConfig.targetAudience,
        [field]: value
      }
    })
  }

  const handleWriterPersonaChange = (field: string, value: string) => {
    setArticleConfig({
      ...articleConfig,
      writerPersona: {
        ...(articleConfig.writerPersona || { type: '', style: '', characteristics: '' }),
        [field]: value
      }
    })
  }

  const handleReviewerInfoChange = (field: string, value: any) => {
    setArticleConfig({
      ...articleConfig,
      reviewerInfo: {
        ...(articleConfig.reviewerInfo || { hasReviewer: false, reviewerType: '', reviewerRequirements: '' }),
        [field]: value
      }
    })
  }

  // Get values safely
  const writerPersonaType = safeAccess(articleConfig, ['writerPersona', 'type']);
  const writerPersonaStyle = safeAccess(articleConfig, ['writerPersona', 'style']);
  const writerPersonaCharacteristics = safeAccess(articleConfig, ['writerPersona', 'characteristics']);
  const hasReviewer = safeAccess(articleConfig, ['reviewerInfo', 'hasReviewer'], false);
  const reviewerType = safeAccess(articleConfig, ['reviewerInfo', 'reviewerType']);
  const reviewerRequirements = safeAccess(articleConfig, ['reviewerInfo', 'reviewerRequirements']);

  return (
    <div className="space-y-6">
      <Accordion type="single" defaultValue="target-audience" className="w-full">
        {/* Target Audience Section */}
        <AccordionItem value="target-audience" className="border-none">
          <AccordionTrigger className="text-lg font-medium hover:no-underline">目标群体</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
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
          </AccordionContent>
        </AccordionItem>

        {/* Writer Persona Section */}
        <AccordionItem value="writer-persona" className="border-none">
          <AccordionTrigger className="text-lg font-medium hover:no-underline">写作者人设</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="writerType">作者类型</Label>
                <Select
                  value={writerPersonaType}
                  onValueChange={(value: string) => handleWriterPersonaChange('type', value)}
                >
                  <SelectTrigger id="writerType">
                    <SelectValue placeholder="选择作者类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="media">媒体人出身</SelectItem>
                    <SelectItem value="tech">技术人出身</SelectItem>
                    <SelectItem value="executive">企业高管出身</SelectItem>
                    <SelectItem value="professor">教授出身</SelectItem>
                    <SelectItem value="businessman">商人出身</SelectItem>
                    <SelectItem value="entrepreneur">草根创业者</SelectItem>
                    <SelectItem value="mother">全职妈妈</SelectItem>
                    <SelectItem value="expert">行业专家</SelectItem>
                    <SelectItem value="government">政府工作者</SelectItem>
                    <SelectItem value="researcher">研究人员</SelectItem>
                    <SelectItem value="doctor">医生出身</SelectItem>
                    <SelectItem value="lawyer">律师出身</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="writerStyle">写作风格</Label>
                <Select
                  value={writerPersonaStyle}
                  onValueChange={(value: string) => handleWriterPersonaChange('style', value)}
                >
                  <SelectTrigger id="writerStyle">
                    <SelectValue placeholder="选择写作风格" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">专业严谨</SelectItem>
                    <SelectItem value="casual">轻松随意</SelectItem>
                    <SelectItem value="humorous">幽默风趣</SelectItem>
                    <SelectItem value="storytelling">故事性强</SelectItem>
                    <SelectItem value="inspirational">励志鼓舞</SelectItem>
                    <SelectItem value="educational">教育启发</SelectItem>
                    <SelectItem value="analytical">分析性强</SelectItem>
                    <SelectItem value="academic">学术性</SelectItem>
                    <SelectItem value="journalistic">新闻报道式</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="writerCharacteristics">个人特点</Label>
                <Textarea
                  id="writerCharacteristics"
                  placeholder="描述写作者的个性特点、专业背景或独特视角"
                  value={writerPersonaCharacteristics}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleWriterPersonaChange('characteristics', e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Reviewer Information Section */}
        <AccordionItem value="reviewer-info" className="border-none">
          <AccordionTrigger className="text-lg font-medium hover:no-underline">审核者信息</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasReviewer"
                  checked={hasReviewer}
                  onCheckedChange={(checked: boolean) => handleReviewerInfoChange('hasReviewer', checked)}
                />
                <Label htmlFor="hasReviewer">需要审核</Label>
              </div>

              {hasReviewer && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reviewerType">审核者类型</Label>
                    <Select
                      value={reviewerType}
                      onValueChange={(value: string) => handleReviewerInfoChange('reviewerType', value)}
                    >
                      <SelectTrigger id="reviewerType">
                        <SelectValue placeholder="选择审核者类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">媒体主编</SelectItem>
                        <SelectItem value="operations">运营人员</SelectItem>
                        <SelectItem value="expert">领域专家</SelectItem>
                        <SelectItem value="client">客户</SelectItem>
                        <SelectItem value="publisher">出版社编辑</SelectItem>
                        <SelectItem value="government_official">机关领导</SelectItem>
                        <SelectItem value="consultant">专业咨询顾问</SelectItem>
                        <SelectItem value="press_bureau">新闻出版署</SelectItem>
                        <SelectItem value="legal_advisor">法律顾问</SelectItem>
                        <SelectItem value="academic_reviewer">学术审稿人</SelectItem>
                        <SelectItem value="content_supervisor">内容监管人员</SelectItem>
                        <SelectItem value="senior_management">高级管理层</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewerRequirements">审核要求</Label>
                    <Textarea
                      id="reviewerRequirements"
                      placeholder="描述审核者的具体要求和关注点"
                      value={reviewerRequirements}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleReviewerInfoChange('reviewerRequirements', e.target.value)
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export { AudienceConfigTab }
