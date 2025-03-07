'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TestArticlePage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoTestResults, setAutoTestResults] = useState<any>(null)
  const [autoTestLoading, setAutoTestLoading] = useState(false)

  // Test data
  const [testData, setTestData] = useState({
    id: 'test-article',
    time: new Date().toISOString(),
    topic: '人工智能在医疗领域的应用',
    style: '专业、详细、有深度',
    coreIdeas: '探讨AI如何改变医疗诊断和治疗方式',
    outline: `# 人工智能在医疗领域的应用
- 引言
  - 医疗行业面临的挑战
  - AI技术的发展历程
- AI在医疗诊断中的应用
  - 影像识别
  - 病理分析
- AI在治疗方案制定中的作用
  - 个性化治疗
  - 药物研发
- 案例分析
  - 成功案例
  - 面临的挑战
- 未来展望
  - 技术趋势
  - 伦理考量
- 结论`,
    requirements: '增加对AI医疗伦理问题的讨论',
    length: 'medium',
    styleType: 'formal',
    wordCount: '1200',
  })

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const runTest = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/test-endpoints/article-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testData,
          messages: [
            {
              id: 'test-msg',
              role: 'user',
              content: `generate article with requirements: ${testData.requirements}`
            }
          ]
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const runAutoTests = async () => {
    setAutoTestLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/test-endpoints/article-test-cases')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAutoTestResults(data.testResults)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setAutoTestLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">文章生成测试工具</h1>
      <p className="text-gray-500 mb-8">
        这个工具用于测试文章生成API的参数传递是否正确，特别是关于文章篇幅的处理。
      </p>

      <div className="flex justify-end mb-4">
        <Button
          onClick={runAutoTests}
          disabled={autoTestLoading}
          variant="outline"
          className="mr-2"
        >
          {autoTestLoading ? '运行中...' : '运行自动测试'}
        </Button>
      </div>

      {autoTestResults && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>自动测试结果</CardTitle>
            <CardDescription>
              通过了 {autoTestResults.passedTests} / {autoTestResults.totalTests} 个测试
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {autoTestResults.results.map((result: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-md ${result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      {result.passed ? '✅' : '❌'} {result.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const detailsEl = document.getElementById(`test-details-${index}`);
                        if (detailsEl) {
                          detailsEl.classList.toggle('hidden');
                        }
                      }}
                    >
                      详情
                    </Button>
                  </div>
                  <div id={`test-details-${index}`} className="mt-2 hidden">
                    <Tabs defaultValue="expected">
                      <TabsList>
                        <TabsTrigger value="expected">预期结果</TabsTrigger>
                        <TabsTrigger value="actual">实际结果</TabsTrigger>
                        <TabsTrigger value="input">输入数据</TabsTrigger>
                      </TabsList>
                      <TabsContent value="expected">
                        <pre className="bg-gray-50 p-2 rounded-md text-xs mt-2">
                          {JSON.stringify(result.details?.expected, null, 2)}
                        </pre>
                      </TabsContent>
                      <TabsContent value="actual">
                        <pre className="bg-gray-50 p-2 rounded-md text-xs mt-2">
                          {JSON.stringify(result.details?.actual, null, 2)}
                        </pre>
                      </TabsContent>
                      <TabsContent value="input">
                        <pre className="bg-gray-50 p-2 rounded-md text-xs mt-2">
                          {JSON.stringify(result.details?.input, null, 2)}
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>测试参数</CardTitle>
            <CardDescription>
              配置文章生成的参数
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">主题</Label>
                <Input
                  id="topic"
                  value={testData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">风格</Label>
                <Input
                  id="style"
                  value={testData.style}
                  onChange={(e) => handleInputChange('style', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coreIdeas">核心思路</Label>
              <Textarea
                id="coreIdeas"
                value={testData.coreIdeas}
                onChange={(e) => handleInputChange('coreIdeas', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outline">大纲</Label>
              <Textarea
                id="outline"
                rows={8}
                value={testData.outline}
                onChange={(e) => handleInputChange('outline', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">额外要求</Label>
              <Textarea
                id="requirements"
                value={testData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="styleType">风格类型</Label>
                <Select
                  value={testData.styleType}
                  onValueChange={(value) => handleInputChange('styleType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择风格类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">正式学术</SelectItem>
                    <SelectItem value="casual">轻松随意</SelectItem>
                    <SelectItem value="creative">创意生动</SelectItem>
                    <SelectItem value="technical">技术专业</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">长度</Label>
                <Select
                  value={testData.length}
                  onValueChange={(value) => handleInputChange('length', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择长度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mini">迷你 (300字以内)</SelectItem>
                    <SelectItem value="short">短文 (300-800字)</SelectItem>
                    <SelectItem value="medium">中等 (800-1500字)</SelectItem>
                    <SelectItem value="long">长文 (1500-3000字)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wordCount">字数</Label>
              <Input
                id="wordCount"
                value={testData.wordCount}
                onChange={(e) => handleInputChange('wordCount', e.target.value)}
                placeholder="输入具体字数或'mini'"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={runTest} disabled={loading}>
              {loading ? '测试中...' : '运行测试'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
            <CardDescription>
              查看API参数传递和处理结果
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 p-4 rounded-md text-red-500 mb-4">
                {error}
              </div>
            )}

            {results && (
              <Tabs defaultValue="input">
                <TabsList className="mb-4">
                  <TabsTrigger value="input">输入数据</TabsTrigger>
                  <TabsTrigger value="constructed">构建数据</TabsTrigger>
                  <TabsTrigger value="length">长度分析</TabsTrigger>
                  <TabsTrigger value="prompt">完整提示词</TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="space-y-4">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                    {JSON.stringify(results.testResults.inputData, null, 2)}
                  </pre>
                </TabsContent>

                <TabsContent value="constructed" className="space-y-4">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                    {JSON.stringify(results.testResults.constructedData, null, 2)}
                  </pre>
                </TabsContent>

                <TabsContent value="length" className="space-y-4">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                    {JSON.stringify(results.testResults.lengthAnalysis, null, 2)}
                  </pre>
                </TabsContent>

                <TabsContent value="prompt" className="space-y-4">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[500px] text-sm whitespace-pre-wrap">
                    {results.testResults.prompt}
                  </pre>
                </TabsContent>
              </Tabs>
            )}

            {!results && !error && !loading && (
              <div className="text-center py-12 text-gray-500">
                点击"运行测试"按钮查看结果
              </div>
            )}

            {loading && (
              <div className="text-center py-12 text-gray-500">
                加载中...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
