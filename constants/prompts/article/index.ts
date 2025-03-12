/**
 * Prompts for article generation
 */

import { commonLengthRequirements, timeReference, naturalWritingReview } from '../common/index';
import { ArticleConfig } from '@/store/writer/config';
import { buildPromptTemplate } from '../template-builder';

// Import prompts for each article type
import * as socialMediaPrompts from './social_media/index';
import * as speechPrompts from './speech/index';
import * as businessPrompts from './business/index';
import * as videoScriptPrompts from './video_script/index';
import * as authenticPrompts from './authentic/index';

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
{outline}

# 参考文章
{exampleArticle}

# 结构分析
{structureAnalysis}`;

// Requirements for article generation
export const articleRequirements = {
  base: `要求：
1. 按照主题和核心思路创建一篇内容丰富的文章
2. 使用 Markdown 格式`
};

// Length-specific requirements for articles
export const articleLengthRequirements = commonLengthRequirements;

// Example article reference requirements
export const exampleArticleRequirements = `
参考文章要求：
1. 分析参考文章的内容特点、表达方式和风格特点
2. 借鉴参考文章中有效的表达技巧和内容组织方式
3. 结合参考文章的优点，优化当前文章的内容和表达
4. 不要完全照搬参考文章的内容，而是取其精华
5. 保持自己的创作风格，同时参考范文的优点`;

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
  authentic: authenticPrompts,
};

/**
 * Get the appropriate prompt based on article type and style
 * @param config The article configuration
 * @returns The appropriate prompt for the given article type and style
 */
export function getArticlePrompt(config: ArticleConfig): string {
  // Use the new template builder to generate the prompt
  return buildPromptTemplate(config);
}

// Export all prompts for each type
export { socialMediaPrompts, speechPrompts, businessPrompts, videoScriptPrompts, authenticPrompts };
