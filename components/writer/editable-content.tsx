'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Message } from 'ai'
import { marked } from 'marked'
import { throttle } from 'lodash'
import { useContentStore } from '@/store/writer/content-store'
import { CONTENT_TABS } from '@/constants/writer'
import { SummaryImage } from './SummaryImage'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { themeOptions, themeMap } from '@/themes'
import ClipboardJS from 'clipboard'
import { toast } from "sonner"

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
  const [showReasoning, setShowReasoning] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('article-theme');
      return savedTheme || 'prose';
    }
    return 'prose';
  })
  const { activeContentTab } = useContentStore()
  const [wordCount, setWordCount] = useState(0)
  const reasoningSetRef = useRef(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const copyDivRef = useRef<HTMLDivElement>(null)
  const [primaryColor, setPrimaryColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('article-primary-color') || '#000000';
    }
    return '#000000';
  });

  // Apply the selected theme to the preview-content div
  const getThemeStyles = useMemo(() => {
    // If theme is prose, return empty styles to use original prose
    if (theme === 'prose') {
      return {
        '--md-primary-color': primaryColor,
        '--foreground': primaryColor
      } as React.CSSProperties;
    }

    const selectedTheme = themeMap[theme as keyof typeof themeMap];
    // Convert kebab-case to camelCase for React inline styles
    const convertedStyles = Object.entries(selectedTheme.base).reduce((acc, [key, value]) => {
      // Handle CSS custom properties (variables) that start with '--'
      if (key.startsWith('--')) {
        if (key === '--md-primary-color' || key === '--foreground') {
          acc[key] = primaryColor;
        } else {
          acc[key] = value;
        }
      } else {
        // Convert regular kebab-case to camelCase
        const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        acc[camelCaseKey] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    return convertedStyles as React.CSSProperties;
  }, [theme, primaryColor]);

  // Apply block styles to elements inside the preview-content div
  useEffect(() => {
    if (contentRef.current) {
      // If theme is prose, reset all styles except primary color and foreground
      if (theme === 'prose') {
        const elements = contentRef.current.querySelectorAll('*');
        elements.forEach((element) => {
          (element as HTMLElement).removeAttribute('style');
        });
        // Apply both primary color and foreground
        document.documentElement.style.setProperty('--md-primary-color', primaryColor);
        document.documentElement.style.setProperty('--foreground', primaryColor);
        return;
      }

      const selectedTheme = themeMap[theme as keyof typeof themeMap];
      const blockStyles = selectedTheme.block;

      // Helper function to convert kebab-case to camelCase
      const toCamelCase = (str: string) => {
        // Keep CSS variables as is
        if (str.startsWith('--')) {
          return str;
        }
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      };

      // Always set the primary color
      document.documentElement.style.setProperty('--md-primary-color', primaryColor);

      // Apply styles to block elements
      Object.entries(blockStyles).forEach(([selector, styles]) => {
        if (selector === 'container') return; // Skip container styles

        const elements = contentRef.current?.querySelectorAll(selector);
        elements?.forEach((element) => {
          Object.entries(styles as Record<string, string>).forEach(([property, value]) => {
            // Convert kebab-case property to camelCase
            const camelCaseProperty = toCamelCase(property);
            (element as HTMLElement).style[camelCaseProperty as any] = value;
          });
        });
      });

      // Apply styles to inline elements
      const inlineStyles = selectedTheme.inline;
      Object.entries(inlineStyles).forEach(([selector, styles]) => {
        const elements = contentRef.current?.querySelectorAll(selector);
        elements?.forEach((element) => {
          Object.entries(styles as Record<string, string>).forEach(([property, value]) => {
            // Convert kebab-case property to camelCase
            const camelCaseProperty = toCamelCase(property);
            (element as HTMLElement).style[camelCaseProperty as any] = value;
          });
        });
      });
    }
  }, [theme, primaryColor]);

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
    if (hasReasoning && !reasoningSetRef.current) {
      console.log('Reasoning content available:', reasoning.substring(0, 100) + '...')
      setShowReasoning(true)
      reasoningSetRef.current = true
    } else if (!hasReasoning) {
      console.log('No reasoning content available')
      // 如果没有推理内容，重置标志，以便下次有推理内容时可以再次显示
      reasoningSetRef.current = false
    }
  }, [reasoning, hasReasoning])

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

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('article-theme', theme);
    }
  }, [theme]);

  // Save color to localStorage and update CSS variable
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('article-primary-color', primaryColor);
      // Don't set CSS variable here anymore, it's handled in the theme effect
    }
  }, [primaryColor]);

  // 应用主题到预览内容的函数
  const applyThemeToPreview = useCallback(() => {
    if (!contentRef.current) return;

    // 清除之前的样式
    const clearStyles = (element: HTMLElement) => {
      element.removeAttribute('style');
      Array.from(element.children).forEach(child => {
        clearStyles(child as HTMLElement);
      });
    };

    clearStyles(contentRef.current);

    if (theme === 'prose') {
      // 仍然保持主色调
      document.documentElement.style.setProperty('--md-primary-color', primaryColor);
      return;
    }

    const selectedTheme = themeMap[theme as keyof typeof themeMap];

    // 应用基础样式
    Object.entries(selectedTheme.base).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        if (key === '--md-primary-color') {
          contentRef.current?.style.setProperty(key, primaryColor);
        } else {
          contentRef.current?.style.setProperty(key, value as string);
        }
      } else {
        contentRef.current?.style.setProperty(key, value as string);
      }
    });

    // 应用块级元素样式
    Object.entries(selectedTheme.block).forEach(([selector, styles]) => {
      if (selector === 'container') return;
      const elements = contentRef.current?.querySelectorAll(selector);
      elements?.forEach((element) => {
        Object.entries(styles as Record<string, string>).forEach(([prop, val]) => {
          (element as HTMLElement).style.setProperty(prop, val);
        });
      });
    });

    // 应用内联元素样式
    Object.entries(selectedTheme.inline).forEach(([selector, styles]) => {
      const elements = contentRef.current?.querySelectorAll(selector);
      elements?.forEach((element) => {
        Object.entries(styles as Record<string, string>).forEach(([prop, val]) => {
          (element as HTMLElement).style.setProperty(prop, val);
        });
      });
    });
  }, [theme, primaryColor]);

  // 更新主题效果应用逻辑
  useEffect(() => {
    applyThemeToPreview();
  }, [theme, primaryColor, applyThemeToPreview]);

  // 准备用于复制的内容
  const prepareCopyContent = () => {
    if (!contentRef.current || !copyDivRef.current) return;

    // 1. 记录当前主题状态
    const originalTheme = theme;
    const originalColor = primaryColor;

    try {
      const selectedTheme = theme !== 'prose' ? themeMap[theme as keyof typeof themeMap] : null;
      const copyDiv = copyDivRef.current;

      // 2. 复制内容
      copyDiv.innerHTML = contentRef.current.innerHTML;

      // 应用主题样式到复制 div
      if (selectedTheme) {
        // 应用基础样式
        Object.entries(selectedTheme.base).forEach(([key, value]) => {
          if (key.startsWith('--')) {
            if (key === '--md-primary-color') {
              copyDiv.style.setProperty(key, primaryColor);
            } else {
              copyDiv.style.setProperty(key, value as string);
            }
          } else {
            copyDiv.style.setProperty(key, value as string);
          }
        });

        // 应用块级元素样式
        Object.entries(selectedTheme.block).forEach(([selector, styles]) => {
          if (selector === 'container') return;
          const elements = copyDiv.querySelectorAll(selector);
          elements.forEach((element) => {
            Object.entries(styles as Record<string, string>).forEach(([prop, val]) => {
              (element as HTMLElement).style.setProperty(prop, val);
            });
          });
        });

        // 应用内联元素样式
        Object.entries(selectedTheme.inline).forEach(([selector, styles]) => {
          const elements = copyDiv.querySelectorAll(selector);
          elements.forEach((element) => {
            Object.entries(styles as Record<string, string>).forEach(([prop, val]) => {
              (element as HTMLElement).style.setProperty(prop, val);
            });
          });
        });
      }

      // 递归获取计算样式并内联到元素
      const applyComputedStylesToElement = (element: HTMLElement) => {
        const computedStyle = window.getComputedStyle(element);
        const importantStyles = [
          'color', 'background-color', 'font-size', 'font-family', 'font-weight',
          'line-height', 'text-align', 'margin', 'padding', 'border', 'display',
          'width', 'height', 'text-decoration', 'font-style', 'letter-spacing',
          'text-indent', 'white-space', 'word-spacing', 'word-break', 'overflow-wrap'
        ];

        importantStyles.forEach(style => {
          const value = computedStyle.getPropertyValue(style);
          if (value && value !== 'none' && value !== 'normal' && value !== '0px') {
            element.style.setProperty(style, value);
          }
        });

        Array.from(element.children).forEach(child => {
          applyComputedStylesToElement(child as HTMLElement);
        });
      };

      // 应用计算样式
      applyComputedStylesToElement(copyDiv);

      return {
        originalTheme,
        originalColor,
        success: true
      };
    } catch (error) {
      console.error('Error preparing content:', error);
      return {
        originalTheme,
        originalColor,
        success: false
      };
    }
  };

  // 复制公众号格式内容的函数
  const copyWeChatFormat = async () => {
    if (!copyDivRef.current) return;

    // 1. 准备内容并获取原始主题信息
    const prepareResult = prepareCopyContent();
    if (!prepareResult) return;

    const { originalTheme, originalColor, success } = prepareResult;
    if (!success) return;

    let copySuccess = false;

    try {
      // 2. 执行复制操作
      if (navigator.clipboard && navigator.clipboard.write) {
        const htmlBlob = new Blob([copyDivRef.current.innerHTML], { type: 'text/html' });
        const textBlob = new Blob([copyDivRef.current.textContent || ''], { type: 'text/plain' });

        const clipboardItem = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob
        });

        await navigator.clipboard.write([clipboardItem]);
        copySuccess = true;
      } else {
        // 降级方案：使用传统的 execCommand
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(copyDivRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
        copySuccess = document.execCommand('copy');
        selection?.removeAllRanges();
      }

      if (copySuccess) {
        toast.success("已复制公众号格式内容");
      }
    } catch (error) {
      console.error('Failed to copy formatted content:', error);
      toast.error("复制失败，请重试");
      copySuccess = false;
    }

    // 3. 如果复制成功，等待一小段时间后再还原主题，以确保复制内容已经被正确处理
    if (copySuccess) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 4. 还原原始主题并重新应用
    if (theme !== originalTheme) {
      setTheme(originalTheme);
    }
    if (primaryColor !== originalColor) {
      setPrimaryColor(originalColor);
    }

    // 确保主题立即重新应用
    requestAnimationFrame(() => {
      applyThemeToPreview();
    });
  };

  // 更新 clipboard.js 的成功回调处理
  useEffect(() => {
    const clipboard = new ClipboardJS('.clipboard-text-btn', {
      text: function(trigger: Element) {
        return content;
      }
    });

    const reasoningClipboard = new ClipboardJS('.clipboard-reasoning-btn', {
      text: function(trigger: Element) {
        return reasoning;
      }
    });

    clipboard.on('success', function(e: { clearSelection: () => void }) {
      toast.success("已复制纯文本内容");
      e.clearSelection();
    });

    reasoningClipboard.on('success', function(e: { clearSelection: () => void }) {
      toast.success("已复制推理内容");
      e.clearSelection();
    });

    clipboard.on('error', function(e: any) {
      console.error('Failed to copy text: ', e);
      toast.error("复制失败，请重试");
    });

    reasoningClipboard.on('error', function(e: any) {
      console.error('Failed to copy reasoning: ', e);
      toast.error("复制失败，请重试");
    });

    return () => {
      clipboard.destroy();
      reasoningClipboard.destroy();
    }
  }, [content, reasoning]);

  // 添加一个 effect 来处理主题的持久化
  useEffect(() => {
    const handleThemeChange = () => {
      applyThemeToPreview();
    };

    // 监听主题相关的状态变化
    window.addEventListener('storage', handleThemeChange);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
    };
  }, [applyThemeToPreview]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-16rem)] min-h-[564px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="editable-content-container relative flex flex-col h-[calc(100vh-15.5rem)]">
      {/* 添加隐藏的复制 div */}
      <div
        ref={copyDivRef}
        className="hidden"
        aria-hidden="true"
      />
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
                          ref={index === messages.length - 1 ? contentRef : undefined}
                          className={`preview-content prose prose-sm max-w-none ${
                            index < messages.length - 1 ? "opacity-50 mb-4" : ""
                          }`}
                          style={index === messages.length - 1 ? getThemeStyles : {}}
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
                          <SummaryImage
                            summaryText={content}
                            isApiComplete={!isLoading && index === messages.length - 1}
                          />
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
            <span className="mr-1">📝</span>
            <span>字数: {wordCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <span>🎨</span>
                  <span>主题</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  key="prose"
                  onClick={() => setTheme('prose')}
                  className={theme === 'prose' ? "bg-accent" : ""}
                >
                  Prose
                </DropdownMenuItem>
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={theme === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 w-[85px]"
                  style={{
                    borderBottom: `3px solid ${primaryColor}`
                  }}
                >
                  <span>🎏</span>
                  <span>配色</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <div className="relative flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 rounded-r-none border-r-0"
                  onClick={copyWeChatFormat}
                >
                  <span>📋</span>
                  <span>复制公众号格式</span>
                </Button>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 rounded-l-none border-l-[1px] border-l-border"
                  >
                    <span>▼</span>
                  </Button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={copyWeChatFormat}
                >
                  <span className="mr-2">📋</span>
                  <span>复制公众号格式</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="clipboard-text-btn"
                  data-clipboard-action="copy"
                >
                  <span className="mr-2">📝</span>
                  <span>复制纯文本</span>
                </DropdownMenuItem>
                {hasReasoning && (
                  <DropdownMenuItem
                    className="clipboard-reasoning-btn"
                    data-clipboard-action="copy"
                  >
                    <span className="mr-2">🧠</span>
                    <span>复制推理</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              <span>{isEditing ? "👁️" : "✏️"}</span>
              <span>{isEditing ? "预览" : "编辑"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
