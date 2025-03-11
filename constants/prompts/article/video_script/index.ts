import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview, determineContentLength, getStyleAdjustmentsByTypeAndLength } from '../../common/index';

// Base prompt for video script articles
const basePrompt = `作为一位资深编剧和小说家，请根据以下信息，生成一个视频脚本：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

脚本风格：{style}

大纲：
{outline}`;

// Style-specific requirements
const styleRequirements = {
  educational: `脚本应该注重知识传递和清晰解释。
使用简明易懂的语言解释复杂概念。
适当使用例子和比喻增强理解。
保持逻辑性和结构化，便于观众学习和记忆。
语言要流畅自然，符合教学视频的语言习惯。
使用大小标题+正文自然段的形式组织内容，确保脚本结构清晰有序。`,

  entertainment: `脚本应该富有趣味性和娱乐性。
使用幽默、故事和有趣的例子吸引观众。
保持轻松活泼的语调，创造愉快的观看体验。
注重节奏感和互动性，保持观众的兴趣。
语言要流畅自然，符合娱乐视频的语言习惯。
使用大小标题+正文自然段的形式组织内容，确保脚本节奏感强、引人入胜。`,

  promotional: `脚本应该具有说服力和吸引力。
突出产品或服务的独特卖点和优势。
使用有力的号召性用语和情感诉求。
注重解决观众的问题和需求，引导他们采取行动。
语言要流畅自然，富有说服力和感染力。
使用大小标题+正文自然段的形式组织内容，确保脚本能够有效传达营销信息。`,

  documentary: `脚本应该客观、深入地探讨主题。
使用事实、数据和专家观点支持内容。
注重叙事性和情感深度，创造沉浸式体验。
保持平衡的视角，呈现多方面的信息。
语言要流畅自然，符合纪录片的语言习惯。
使用大小标题+正文自然段的形式组织内容，确保脚本能够深入浅出地讲述故事。`,
};

// Function to generate prompt based on style
const getPromptByStyle = (config: ArticleConfig, style: string) => {
  const { topic, coreIdeas, wordCount } = config;

  // Get the appropriate requirements based on style
  const requirements = styleRequirements[style as keyof typeof styleRequirements] || styleRequirements.educational;

  // Determine content length
  const contentLength = determineContentLength(wordCount);

  // Get the appropriate length requirements
  const lengthReq = commonLengthRequirements[wordCount as keyof typeof commonLengthRequirements] || commonLengthRequirements.medium;

  // Get style adjustments based on article type and content length
  const styleAdjustments = getStyleAdjustmentsByTypeAndLength('video_script', contentLength);

  // Create the time reference
  const timeRef = timeReference(new Date().toISOString());

  // Replace placeholders in the base prompt
  return basePrompt
    .replace('{topic}', topic)
    .replace('{coreIdeas}', coreIdeas)
    .replace('{timeRef}', timeRef)
    .replace('{requirements}', `${requirements}\n\n${lengthReq}\n\n${styleAdjustments}`)
    .replace('{style}', style)
    .replace('{outline}', '') + `

请在生成视频脚本前，确认以下几点：
1. 脚本内容是否完全符合主题和核心思路
2. 脚本是否包含了所有必要的内容要点
3. 脚本结构是否合理，是否有吸引人的开场和有力的结尾
4. 脚本篇幅是否符合要求
5. 语言是否生动有趣，符合视频媒体的特点
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. 脚本是否考虑了视觉和听觉元素的配合
9. 涉及时间相关内容时，是否参考了提供的时间信息
10. 是否遵循了文章类型和篇幅的风格调整要求

${naturalWritingReview}

如果有任何未满足的要求，请调整脚本内容，直到所有要求都得到满足。

直接返回 Markdown 格式的脚本内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const educational = (config: ArticleConfig) => getPromptByStyle(config, 'educational');
export const entertainment = (config: ArticleConfig) => getPromptByStyle(config, 'entertainment');
export const promotional = (config: ArticleConfig) => getPromptByStyle(config, 'promotional');
export const documentary = (config: ArticleConfig) => getPromptByStyle(config, 'documentary');
