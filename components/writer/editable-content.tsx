'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Copy, Check } from 'lucide-react'
import { Message } from 'ai'
import { marked } from 'marked'
import { throttle } from 'lodash'
import { useContentStore } from '@/store/writer/content-store'
import { CONTENT_TABS } from '@/constants/writer'

interface EditableContentProps {
  messages: Message[]
  onChange?: (content: string) => void
  isLoading?: boolean
}

export function EditableContent({ messages, onChange, isLoading }: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [renderedContent, setRenderedContent] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const { activeContentTab } = useContentStore()
  const lastMessage = messages.filter(m => m.role === 'assistant').pop()
  const content = lastMessage?.content || ''

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
      throttledMarkdownRender(content)
    }
  }, [content, isEditing, throttledMarkdownRender])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
    if (!isEditing) {
      throttledMarkdownRender(e.target.value)
    }
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-17rem)] min-h-[564px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-17rem)] min-h-[564px]">
      {!isLoading && (
        <div className="absolute right-2 top-2 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(content);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Edit2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {isEditing && !isLoading ? (
        <Textarea
          value={content}
          onChange={handleChange}
          className="flex-1 font-mono text-sm p-4 resize-none h-full whitespace-pre-wrap break-words min-h-[564px]"
        />
      ) : (
        <div className="article-preview flex-1 p-4 bg-white min-h-[564px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">
                {/* Display different icons based on the content type */}
                {content === '' && (
                  <>
                    {activeContentTab === CONTENT_TABS.OUTLINE && '🗒️'}
                    {activeContentTab === CONTENT_TABS.ARTICLE && '📝'}
                    {activeContentTab === CONTENT_TABS.SUMMARY && '📋'}
                  </>
                )}
              </div>
              <div className="text-lg">
                {activeContentTab === CONTENT_TABS.OUTLINE && '暂无大纲内容，请点击"生成大纲"按钮'}
                {activeContentTab === CONTENT_TABS.ARTICLE && '暂无文章内容，请先生成大纲，然后点击"生成文章"按钮'}
                {activeContentTab === CONTENT_TABS.SUMMARY && '暂无摘要内容，请先生成文章，然后点击"生成摘要"按钮'}
              </div>
            </div>
          ) : (
            messages.map(
              (message, index) =>
                message.role === "assistant" && (
                  <div
                    key={message.id}
                    className={`prose prose-sm max-w-none ${
                      index < messages.length - 1 ? "opacity-50 mb-4" : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html:
                        index === messages.length - 1
                          ? renderedContent
                          : (marked.parse(message.content, {
                              breaks: true,
                            }) as string),
                    }}
                  />
                )
            )
          )}
        </div>
      )}
    </div>
  );
}
