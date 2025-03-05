import { v4 as uuidv4 } from 'uuid'
import { ArticleConfig, ArticleParagraph } from './config'
import { chatModels } from '@/lib/ai/models'
import { Message } from 'ai'

// This file would typically contain API calls to a backend service
// For now, we'll mock the functionality

// Helper function to make API calls with the selected model
async function callGenerateAPI(prompt: string, selectedModel: string, endpoint: string = '/api/chat', additionalData: any = {}, onProgress?: (text: string) => void) {
  try {
    // 构建消息
    const messages: Message[] = [
      {
        id: uuidv4(),
        role: 'user',
        content: prompt,
      },
    ]

    // 发起请求
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: uuidv4(),
        messages,
        selectedChatModel: selectedModel,
        ...additionalData,
      }),
    })

    // 获取响应流
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    let result = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // 解码并处理数据
      const text = new TextDecoder().decode(value)
      result += text

      // 调用进度回调
      if (onProgress) {
        onProgress(result)
      }
    }

    return result
  } catch (error) {
    console.error('Error calling AI model:', error)
    throw error
  }
}

/**
 * Generate article paragraphs based on the provided configuration
 */
export async function generateArticleParagraphs(
  config: ArticleConfig,
  onProgress?: (text: string) => void
): Promise<ArticleParagraph[]> {
  // 使用选定的模型生成段落
  const selectedModel = config.model || 'chat-model-large'

  try {
    // 构建提示词
    const prompt = `
    请根据以下要求生成一篇文章的段落结构：

    主题：${config.topic}
    风格：${config.style}
    核心思路：${config.coreIdeas}
    ${config.exampleArticle ? `参考文章：${config.exampleArticle}` : ''}

    请返回一个包含标题和内容的段落列表，格式为JSON数组。每个段落包含title和content字段。
    `;

    // 实际调用 AI 模型
    try {
      const generatedContent = await callGenerateAPI(
        prompt,
        selectedModel,
        '/api/structure',
        {
          topic: config.topic,
          style: config.style,
          coreIdeas: config.coreIdeas,
          exampleArticle: config.exampleArticle
        },
        onProgress
      );
      console.log('AI 返回内容:', generatedContent);

      // 尝试解析 JSON 响应
      // 注意：在实际环境中，可能需要更复杂的处理来确保返回的是有效的 JSON
      try {
        const parsedContent = JSON.parse(generatedContent);
        if (Array.isArray(parsedContent) && parsedContent.length > 0) {
          return parsedContent.map(p => ({
            ...p,
            id: uuidv4(),
            content: p.content + ` (使用模型: ${selectedModel})`
          }));
        }
      } catch (parseError) {
        console.error('解析 AI 返回内容失败:', parseError);
        // 解析失败时继续使用模拟数据
      }
    } catch (apiError) {
      console.error('调用 AI API 失败:', apiError);
      // API 调用失败时继续使用模拟数据
    }

    // 如果 API 调用失败或解析失败，使用模拟数据
    console.log('使用模拟数据');

    // 根据结构模板生成段落
    let paragraphs: ArticleParagraph[] = []

    // 创建默认段落结构
    paragraphs = [
      { id: uuidv4(), title: '引言', content: `关于"${config.topic}"的引言部分。使用模型: ${selectedModel}` },
      { id: uuidv4(), title: '背景', content: '这部分提供了相关的背景信息和上下文。' },
      { id: uuidv4(), title: '主要内容一', content: '这是第一个主要内容部分。' },
      { id: uuidv4(), title: '主要内容二', content: '这是第二个主要内容部分。' },
      { id: uuidv4(), title: '主要内容三', content: '这是第三个主要内容部分。' },
      { id: uuidv4(), title: '结论', content: '总结文章的主要观点。' },
    ]

    // 应用风格（如果指定）
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

    // 如果提供了核心思路，则将其纳入
    if (config.coreIdeas) {
      // 在引言中添加核心思路的说明
      if (paragraphs.length > 0) {
        paragraphs[0].content += ` 核心思路：${config.coreIdeas}`
      }
    }

    return paragraphs;
  } catch (error) {
    console.error('生成段落时出错:', error);
    throw error;
  }
}

/**
 * Regenerate a specific paragraph
 */
export async function regenerateParagraph(
  paragraphId: string,
  paragraphs: ArticleParagraph[],
  config: ArticleConfig,
  customPrompt?: string,
  onProgress?: (text: string) => void
): Promise<ArticleParagraph> {
  // 使用选定的模型进行段落重新生成
  const selectedModel = config.model || 'chat-model-large'

  try {
    const paragraph = paragraphs.find(p => p.id === paragraphId)

    if (!paragraph) {
      throw new Error('段落未找到')
    }

    // 构建提示词，如果提供了自定义提示词则使用它
    const prompt = customPrompt || `
    请重新生成以下文章段落的内容：

    文章主题：${config.topic}
    段落标题：${paragraph.title}
    文章风格：${config.style}
    核心思路：${config.coreIdeas}

    请提供新的段落内容，保持与原文风格一致。
    `;

    // 实际调用 AI 模型
    try {
      const newContent = await callGenerateAPI(
        prompt,
        selectedModel,
        '/api/article',
        {
          topic: config.topic,
          style: config.style,
          coreIdeas: config.coreIdeas,
          paragraphId: paragraphId,
          paragraphTitle: paragraph.title
        },
        onProgress
      );
      console.log('AI 返回内容:', newContent);

      return {
        ...paragraph,
        content: newContent + ` (使用模型: ${selectedModel}, 生成于 ${new Date().toLocaleTimeString()})`
      };
    } catch (apiError) {
      console.error('调用 AI API 失败:', apiError);
      // API 调用失败时继续使用模拟数据
    }

    // 如果 API 调用失败，使用模拟数据
    console.log('使用模拟数据');

    // 为了演示，我们继续使用模拟实现
    await new Promise(resolve => setTimeout(resolve, 800))

    // 根据段落标题生成新内容
    let newContent = `这是重新生成的"${paragraph.title}"内容。使用模型: ${selectedModel}`

    // 如果使用了自定义提示词，添加提示
    if (customPrompt) {
      newContent += `\n(使用自定义提示词: "${customPrompt.substring(0, 30)}${customPrompt.length > 30 ? '...' : ''}")`
    }

    // 添加一些基于当前时间的变化
    newContent += ` (生成于 ${new Date().toLocaleTimeString()})`

    // 应用风格（如果指定）
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
  } catch (error) {
    console.error('重新生成段落时出错:', error);
    throw error;
  }
}

/**
 * Generate markdown content from paragraphs
 */
export async function generateMarkdownContent(
  paragraphs: ArticleParagraph[],
  config?: ArticleConfig,
  onProgress?: (text: string) => void
): Promise<string> {
  // 使用选定的模型生成 Markdown 内容
  const selectedModel = config?.model || 'chat-model-large'

  try {
    // 构建提示词
    const prompt = `
    请将以下段落内容转换为完整的 Markdown 格式文章：

    ${paragraphs.map(p => `## ${p.title}\n${p.content}`).join('\n\n')}

    要求：
    1. 保持原有段落结构
    2. 使用 Markdown 语法美化文章
    3. 确保段落之间的连贯性
    4. 添加适当的格式化元素（如列表、引用等）
    5. 保持内容的完整性

    请直接返回 Markdown 格式的文章内容。
    `;

    // 实际调用 AI 模型
    try {
      const markdownContent = await callGenerateAPI(
        prompt,
        selectedModel,
        '/api/article',
        {
          paragraphs: paragraphs.map(p => ({ title: p.title, content: p.content }))
        },
        onProgress
      );
      console.log('生成的 Markdown 内容:', markdownContent);
      return markdownContent;
    } catch (apiError) {
      console.error('调用 AI API 失败:', apiError);
      // 失败时使用简单转换
      const markdownContent = paragraphs.map(p => `## ${p.title}\n\n${p.content}`).join('\n\n')
      const modelInfo = config ? `\n\n*使用模型: ${selectedModel}*` : ''
      return markdownContent + modelInfo;
    }
  } catch (error) {
    console.error('生成 Markdown 内容时出错:', error);
    throw error;
  }
}
