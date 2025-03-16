/**
 * Prompts for article summary generation
 */

import { commonLengthRequirements, styleRequirements, timeReference, naturalWritingReview } from '../common';

// Base prompt for summary generation
export const summaryBasePrompt = `请为以下文章生成一个适合在社交媒体（如微信公众号、小红书等）发布的完整摘要：

{timeRef}

{article}`;

// Format requirements for summaries
export const summaryFormatRequirements = {
  base: `要求：
1. 摘要应严格按照以下格式结构呈现：
   # [引人注目的标题（20字以内）]

   [简洁的导语（50字左右）]

   ## 主要内容
   - [要点1（30-50字）]
   - [要点2（30-50字）]
   - [要点3（30-50字）]
   - [可选要点4-5]

   ## 总结
   [总结内容（50字左右）]

   ## 标签
   [#标签1] [#标签2] [#标签3]`,

  simple: `要求：
1. 摘要应按照以下格式结构呈现：
   # [标题]

   [导语]

   ## 主要内容
   - [要点1]
   - [要点2]
   - [要点3]

   ## 总结
   [总结内容]`,

  detailed: `要求：
1. 摘要应严格按照以下格式结构呈现：
   # [引人注目的标题（20字以内）]

   [简洁的导语（50字左右）]

   ## 主要内容
   - [要点1（30-50字）]
   - [要点2（30-50字）]
   - [要点3（30-50字）]
   - [要点4（30-50字）]
   - [要点5（30-50字）]

   ## 关键洞见
   [关键洞见（50字左右）]

   ## 总结
   [总结内容（50字左右）]

   ## 标签
   [#标签1] [#标签2] [#标签3] [#标签4] [#标签5]`,
};

// Style requirements for summaries
export const summaryStyleRequirements = {
  social: `2. 在生成摘要时，请分析并考虑原文的以下特点：
   - 文章类型（如：技术文章、观点评论、新闻报道、教程指南等）
   - 文章风格（如：正式学术、轻松幽默、深度思考、实用指导等）
   - 目标受众（如：专业人士、普通大众、特定兴趣群体等）
   - 核心观点和独特见解

3. 总体长度控制在300-500字之间
4. 使用 Markdown 格式
5. 语言要与原文风格保持一致，同时确保生动有吸引力，适合社交媒体传播`,

  formal: `2. 在生成摘要时，请分析并考虑原文的以下特点：
   - 文章类型（如：技术文章、观点评论、新闻报道、教程指南等）
   - 文章风格（如：正式学术、轻松幽默、深度思考、实用指导等）
   - 目标受众（如：专业人士、普通大众、特定兴趣群体等）
   - 核心观点和独特见解

3. 总体长度控制在300-500字之间
4. 使用 Markdown 格式
5. 语言要正式、专业，适合学术或商业场景
6. 使用准确的术语和表达，避免口语化表达和情感化语言`,

  casual: `2. 在生成摘要时，请分析并考虑原文的以下特点：
   - 文章类型（如：技术文章、观点评论、新闻报道、教程指南等）
   - 文章风格（如：正式学术、轻松幽默、深度思考、实用指导等）
   - 目标受众（如：专业人士、普通大众、特定兴趣群体等）
   - 核心观点和独特见解

3. 总体长度控制在300-500字之间
4. 使用 Markdown 格式
5. 语言要轻松、自然，适合日常阅读
6. 可以使用一些口语化表达和生活化比喻，保持亲切友好的语气`,
};

// Image prompt requirements for summaries
export const summaryImagePromptRequirements = {
  enabled: `7. 在摘要最后，请额外生成一个适合用于AI图像生成的提示词，格式如下：

## 图像提示词
[重要：必须在最开始就列出最关键的核心关键词（3-5个），用逗号分隔，例如 mountain landscape, sunset, dramatic clouds，然后再详细描述与文章主题相关的场景、物体或概念，使用英文，包含足够的细节以便AI生成高质量图像]`,

  disabled: '',
};

// Length-specific requirements for summaries
export const summaryLengthRequirements = commonLengthRequirements;

// Function to combine prompts based on requirements
export const getSummaryPrompt = ({
  time,
  article,
  format = "base",
  style = "social",
  includeImagePrompt = true,
  length = "short",
}: {
  time?: string;
  article: string;
  format?: "simple" | "base" | "detailed";
  style?: "social" | "formal" | "casual";
  includeImagePrompt?: boolean;
  length?: "mini" | "short" | "medium" | "long";
}) => {
  // Get format requirements
  const formatReq = summaryFormatRequirements[format] || summaryFormatRequirements.base;

  // Get style requirements
  const styleReq = summaryStyleRequirements[style] || summaryStyleRequirements.social;

  // Get length requirements
  const lengthReq = summaryLengthRequirements[length] || summaryLengthRequirements.short;

  // Get image prompt requirements
  const imagePromptReq = includeImagePrompt ? summaryImagePromptRequirements.enabled : summaryImagePromptRequirements.disabled;

  // Create the time reference
  const timeRef = time ? timeReference(time) : '';

  // Replace placeholders in the base prompt
  return summaryBasePrompt
    .replace('{timeRef}', timeRef)
    .replace('{article}', article) + `

${formatReq}

${styleReq}

${lengthReq}

${imagePromptReq}

请确保摘要能够准确反映原文的核心内容，同时具有吸引力和可读性，适合在社交媒体平台上传播。

在生成摘要时，请注意以下几点：
1. 摘要应该简洁明了，直击要点，避免冗余内容
2. 标题和要点应该有吸引力，但不要使用夸张或误导性的表述
3. 确保摘要内容易于理解，不使用过于复杂或晦涩的表达

${naturalWritingReview}`;
};
