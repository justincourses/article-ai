'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Message } from 'ai'
import { marked } from 'marked'
import { throttle } from 'lodash'
import { useContentStore } from '@/store/writer/content-store'
import { CONTENT_TABS } from '@/constants/writer'
import { SummaryImage } from './SummaryImage'

interface ReasoningDisplayProps {
  content: string
  isVisible: boolean
}

// 推理内容显示组件
const ReasoningDisplay = ({ content, isVisible }: ReasoningDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(true)

  // 使用 useMemo 缓存解析后的 HTML，避免不必要的重新渲染
  const renderedContent = useMemo(() => {
    if (!content) return ''
    return marked.parse(content, { breaks: true }) as string
  }, [content])

  if (!isVisible || !content) {
    return null
  }

  return (
    <div className="mb-4 bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
      <div
        className="py-2 px-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium">推理过程</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          {isExpanded ? "🔼" : "🔽"}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: renderedContent
            }}
          />
        </div>
      )}
    </div>
  )
}

interface EditableContentProps {
  messages: Message[]
  onChange?: (content: string) => void
  isLoading?: boolean
}

export function EditableContent({ messages, onChange, isLoading }: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [renderedContent, setRenderedContent] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [showReasoning, setShowReasoning] = useState(true)
  const { activeContentTab } = useContentStore()
  const [wordCount, setWordCount] = useState(0)

  // 处理消息内容，分离推理和正文
  const processMessageContent = (message: Message | undefined) => {
    if (!message) return { content: '', reasoning: '' }

    // 详细调试信息
    // console.log('Processing message:', message)

    // 专门检查 message.reasoning
    if (message.reasoning) {
      console.log('Direct reasoning property found:', typeof message.reasoning, message.reasoning.substring(0, 50))
    } else {
      console.log('No direct reasoning property found on message')
    }

    let contentText = ''
    let reasoningText = ''

    // 首先检查 message.content
    if (message.content) {
      // 处理带前缀的内容（如之前的实现）
      const lines = message.content.split('\n')
      let contentArr: string[] = []
      let reasoningArr: string[] = []

      // 计算前缀类型数量
      let gCount = 0
      let zeroCount = 0
      let noCount = 0

      for (const line of lines) {
        if (line.startsWith('g:')) {
          reasoningArr.push(line.substring(2)) // 去掉'g:'前缀
          gCount++
        } else if (line.startsWith('0:')) {
          contentArr.push(line.substring(2)) // 去掉'0:'前缀
          zeroCount++
        } else {
          // 没有前缀的内容默认作为正文
          contentArr.push(line)
          noCount++
        }
      }

      // 调试信息
      console.log(`Content processing stats: g:${gCount}, 0:${zeroCount}, no prefix:${noCount}`)

      // 如果没有检测到前缀，但有内容，则将全部内容视为正文
      if (gCount === 0 && zeroCount === 0 && noCount > 0) {
        contentText = message.content.trim()
      } else {
        contentText = contentArr.join('\n').trim()
        reasoningText = reasoningArr.join('\n').trim()
      }
    }
    // 如果message.content为空，检查其他字段
    else {
      // 1. 检查 message.reasoning
      if (message.reasoning) {
        reasoningText = message.reasoning
        // console.log('Found reasoning from message.reasoning:', reasoningText.substring(0, 100) + '...')
      }

      // 2. 检查 message.parts
      if (message.parts && Array.isArray(message.parts)) {
        // console.log('Found message parts:', message.parts.length)

        // 详细记录parts数组结构
        message.parts.forEach((part, index) => {
          // console.log(`Examining part[${index}]:`, part)
          // console.log(`  - Type:`, part.type)
          // console.log(`  - Keys:`, Object.keys(part))

          if (part.type === 'reasoning') {
            // console.log(`  - Is 'reasoning' in part?`, 'reasoning' in part)
            // console.log(`  - part.reasoning:`, part.reasoning)
          }
        })

        // 遍历parts数组处理不同类型的内容
        message.parts.forEach(part => {
          if (part && typeof part === 'object') {
            // 根据类型进行不同处理
            if (part.type === 'reasoning' && 'reasoning' in part) {
              // 推理内容
              reasoningText += part.reasoning
              // console.log(
              //   "Added reasoning from parts（reasoningText += part.reasoning）",
              //   reasoningText
              // );
            } else if (part.type === 'text' && 'text' in part) {
              // 文本内容
              contentText += part.text
              // console.log('Added text from parts')
            } else {
              // 尝试遍历对象的所有属性，查找可能的内容
              // console.log('Examining part properties:', part)
              for (const [key, value] of Object.entries(part)) {
                if (typeof value === 'string' && key !== 'type' && key !== 'id') {
                  // console.log(`Found content in key "${key}":`, value.substring(0, 50) + '...')
                  // 根据key决定放在哪里
                  if (key.includes('reason')) {
                    reasoningText += value
                    // console.log('Added reasoning from key', key)
                  } else {
                    contentText += value
                    // console.log('Added content from key', key)
                  }
                }
              }
            }
          }
        })
      }
    }

    // 直接访问所有可能的属性
    if (message) {
      for (const [key, value] of Object.entries(message)) {
        if (typeof value === 'string' && key.includes('reason')) {
          console.log(`Found direct reasoning in message.${key}:`, value.substring(0, 50) + '...')
          reasoningText = value
        }
      }
    }

    // 如果处理后仍然没有内容，但有原始对象，提供一个默认信息
    if (contentText === '' && reasoningText === '') {
      console.log('No content extracted, providing default message')
      contentText = '无法正确解析消息内容，请联系开发人员。'
    }

    // 最终结果
    console.log('Final processing results:')
    console.log('- Content length:', contentText.length)
    console.log('- Reasoning length:', reasoningText.length)

    return {
      content: contentText,
      reasoning: reasoningText
    }
  }

  const lastMessage = messages.filter(m => m.role === 'assistant').pop()

  // 使用 useMemo 缓存处理结果，避免每次渲染都重新计算
  const { content, reasoning } = useMemo(() => {
    return processMessageContent(lastMessage)
  }, [lastMessage])

  const hasReasoning = reasoning.length > 0

  // 调试推理内容
  useEffect(() => {
    if (hasReasoning) {
      console.log('Reasoning content available:', reasoning.substring(0, 100) + '...')
      // 只有当 showReasoning 为 false 时才设置为 true，避免无限循环
      if (!showReasoning) {
        setShowReasoning(true)
      }
    } else {
      console.log('No reasoning content available')
    }
  }, [reasoning, hasReasoning, showReasoning])

  // Reset rendered content when messages change or are cleared
  useEffect(() => {
    if (messages.length === 0) {
      setRenderedContent('');
    }
  }, [messages]);

  const throttledMarkdownRender = useMemo(
    () => throttle((text: string) => {
      const html = text ? marked.parse(text, { breaks: true }) as string : ''
      setRenderedContent(html)
    }, 200),
    []
  )

  useEffect(() => {
    if (!isEditing) {
      // 只有当 content 真正变化时才调用渲染函数
      throttledMarkdownRender(content)
    }

    // 清理函数，取消任何挂起的节流调用
    return () => {
      throttledMarkdownRender.cancel()
    }
  }, [content, isEditing, throttledMarkdownRender])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
    // 只在非编辑模式下才需要渲染 Markdown
    if (!isEditing) {
      throttledMarkdownRender(e.target.value)
    }
  }

  // 计算字数
  useEffect(() => {
    if (content) {
      // 中文字数计算：将内容中的中文字符、英文单词、数字等分别计算
      // 移除 Markdown 标记和特殊字符
      const plainText = content.replace(/\s+/g, ' ').replace(/[#*`_~\[\]()>]/g, '');

      // 匹配中文字符
      const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g) || [];

      // 匹配英文单词
      const englishWords = plainText.match(/[a-zA-Z]+/g) || [];

      // 匹配数字
      const numbers = plainText.match(/[0-9]+/g) || [];

      // 总字数：中文字符数 + 英文单词数 + 数字数
      const total = chineseChars.length + englishWords.length + numbers.length;

      setWordCount(total);
    } else {
      setWordCount(0);
    }
  }, [content]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-16rem)] min-h-[564px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="editable-content-container relative flex flex-col h-[calc(100vh-15.5rem)]">
      <div className="flex-1 overflow-auto">
        {isEditing && !isLoading ? (
          <Textarea
            value={content}
            onChange={handleChange}
            className="font-mono text-sm p-4 resize-none h-full whitespace-pre-wrap break-words min-h-[calc(100%-40px)]"
          />
        ) : (
          <div className="article-preview p-4 bg-white min-h-[calc(100%-40px)]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="text-6xl mb-4">
                  {/* Display different icons based on the content type */}
                  {content === "" && (
                    <>
                      {activeContentTab === CONTENT_TABS.OUTLINE && "🗒️"}
                      {activeContentTab === CONTENT_TABS.ARTICLE && "📝"}
                      {activeContentTab === CONTENT_TABS.SUMMARY && "📋"}
                    </>
                  )}
                </div>
                <div className="text-lg">
                  {activeContentTab === CONTENT_TABS.OUTLINE &&
                    '暂无大纲内容，请点击"生成大纲"按钮'}
                  {activeContentTab === CONTENT_TABS.ARTICLE &&
                    '暂无文章内容，请先生成大纲，然后点击"生成文章"按钮'}
                  {activeContentTab === CONTENT_TABS.SUMMARY &&
                    '暂无摘要内容，请先生成文章，然后点击"生成摘要"按钮'}
                </div>
              </div>
            ) : (
              <>
                {messages.map(
                  (message, index) =>
                    message.role === "assistant" && (
                      <div key={message.id}>
                        {/* 使用新的推理内容组件 */}
                        {index === messages.length - 1 && (
                          <ReasoningDisplay
                            content={reasoning}
                            isVisible={hasReasoning && showReasoning}
                          />
                        )}
                        <div
                          className={`prose prose-sm max-w-none ${
                            index < messages.length - 1 ? "opacity-50 mb-4" : ""
                          }`}
                          dangerouslySetInnerHTML={{
                            __html:
                              index === messages.length - 1
                                ? renderedContent
                                : (() => {
                                    const { content } =
                                      processMessageContent(message);
                                    return marked.parse(content, {
                                      breaks: true,
                                    }) as string;
                                  })(),
                          }}
                        />

                        {/* Add SummaryImage component for the last message in summary tab */}
                        {index === messages.length - 1 &&
                         activeContentTab === CONTENT_TABS.SUMMARY &&
                         content && (
                          <SummaryImage summaryText={content} />
                        )}
                      </div>
                    )
                )}
              </>
            )}
          </div>
        )}
      </div>

      {!isLoading && content && (
        <div className="editable-action-bar border-t border-gray-200 bg-gray-50 p-2 flex justify-between items-center mt-auto">
          <div className="text-sm text-gray-500 flex items-center">
            <span className="mr-1">📊</span>
            <span>字数: {wordCount}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                navigator.clipboard.writeText(content);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
            >
              <span>{isCopied ? "✅" : "📋"}</span>
              <span>{isCopied ? "已复制" : "复制内容"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              <span>{isEditing ? "👁️" : "✏️"}</span>
              <span>{isEditing ? "预览模式" : "编辑模式"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={!hasReasoning || isEditing}
              onClick={() => setShowReasoning(!showReasoning)}
            >
              <span>🧠</span>
              <span>思考过程</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
