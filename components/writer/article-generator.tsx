'use client'

import React, { useState } from 'react'
import { useWriterConfig } from '@/store/writer/config'
import { AlertCircle } from 'lucide-react'
import { MarkdownRenderer } from './markdown-renderer'
import { generateArticleParagraphs, generateMarkdownContent, regenerateParagraph } from '@/store/writer/article-service'

export function ArticleGenerator() {
  const {
    articleConfig,
    paragraphs,
    markdownContent,
    configComplete,
    paragraphsComplete,
    activeTab,
    setArticleConfig,
    setParagraphs,
    updateParagraph,
    setMarkdownContent,
    setConfigComplete,
    setParagraphsComplete,
    setActiveTab
  } = useWriterConfig()

  const [isGeneratingParagraphs, setIsGeneratingParagraphs] = useState(false)
  const [isRegeneratingParagraph, setIsRegeneratingParagraph] = useState<string | null>(null)

  // Handle tab change
  const handleTabChange = (tab: 'config' | 'paragraphs' | 'preview') => {
    setActiveTab(tab)
  }

  // Generate paragraphs based on config
  const handleGenerateParagraphs = async () => {
    setIsGeneratingParagraphs(true)
    try {
      const newParagraphs = await generateArticleParagraphs(articleConfig)
      setParagraphs(newParagraphs)
      setConfigComplete(true)
      setActiveTab('paragraphs')
    } catch (error) {
      console.error('Error generating paragraphs:', error)
      // Handle error (could show a toast notification here)
    } finally {
      setIsGeneratingParagraphs(false)
    }
  }

  // Generate preview based on paragraphs
  const handleGeneratePreview = () => {
    const content = generateMarkdownContent(paragraphs)
    setMarkdownContent(content)
    setParagraphsComplete(true)
    setActiveTab('preview')
  }

  // Handle paragraph edit
  const handleParagraphEdit = (id: string, newContent: string) => {
    updateParagraph(id, newContent)
  }

  // Handle regenerate paragraph
  const handleRegenerateParagraph = async (id: string) => {
    setIsRegeneratingParagraph(id)
    try {
      const updatedParagraph = await regenerateParagraph(id, paragraphs, articleConfig)
      updateParagraph(id, updatedParagraph.content)
    } catch (error) {
      console.error('Error regenerating paragraph:', error)
      // Handle error (could show a toast notification here)
    } finally {
      setIsRegeneratingParagraph(null)
    }
  }

  // Check if form is valid for generating paragraphs
  const isFormValid = articleConfig.topic && articleConfig.structureTemplate && articleConfig.style

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1 border rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => handleTabChange('config')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'config' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
              }`}
            >
              1. 配置
            </button>
            <button
              onClick={() => handleTabChange('paragraphs')}
              disabled={!configComplete}
              className={`px-4 py-2 rounded-md ${
                !configComplete ? 'opacity-50 cursor-not-allowed' :
                activeTab === 'paragraphs' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
              }`}
            >
              2. 段落
            </button>
            <button
              onClick={() => handleTabChange('preview')}
              disabled={!paragraphsComplete}
              className={`px-4 py-2 rounded-md ${
                !paragraphsComplete ? 'opacity-50 cursor-not-allowed' :
                activeTab === 'preview' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
              }`}
            >
              3. 预览
            </button>
          </div>

          {/* 流程提示和提交按钮 */}
          <div className="flex items-center">
            <div className="flex items-center text-sm text-gray-500 mr-4">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>修改前序步骤将重置后续内容</span>
            </div>

            {activeTab === 'config' && (
              <button
                onClick={handleGenerateParagraphs}
                disabled={!isFormValid || isGeneratingParagraphs}
                className={`py-2 px-4 rounded-md transition-colors ${
                  !isFormValid || isGeneratingParagraphs
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGeneratingParagraphs ? '生成中...' : '生成文章段落'}
              </button>
            )}

            {activeTab === 'paragraphs' && paragraphs.length > 0 && (
              <button
                onClick={handleGeneratePreview}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                生成文章预览
              </button>
            )}
          </div>
        </div>

        {/* 配置选项卡 */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">文章主题 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="输入您的文章主题或想法"
                  value={articleConfig.topic}
                  onChange={(e) => setArticleConfig({ topic: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">结构模板 <span className="text-red-500">*</span></label>
                  <select
                    value={articleConfig.structureTemplate}
                    onChange={(e) => setArticleConfig({ structureTemplate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">选择结构模板</option>
                    <option value="essay">论述文</option>
                    <option value="story">故事型</option>
                    <option value="tutorial">教程型</option>
                    <option value="review">评测型</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">文章风格 <span className="text-red-500">*</span></label>
                  <select
                    value={articleConfig.style}
                    onChange={(e) => setArticleConfig({ style: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">选择文章风格</option>
                    <option value="formal">正式学术</option>
                    <option value="casual">轻松随意</option>
                    <option value="persuasive">说服力强</option>
                    <option value="descriptive">描述细致</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">核心思路</label>
                <textarea
                  placeholder="描述您文章的核心思路和要点"
                  value={articleConfig.coreIdeas}
                  onChange={(e) => setArticleConfig({ coreIdeas: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">范例文章（可选）</label>
                <textarea
                  placeholder="粘贴一篇范例文章，AI将参考其风格和结构"
                  value={articleConfig.exampleArticle}
                  onChange={(e) => setArticleConfig({ exampleArticle: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {!isFormValid && (
                <p className="text-sm text-red-500">请填写所有必填字段（带 * 的字段）</p>
              )}
            </div>
          </div>
        )}

        {/* 段落选项卡 */}
        {activeTab === 'paragraphs' && (
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            {paragraphs.length > 0 ? (
              <div className="space-y-4">
                {paragraphs.map((paragraph) => (
                  <div key={paragraph.id} className="border rounded-md p-4">
                    <div className="font-medium mb-2">{paragraph.title}</div>
                    <textarea
                      value={paragraph.content}
                      onChange={(e) => handleParagraphEdit(paragraph.id, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md mb-2"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleRegenerateParagraph(paragraph.id)}
                        disabled={isRegeneratingParagraph === paragraph.id}
                        className={`py-1 px-3 border rounded-md text-sm ${
                          isRegeneratingParagraph === paragraph.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {isRegeneratingParagraph === paragraph.id ? '生成中...' : '重新生成此段落'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                请先在配置选项卡中生成文章段落
              </div>
            )}
          </div>
        )}

        {/* 预览选项卡 */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            {markdownContent ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-md p-4 h-96 overflow-auto">
                  <h3 className="text-sm font-medium mb-2">Markdown</h3>
                  <pre className="whitespace-pre-wrap text-sm">{markdownContent}</pre>
                </div>

                <div className="border rounded-md p-4 h-96 overflow-auto">
                  <h3 className="text-sm font-medium mb-2">HTML 预览</h3>
                  <MarkdownRenderer markdown={markdownContent} />
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                请先在段落选项卡中生成文章预览
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
