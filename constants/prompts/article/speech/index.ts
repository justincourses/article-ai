import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview } from '../../common';

// Base prompt for speech articles
const basePrompt = `请根据以下信息，生成一篇演讲稿：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

演讲风格：{style}

大纲：
{outline}`;

// Style-specific requirements
const styleRequirements = {
  motivational: `演讲应该充满激励性和鼓舞性。
使用富有感染力的语言和生动的例子。
建立情感共鸣，激发听众的积极性和行动力。
适当使用修辞手法，如排比、反问等增强演讲效果。`,

  ceremonial: `演讲应该庄重、典雅，符合仪式感。
使用得体的祝福语和礼貌用语。
突出场合的特殊意义和重要性。
保持适度的情感表达，不过分热烈也不过分冷淡。`,

  informative: `演讲应该清晰、准确地传递信息。
使用易于理解的语言解释复杂概念。
适当使用数据和事实支持观点。
保持逻辑性和条理性，便于听众理解和记忆。`,

  persuasive_speech: `演讲应该具有强烈的说服力。
使用有力的论据和具体的例子。
预设并回应可能的质疑。
循序渐进地引导听众接受观点。`,
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

请在生成演讲稿前，确认以下几点：
1. 演讲内容是否完全符合主题和核心思路
2. 演讲是否包含了所有必要的内容要点
3. 演讲结构是否合理，是否有清晰的开场、主体和结尾
4. 演讲篇幅是否符合要求
5. 语言是否生动有力，符合指定的演讲风格
6. 是否使用了正确的 Markdown 格式
7. 是否考虑了听众的反应和互动
8. 是否包含了适当的停顿和语气变化的提示
9. 涉及时间相关内容时，是否参考了提供的时间信息

${naturalWritingReview}

如果有任何未满足的要求，请调整演讲稿内容，直到所有要求都得到满足。

直接返回 Markdown 格式的演讲稿内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const motivational = (config: ArticleConfig) => getPromptByStyle(config, 'motivational');
export const ceremonial = (config: ArticleConfig) => getPromptByStyle(config, 'ceremonial');
export const informative = (config: ArticleConfig) => getPromptByStyle(config, 'informative');
export const persuasive_speech = (config: ArticleConfig) => getPromptByStyle(config, 'persuasive_speech');
