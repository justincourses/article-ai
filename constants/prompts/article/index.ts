/**
 * Prompts for article generation
 */

import { commonLengthRequirements, timeReference, naturalWritingReview } from '../common';
import { ArticleConfig } from '@/store/writer/config';

// Import prompts for each article type
import * as socialMediaPrompts from './social_media';
import * as speechPrompts from './speech';
import * as businessPrompts from './business';
import * as videoScriptPrompts from './video_script';

// Base prompt for article generation
export const articleBasePrompt = `根据以下要求生成一篇完整的文章：

# 文章基本信息
主题：{topic}
核心思路：{coreIdeas}
{timeRef}
{requirements}

# 文章风格与表达
风格：{style}

# 参考结构
{outline}`;

// Requirements for article generation
export const articleRequirements = {
  base: `要求：
1. 按照主题和核心思路创建一篇内容丰富的文章
2. 使用 Markdown 格式
3. 语言要流畅自然，符合日常交流的语言习惯
4. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构`,

  formal: `要求：
1. 按照主题和核心思路创建一篇内容严谨的文章
2. 使用规范的 Markdown 格式，包括标题层级、列表和引用
3. 语言要正式、专业，适合学术或商业场景
4. 严格保持文章结构的层次性和逻辑性
5. 使用准确的术语和数据支持论点
6. 避免使用口语化表达和主观评价
7. 段落之间要有清晰的过渡和连接`,

  casual: `要求：
1. 按照主题和核心思路创建一篇轻松易读的文章
2. 使用简洁灵活的 Markdown 格式
3. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构
4. 语言要轻松、自然，像正常人交谈的节奏
5. 可以使用一些口语化表达和生活化比喻
6. 保持亲切友好的语气
7. 可以适当调整结构，保持内容流畅性为主`,

  creative: `要求：
1. 按照主题和核心思路创建一篇有创意的文章
2. 使用 Markdown 格式，可以灵活运用格式增强表现力
3. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构
4. 语言要生动、富有创意，适合吸引读者注意力
5. 像正常人讲故事的语气，保持自然的节奏感
6. 可以使用修辞手法和生动的描述
7. 注重情感表达和故事性
8. 可以采用非传统的结构安排，如故事化、场景化的结构`,

  technical: `要求：
1. 按照主题和核心思路创建一篇技术内容清晰的文章
2. 使用规范的 Markdown 格式，适当使用代码块、表格等技术内容格式
3. 使用大小标题+正文自然段的形式组织内容，避免像学术论文的结构
4. 语言要专业但平易近人，避免过于生硬的表达
5. 使用行业术语和准确的技术描述，但保持对话式的语言节奏
6. 注重逻辑性和信息准确性
7. 结构要清晰，重点突出，便于技术读者快速获取信息`,
};

// Length-specific requirements for articles
export const articleLengthRequirements = commonLengthRequirements;

// Type for prompt functions
type PromptFunction = (config: ArticleConfig) => string;

// Interface for style-specific prompts
interface StylePrompts {
  [key: string]: PromptFunction;
}

// Interface for article type prompts
interface ArticleTypePrompts {
  [key: string]: StylePrompts;
}

// Mapping of article types to their prompts
const articleTypePrompts: ArticleTypePrompts = {
  social_media: socialMediaPrompts,
  speech: speechPrompts,
  business: businessPrompts,
  video_script: videoScriptPrompts,
};

/**
 * Get the appropriate prompt based on article type and style
 * @param config The article configuration
 * @returns The appropriate prompt for the given article type and style
 */
export function getArticlePrompt(config: ArticleConfig): string {
  const { articleType, style } = config;

  // Get prompts for the article type
  const typePrompts = articleTypePrompts[articleType];
  if (!typePrompts) {
    throw new Error(`No prompts found for article type: ${articleType}`);
  }

  // Get the specific style prompt
  const stylePrompt = typePrompts[style];
  if (!stylePrompt) {
    throw new Error(`No prompt found for style: ${style} in article type: ${articleType}`);
  }

  return stylePrompt(config);
}

// Export all prompts for each type
export { socialMediaPrompts, speechPrompts, businessPrompts, videoScriptPrompts };
