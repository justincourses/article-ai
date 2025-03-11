import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview } from '../../common';

// Base prompt for social media articles
const basePrompt = `请根据以下信息，生成一篇社交媒体文章：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

文章风格：{style}

大纲：
{outline}`;

// Style-specific requirements
const styleRequirements = {
  formal: `文章应该采用正式、学术的语气，使用专业术语和规范的表达方式。
保持客观、理性的论述风格，避免过于口语化的表达。
注重逻辑性和严谨性，适当引用数据和研究支持观点。`,

  casual: `文章应该采用轻松、自然的语气，像朋友间的对话一样。
可以使用日常用语和口语化表达，但要保持适度。
重点在于让内容易于理解和引起共鸣。`,

  persuasive: `文章应该具有强烈的说服力和感染力。
使用有力的论据和具体的例子来支持观点。
注重情感共鸣，但同时保持逻辑性。`,

  descriptive: `文章应该重视细节描写，生动形象地展现主题。
使用丰富的修辞手法，营造具体的场景和氛围。
注重感官描写，让读者能够身临其境。`,
};

// Function to generate prompt based on style
const getPromptByStyle = (config: ArticleConfig, style: string) => {
  const { topic, coreIdeas, wordCount } = config;

  // Get the appropriate requirements based on style
  const requirements = styleRequirements[style as keyof typeof styleRequirements] || styleRequirements.casual;

  // Get the appropriate length requirements
  const lengthReq = commonLengthRequirements[wordCount as keyof typeof commonLengthRequirements] || commonLengthRequirements.medium;

  // Create the time reference
  const timeRef = timeReference(new Date().toISOString());

  // Replace placeholders in the base prompt
  return basePrompt
    .replace('{topic}', topic)
    .replace('{coreIdeas}', coreIdeas)
    .replace('{timeRef}', timeRef)
    .replace('{requirements}', `${requirements}\n\n${lengthReq}`)
    .replace('{style}', style)
    .replace('{outline}', '') + `

请在生成文章前，确认以下几点：
1. 文章内容是否完全符合主题和核心思路
2. 文章是否包含了所有必要的内容要点
3. 文章结构是否合理，是否根据风格和受众适当调整
4. 文章篇幅是否符合要求
5. 语言是否流畅自然，符合指定的风格和说话节奏
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. ${style === 'formal' ? "文章是否保持了应有的学术严谨性" : "文章是否避免了过于学术化或文档式的结构"}
9. 涉及时间相关内容时，是否参考了提供的时间信息

${naturalWritingReview}

如果有任何未满足的要求，请调整文章内容，直到所有要求都得到满足。

直接返回 Markdown 格式的文章内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const formal = (config: ArticleConfig) => getPromptByStyle(config, 'formal');
export const casual = (config: ArticleConfig) => getPromptByStyle(config, 'casual');
export const persuasive = (config: ArticleConfig) => getPromptByStyle(config, 'persuasive');
export const descriptive = (config: ArticleConfig) => getPromptByStyle(config, 'descriptive');
