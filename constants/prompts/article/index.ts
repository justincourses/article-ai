/**
 * Prompts for article generation
 */

import { commonLengthRequirements, timeReference, naturalWritingReview } from '../common/index';
import { ArticleConfig } from '@/store/writer/config';

// Import prompts for each article type
import * as socialMediaPrompts from './social_media/index';
import * as speechPrompts from './speech/index';
import * as businessPrompts from './business/index';
import * as videoScriptPrompts from './video_script/index';

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
2. 使用 Markdown 格式`
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
