import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview } from '../../common';

// Base prompt for video scripts
const basePrompt = `请根据以下信息，生成一份视频脚本：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

视频类型：{style}

大纲：
{outline}`;

// Style-specific requirements
const styleRequirements = {
  educational: `脚本应该清晰地解释概念和知识点。
使用简单易懂的语言，避免过多专业术语。
适当使用类比和例子帮助理解。
结构应该循序渐进，由浅入深。
考虑视觉辅助元素，如图表、动画等。`,

  entertainment: `脚本应该有趣、生动，能够吸引观众注意力。
使用幽默、故事或戏剧性元素增强娱乐性。
节奏应该紧凑，避免冗长。
考虑观众互动和情感共鸣。
适当使用悬念和高潮。`,

  promotional: `脚本应该突出产品或服务的价值和优势。
使用有说服力的语言和吸引人的表述。
清晰传达核心卖点和行动号召。
考虑目标受众的需求和痛点。
保持简洁明了，避免过度营销。`,

  documentary: `脚本应该客观、真实，注重事实和细节。
使用叙事手法展现主题的深度和广度。
平衡信息传递和情感共鸣。
考虑采访、旁白和实景拍摄的结合。
保持一定的权威性和可信度。`,
};

// Function to generate prompt based on style
const getPromptByStyle = (config: ArticleConfig, style: string) => {
  const { topic, coreIdeas, wordCount } = config;

  // Get the appropriate requirements based on style
  const requirements = styleRequirements[style as keyof typeof styleRequirements];

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

请在生成视频脚本前，确认以下几点：
1. 脚本内容是否完全符合主题和核心思路
2. 脚本是否包含了所有必要的内容要点
3. 脚本结构是否适合视频呈现
4. 脚本长度是否符合要求
5. 语言是否生动、有吸引力，符合视频风格
6. 是否使用了正确的脚本格式（场景描述、对白、旁白等）
7. 是否考虑了视觉元素和音效
8. 是否包含了开场和结尾
9. 涉及时间相关内容时，是否参考了提供的时间信息

${naturalWritingReview}

如果有任何未满足的要求，请调整脚本内容，直到所有要求都得到满足。

直接返回 Markdown 格式的脚本内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const educational = (config: ArticleConfig) => getPromptByStyle(config, 'educational');
export const entertainment = (config: ArticleConfig) => getPromptByStyle(config, 'entertainment');
export const promotional = (config: ArticleConfig) => getPromptByStyle(config, 'promotional');
export const documentary = (config: ArticleConfig) => getPromptByStyle(config, 'documentary');
