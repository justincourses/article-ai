'use client'

import React, { ReactElement } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownRendererProps {
  markdown: string
}

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  // Simple markdown to HTML conversion
  // This is a very basic implementation
  // In a real app, you would use a proper markdown parser like marked or remark

  const renderMarkdown = () => {
    // Split the markdown into lines
    const lines = markdown.split('\n')

    // Process each line
    const elements: ReactElement[] = []

    let inCodeBlock = false
    let codeBlockContent = ''
    let codeBlockLanguage = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeBlockLanguage = line.slice(3).trim() || 'text'
          codeBlockContent = ''
        } else {
          elements.push(
            <div key={`code-${i}`} className="my-4">
              <SyntaxHighlighter language={codeBlockLanguage} style={tomorrow}>
                {codeBlockContent}
              </SyntaxHighlighter>
            </div>
          )
          inCodeBlock = false
        }
        continue
      }

      if (inCodeBlock) {
        codeBlockContent += line + '\n'
        continue
      }

      // Headings
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold mt-5 mb-3">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>)
      }
      // Lists
      else if (line.startsWith('- ')) {
        elements.push(<li key={i} className="ml-6 list-disc">{line.slice(2)}</li>)
      } else if (line.startsWith('1. ')) {
        elements.push(<li key={i} className="ml-6 list-decimal">{line.slice(3)}</li>)
      }
      // Paragraphs and empty lines
      else if (line.trim() === '') {
        elements.push(<div key={i} className="my-2"></div>)
      } else {
        elements.push(<p key={i} className="my-2">{line}</p>)
      }
    }

    return elements
  }

  return (
    <div className="prose prose-sm max-w-none">
      {renderMarkdown()}
    </div>
  )
}
