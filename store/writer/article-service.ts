import { v4 as uuidv4 } from 'uuid'
import { ArticleConfig, ArticleParagraph } from './config'

// This file would typically contain API calls to a backend service
// For now, we'll mock the functionality

/**
 * Generate article paragraphs based on the provided configuration
 */
export async function generateArticleParagraphs(config: ArticleConfig): Promise<ArticleParagraph[]> {
  // In a real application, this would call an API
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Generate paragraphs based on the structure template
  let paragraphs: ArticleParagraph[] = []

  switch (config.structureTemplate) {
    case 'essay':
      paragraphs = [
        { id: uuidv4(), title: '引言', content: `关于"${config.topic}"的引言部分。这是一篇论述文风格的文章。` },
        { id: uuidv4(), title: '背景', content: '这部分提供了相关的背景信息和上下文。' },
        { id: uuidv4(), title: '论点一', content: '这是第一个主要论点及其支持证据。' },
        { id: uuidv4(), title: '论点二', content: '这是第二个主要论点及其支持证据。' },
        { id: uuidv4(), title: '论点三', content: '这是第三个主要论点及其支持证据。' },
        { id: uuidv4(), title: '反驳', content: '这部分处理可能的反对意见。' },
        { id: uuidv4(), title: '结论', content: '总结论点并提出最终观点。' },
      ]
      break
    case 'story':
      paragraphs = [
        { id: uuidv4(), title: '开场', content: `关于"${config.topic}"的故事开场。这是一个故事型风格的文章。` },
        { id: uuidv4(), title: '人物介绍', content: '介绍故事中的主要人物。' },
        { id: uuidv4(), title: '背景设定', content: '描述故事发生的时间、地点和环境。' },
        { id: uuidv4(), title: '冲突', content: '介绍故事中的主要冲突或问题。' },
        { id: uuidv4(), title: '发展', content: '故事情节的发展过程。' },
        { id: uuidv4(), title: '高潮', content: '故事的高潮部分。' },
        { id: uuidv4(), title: '结局', content: '故事的结局和收尾。' },
      ]
      break
    case 'tutorial':
      paragraphs = [
        { id: uuidv4(), title: '介绍', content: `关于"${config.topic}"的教程介绍。这是一篇教程型风格的文章。` },
        { id: uuidv4(), title: '所需材料/工具', content: '完成本教程所需的材料或工具列表。' },
        { id: uuidv4(), title: '步骤一', content: '第一个步骤的详细说明。' },
        { id: uuidv4(), title: '步骤二', content: '第二个步骤的详细说明。' },
        { id: uuidv4(), title: '步骤三', content: '第三个步骤的详细说明。' },
        { id: uuidv4(), title: '常见问题', content: '可能遇到的问题及解决方案。' },
        { id: uuidv4(), title: '总结', content: '教程的总结和最终成果展示。' },
      ]
      break
    case 'review':
      paragraphs = [
        { id: uuidv4(), title: '介绍', content: `关于"${config.topic}"的评测介绍。这是一篇评测型风格的文章。` },
        { id: uuidv4(), title: '产品概述', content: '被评测产品/服务的基本信息。' },
        { id: uuidv4(), title: '优点', content: '产品/服务的主要优点。' },
        { id: uuidv4(), title: '缺点', content: '产品/服务的主要缺点。' },
        { id: uuidv4(), title: '使用体验', content: '使用产品/服务的实际体验。' },
        { id: uuidv4(), title: '与竞品比较', content: '与市场上类似产品/服务的比较。' },
        { id: uuidv4(), title: '总结评分', content: '最终评分和购买建议。' },
      ]
      break
    default:
      // Default structure if none selected
      paragraphs = [
        { id: uuidv4(), title: '引言', content: `关于"${config.topic}"的引言部分。` },
        { id: uuidv4(), title: '主要内容一', content: '第一部分主要内容。' },
        { id: uuidv4(), title: '主要内容二', content: '第二部分主要内容。' },
        { id: uuidv4(), title: '主要内容三', content: '第三部分主要内容。' },
        { id: uuidv4(), title: '结论', content: '文章的总结部分。' },
      ]
  }

  // Apply style to the content if specified
  if (config.style) {
    paragraphs = paragraphs.map(p => {
      let styledContent = p.content

      switch (config.style) {
        case 'formal':
          styledContent += ' 本段落采用正式学术风格撰写，使用专业术语和严谨的论述方式。'
          break
        case 'casual':
          styledContent += ' 本段落采用轻松随意的风格撰写，语言通俗易懂，富有亲和力。'
          break
        case 'persuasive':
          styledContent += ' 本段落采用说服力强的风格撰写，使用有力的论据和修辞手法。'
          break
        case 'descriptive':
          styledContent += ' 本段落采用描述细致的风格撰写，生动形象地描绘场景和细节。'
          break
      }

      return { ...p, content: styledContent }
    })
  }

  // Incorporate core ideas if provided
  if (config.coreIdeas) {
    // Add a note about the core ideas to the introduction
    if (paragraphs.length > 0) {
      paragraphs[0].content += ` 核心思路：${config.coreIdeas}`
    }
  }

  return paragraphs
}

/**
 * Regenerate a specific paragraph
 */
export async function regenerateParagraph(
  paragraphId: string,
  paragraphs: ArticleParagraph[],
  config: ArticleConfig
): Promise<ArticleParagraph> {
  // In a real application, this would call an API
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 800))

  const paragraph = paragraphs.find(p => p.id === paragraphId)

  if (!paragraph) {
    throw new Error('Paragraph not found')
  }

  // Generate new content based on the paragraph title
  let newContent = `这是重新生成的"${paragraph.title}"内容。`

  // Add some variation based on the current time
  newContent += ` (生成于 ${new Date().toLocaleTimeString()})`

  // Apply style if specified
  if (config.style) {
    switch (config.style) {
      case 'formal':
        newContent += ' 采用正式学术风格撰写。'
        break
      case 'casual':
        newContent += ' 采用轻松随意的风格撰写。'
        break
      case 'persuasive':
        newContent += ' 采用说服力强的风格撰写。'
        break
      case 'descriptive':
        newContent += ' 采用描述细致的风格撰写。'
        break
    }
  }

  return {
    ...paragraph,
    content: newContent
  }
}

/**
 * Generate markdown content from paragraphs
 */
export function generateMarkdownContent(paragraphs: ArticleParagraph[]): string {
  return paragraphs.map(p => `## ${p.title}\n\n${p.content}`).join('\n\n')
}
