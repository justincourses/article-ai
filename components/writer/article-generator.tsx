'use client'

import React, { useState } from 'react'
import { useWriterConfig, defaultArticleConfig, Step } from '@/store/writer/config'
import { Loader2 } from 'lucide-react'
import { useChat } from 'ai/react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { EditableContent } from './editable-content'

export function ArticleGenerator() {
  const {
    articleConfig,
    setArticleConfig,
    outline,
    setOutline,
    article,
    setArticle,
    summary,
    setSummary,
    activeStep,
    setActiveStep,
  } = useWriterConfig()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [additionalRequirements, setAdditionalRequirements] = useState('')

  // 更新文章配置类型
  type TargetAudience = {
    ageRange: string;
    gender: string;
    incomeLevel: string;
    interests: string[];
    userTraits: string;
  }

  // 使用 useChat hook 生成大纲
  const {
    messages: outlineMessages,
    append: appendOutline,
    isLoading: isGeneratingOutline,
    input: outlineInput,
    handleInputChange: handleOutlineInputChange,
    handleSubmit: handleOutlineSubmit,
  } = useChat({
    api: '/api/structure',
    id: 'outline-generator',
    body: {
      selectedChatModel: articleConfig.model || 'chat-model-large',
      topic: articleConfig.topic,
      style: articleConfig.style,
      coreIdeas: articleConfig.coreIdeas,
      wordCount: articleConfig.wordCount,
      targetAudience: articleConfig.targetAudience,
      exampleArticle: articleConfig.exampleArticle
    },
    onFinish: (message) => {
      setOutline(message.content);
    },
  })

  // 使用 useChat hook 生成文章
  const {
    messages: articleMessages,
    append: appendArticle,
    isLoading: isGeneratingArticle,
    input: articleInput,
    handleInputChange: handleArticleInputChange,
    handleSubmit: handleArticleSubmit,
  } = useChat({
    api: '/api/article',
    id: 'article-generator',
    body: {
      selectedChatModel: articleConfig.model || 'chat-model-reasoning',
      topic: articleConfig.topic,
      style: articleConfig.style,
      coreIdeas: articleConfig.coreIdeas,
      outline: outline
    },
    onFinish: (message) => {
      setArticle(message.content);
    },
  })

  // 使用 useChat hook 生成摘要
  const {
    messages: summaryMessages,
    append: appendSummary,
    isLoading: isGeneratingSummary,
    input: summaryInput,
    handleInputChange: handleSummaryInputChange,
    handleSubmit: handleSummarySubmit,
  } = useChat({
    api: '/api/summary',
    id: 'summary-generator',
    body: {
      selectedChatModel: 'chat-model-small',
      article: article
    },
    onFinish: (message) => {
      setSummary(message.content);
    },
  })

  // 生成文章结构
  const handleGenerateOutline = async () => {
    // 清空原有内容
    await Promise.all([
      setOutline(''),
      setArticle(''),
      setSummary(''),
      setActiveStep('outline')
    ]);

    // 清空消息历史
    outlineMessages.splice(0, outlineMessages.length);
    articleMessages.splice(0, articleMessages.length);
    summaryMessages.splice(0, summaryMessages.length);

    // 发送请求到新的结构生成API
    await appendOutline({
      role: 'user',
      content: 'generate outline', // 简化的内容，实际提示词在服务器端构建
      id: uuidv4(),
    });
  };

  // 生成文章内容
  const handleGenerateArticle = async (requirements?: string) => {
    // 清空原有内容
    await Promise.all([
      setArticle(''),
      setSummary(''),
      setActiveStep('article')
    ]);

    // 清空文章消息历史
    articleMessages.splice(0, articleMessages.length);
    summaryMessages.splice(0, summaryMessages.length);

    // 发送请求到新的文章生成API
    await appendArticle({
      role: 'user',
      content: requirements ? `generate article with requirements: ${requirements}` : 'generate article', // 在内容中包含要求
      id: uuidv4(),
    });
  };

  // 生成文章摘要
  const handleGenerateSummary = async () => {
    // 清空原有摘要内容
    await Promise.all([
      setSummary(''),
      setActiveStep('summary')
    ]);

    // 清空摘要消息历史
    summaryMessages.splice(0, summaryMessages.length);

    // 发送请求到摘要生成API
    await appendSummary({
      role: 'user',
      content: 'generate summary', // 简化的内容，实际提示词在服务器端构建
      id: uuidv4(),
    });
  };

  // 检查表单是否有效
  const isFormValid = articleConfig.topic &&
    articleConfig.style &&
    articleConfig.coreIdeas &&
    articleConfig.wordCount;

  return (
    <div className="flex h-full">
      {/* Left Panel - Configuration and Generation */}
      <div className="w-1/2 h-full flex flex-col">
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">基本设置</TabsTrigger>
                <TabsTrigger value="advanced">高级设置</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">
                    文章主题 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="输入您的文章主题或想法"
                    value={articleConfig.topic}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArticleConfig({ ...articleConfig, topic: e.target.value })}
                  />
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
                      <SelectItem value="formal">正式学术</SelectItem>
                      <SelectItem value="casual">轻松随意</SelectItem>
                      <SelectItem value="persuasive">说服力强</SelectItem>
                      <SelectItem value="descriptive">描述细致</SelectItem>
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
                      <SelectItem value="short">短文 (800字以内)</SelectItem>
                      <SelectItem value="medium">中等 (800-2000字)</SelectItem>
                      <SelectItem value="long">长文 (2000-5000字)</SelectItem>
                      <SelectItem value="extensive">特长 (5000字以上)</SelectItem>
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
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exampleArticle">范例文章（可选）</Label>
                  <Textarea
                    id="exampleArticle"
                    placeholder="粘贴一篇范例文章，AI将参考其风格和结构"
                    value={articleConfig.exampleArticle}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setArticleConfig({ ...articleConfig, exampleArticle: e.target.value })}
                    rows={4}
                  />
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-4">
                  <Label>目标人群（可选）</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ageRange">年龄层次</Label>
                      <Select
                        value={articleConfig.targetAudience?.ageRange}
                        onValueChange={(value: string) => {
                          const currentAudience = articleConfig.targetAudience || defaultArticleConfig.targetAudience;
                          setArticleConfig({
                            ...articleConfig,
                            targetAudience: {
                              ...currentAudience,
                              ageRange: value
                            }
                          });
                        }}
                      >
                        <SelectTrigger id="ageRange">
                          <SelectValue placeholder="选择目标年龄段" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teens">青少年 (13-19岁)</SelectItem>
                          <SelectItem value="youngAdults">青年 (20-35岁)</SelectItem>
                          <SelectItem value="middleAge">中年 (36-50岁)</SelectItem>
                          <SelectItem value="senior">老年 (51岁以上)</SelectItem>
                          <SelectItem value="all">不限年龄</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">性别倾向</Label>
                      <Select
                        value={articleConfig.targetAudience?.gender}
                        onValueChange={(value: string) => {
                          const currentAudience = articleConfig.targetAudience || defaultArticleConfig.targetAudience;
                          setArticleConfig({
                            ...articleConfig,
                            targetAudience: {
                              ...currentAudience,
                              gender: value
                            }
                          });
                        }}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="选择目标性别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">男性为主</SelectItem>
                          <SelectItem value="female">女性为主</SelectItem>
                          <SelectItem value="all">不限性别</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incomeLevel">消费层次</Label>
                      <Select
                        value={articleConfig.targetAudience?.incomeLevel}
                        onValueChange={(value: string) => {
                          const currentAudience = articleConfig.targetAudience || defaultArticleConfig.targetAudience;
                          setArticleConfig({
                            ...articleConfig,
                            targetAudience: {
                              ...currentAudience,
                              incomeLevel: value
                            }
                          });
                        }}
                      >
                        <SelectTrigger id="incomeLevel">
                          <SelectValue placeholder="选择消费层次" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">大众消费</SelectItem>
                          <SelectItem value="midRange">中产消费</SelectItem>
                          <SelectItem value="luxury">高端消费</SelectItem>
                          <SelectItem value="all">不限消费层次</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">兴趣类目（可多选）</Label>
                      <Select
                        value={articleConfig.targetAudience?.interests?.[0] || ''}
                        onValueChange={(value: string) => {
                          const currentAudience = articleConfig.targetAudience || defaultArticleConfig.targetAudience;
                          setArticleConfig({
                            ...articleConfig,
                            targetAudience: {
                              ...currentAudience,
                              interests: [...(currentAudience.interests || []), value]
                            }
                          });
                        }}
                      >
                        <SelectTrigger id="interests">
                          <SelectValue placeholder="选择兴趣类目" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">科技数码</SelectItem>
                          <SelectItem value="fashion">时尚美妆</SelectItem>
                          <SelectItem value="sports">运动健身</SelectItem>
                          <SelectItem value="food">美食烹饪</SelectItem>
                          <SelectItem value="travel">旅游出行</SelectItem>
                          <SelectItem value="education">教育学习</SelectItem>
                          <SelectItem value="finance">金融理财</SelectItem>
                          <SelectItem value="entertainment">娱乐休闲</SelectItem>
                        </SelectContent>
                      </Select>
                      {articleConfig.targetAudience?.interests && articleConfig.targetAudience.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {articleConfig.targetAudience.interests.map((interest, index) => (
                            <Button
                              key={index}
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const currentAudience = articleConfig.targetAudience || defaultArticleConfig.targetAudience;
                                const newInterests = currentAudience.interests.filter((_: string, i: number) => i !== index);
                                setArticleConfig({
                                  ...articleConfig,
                                  targetAudience: {
                                    ...currentAudience,
                                    interests: newInterests
                                  }
                                });
                              }}
                            >
                              {interest} ×
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userTraits">用户特征描述</Label>
                      <Textarea
                        id="userTraits"
                        placeholder="描述目标用户的其他特征，如：生活方式、价值观、行为习惯等"
                        value={articleConfig.targetAudience?.userTraits || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const currentAudience = articleConfig.targetAudience || defaultArticleConfig.targetAudience;
                          setArticleConfig({
                            ...articleConfig,
                            targetAudience: {
                              ...currentAudience,
                              userTraits: e.target.value
                            }
                          });
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Generation Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Button
              onClick={async () => {
                await handleGenerateOutline();
                setActiveStep('outline');
              }}
              disabled={!isFormValid || isGeneratingOutline}
              className="w-full bg-gradient-to-r from-blue-600/85 via-blue-800/85 to-indigo-800/85 hover:from-indigo-800/85 hover:via-blue-800/85 hover:to-blue-600/85 animate-gradient transition-all duration-500 text-white"
            >
              {isGeneratingOutline ? (
                <div className="flex items-center gap-2 justify-center w-full">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>生成中...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center w-full">
                  <span>✨ 生成大纲</span>
                </div>
              )}
            </Button>

            <Button
              onClick={() => setIsDialogOpen(true)}
              disabled={!outline || isGeneratingArticle}
              className="w-full bg-gradient-to-r from-purple-600/85 via-pink-700/85 to-rose-700/85 hover:from-rose-700/85 hover:via-pink-700/85 hover:to-purple-600/85 animate-gradient transition-all duration-500 text-white"
            >
              {isGeneratingArticle ? (
                <div className="flex items-center gap-2 justify-center w-full">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>生成中...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center w-full">
                  <span>🎨 {article ? '再次生成文章' : '生成文章'}</span>
                </div>
              )}
            </Button>

            {/* Summary Button - Only show when article exists */}
            {article && (
              <Button
                onClick={async () => {
                  await handleGenerateSummary();
                  setActiveStep('summary');
                }}
                disabled={isGeneratingSummary}
                className="w-full bg-gradient-to-r from-green-600/85 via-teal-700/85 to-emerald-700/85 hover:from-emerald-700/85 hover:via-teal-700/85 hover:to-green-600/85 animate-gradient transition-all duration-500 text-white"
              >
                {isGeneratingSummary ? (
                  <div className="flex items-center gap-2 justify-center w-full">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>生成中...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center w-full">
                    <span>📝 {summary ? '再次生成摘要' : '生成摘要'}</span>
                  </div>
                )}
              </Button>
            )}
          </div>


          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>生成文章</DialogTitle>
                <DialogDescription>
                  请确认是否要{article ? '重新' : ''}生成文章？你可以添加补充要求来优化生成结果。
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="requirements">补充要求（可选）</Label>
                <Textarea
                  id="requirements"
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="输入补充要求，例如：文章风格、重点关注的方面等..."
                  className="mt-2"
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
                  onClick={async () => {
                    setIsDialogOpen(false);
                    await handleGenerateArticle(additionalRequirements);
                    setAdditionalRequirements('');
                  }}
                  disabled={isGeneratingArticle}
                >
                  确认生成
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Right Panel - Content Display */}
      <div className="w-1/2 h-full flex flex-col border-l">
        <div className="flex-1 p-4">
          <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as Step)} className="h-full">
            <div className="mb-4">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="outline" className="flex-1">大纲</TabsTrigger>
                <TabsTrigger value="article" className="flex-1">内容</TabsTrigger>
                <TabsTrigger value="summary" className="flex-1">摘要</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="outline" className="h-[calc(100%-48px)] overflow-auto">
              <EditableContent
                messages={outlineMessages}
                isLoading={isGeneratingOutline}
                onChange={setOutline}
              />
            </TabsContent>

            <TabsContent value="article" className="h-[calc(100%-48px)] overflow-auto">
              <EditableContent
                messages={articleMessages}
                isLoading={isGeneratingArticle}
                onChange={setArticle}
              />
            </TabsContent>

            <TabsContent value="summary" className="h-[calc(100%-48px)] overflow-auto">
              <EditableContent
                messages={summaryMessages}
                isLoading={isGeneratingSummary}
                onChange={setSummary}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
