import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview, determineContentLength, getStyleAdjustmentsByTypeAndLength } from '../../common/index';
import { exampleArticleRequirements } from '../index';
import { formatTargetAudience } from '../../structure';

// Base prompt for speech articles
const basePrompt = `作为一位世界五百强企业的首席演讲稿撰稿人，请根据以下信息，生成一篇演讲稿：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

演讲风格：{style}

大纲：
{outline}

参考文章：{exampleArticle}

结构分析：{structureAnalysis}`;

// Style-specific requirements
const styleRequirements = {
  motivational: `演讲应该富有激励性和鼓舞性。
使用振奋人心的语言和积极向上的态度。
分享成功故事和经验，激发听众的热情和行动力。
语言要流畅自然，充满激情和感染力。
使用大小标题+正文自然段的形式组织内容，确保演讲能够引起共鸣和情感波动。`,

  ceremonial: `演讲应该庄重、正式，适合庆典和仪式场合。
使用优雅、得体的语言，表达敬意和祝福。
注重场合的特殊意义和传统，传递积极的情感和价值观。
语言要流畅自然，符合正式场合的语言习惯。
使用大小标题+正文自然段的形式组织内容，确保演讲结构庄重有序。`,

  informative: `演讲应该注重信息传递和知识分享。
使用清晰、准确的语言解释复杂概念。
提供有价值的信息和见解，帮助听众理解和学习。
语言要流畅自然，符合教育性演讲的语言习惯。
使用大小标题+正文自然段的形式组织内容，确保信息传递清晰有序。`,

  persuasive_speech: `演讲应该具有强烈的说服力和感染力。
使用有力的论据、生动的例子和情感化的表达。
注重演讲的节奏感和高潮设计，引导听众接受观点。
语言要流畅自然，富有说服力和感染力。
使用大小标题+正文自然段的形式组织内容，确保演讲结构能够层层递进。`,
};

// Function to generate prompt based on style
const getPromptByStyle = (config: ArticleConfig, style: string) => {
  const { topic, coreIdeas, wordCount, exampleArticle, outline, structureAnalysis, targetAudience } = config;

  // Get the appropriate requirements based on style
  const requirements = styleRequirements[style as keyof typeof styleRequirements] || styleRequirements.motivational;

  // Determine content length
  const contentLength = determineContentLength(wordCount);

  // Get the appropriate length requirements
  const lengthReq = commonLengthRequirements[wordCount as keyof typeof commonLengthRequirements] || commonLengthRequirements.medium;

  // Get style adjustments based on article type and content length
  const styleAdjustments = getStyleAdjustmentsByTypeAndLength('speech', contentLength);

  // Create the time reference
  const timeRef = timeReference(new Date().toISOString());

  // Add example article requirements if an example is provided
  const exampleReq = exampleArticle ? exampleArticleRequirements : '';

  // Format target audience information
  const targetAudienceInfo = targetAudience ? formatTargetAudience(targetAudience) : '';
  const audienceReq = targetAudienceInfo ? `目标听众要求：\n请确保演讲内容、语言风格和表达方式适合以下目标听众：\n${targetAudienceInfo}\n` : '';

  // Replace placeholders in the base prompt
  return basePrompt
    .replace('{topic}', topic)
    .replace('{coreIdeas}', coreIdeas)
    .replace('{timeRef}', timeRef)
    .replace('{requirements}', `${requirements}\n\n${lengthReq}\n\n${styleAdjustments}\n\n${audienceReq}\n\n${exampleReq}`)
    .replace('{style}', style)
    .replace('{outline}', outline || '未提供大纲')
    .replace('{exampleArticle}', exampleArticle || '未提供参考文章')
    .replace('{structureAnalysis}', structureAnalysis || '未提供结构分析') + `

请在生成演讲稿前，确认以下几点：
1. 演讲内容是否完全符合主题和核心思路
2. 演讲是否包含了所有必要的内容要点
3. 演讲结构是否合理，是否有清晰的开场、主体和结尾
4. 演讲篇幅是否符合要求
5. 语言是否符合指定的演讲风格
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. 演讲是否具有足够的感染力和说服力
9. 涉及时间相关内容时，是否参考了提供的时间信息
10. 是否遵循了演讲类型和篇幅的风格调整要求
11. 是否参考了提供的大纲结构
12. 是否借鉴了参考文章的优点
13. 演讲内容和表达方式是否适合目标听众

${naturalWritingReview}

如果有任何未满足的要求，请调整演讲内容，直到所有要求都得到满足。

直接返回 Markdown 格式的演讲稿内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const motivational = (config: ArticleConfig) => getPromptByStyle(config, 'motivational');
export const ceremonial = (config: ArticleConfig) => getPromptByStyle(config, 'ceremonial');
export const informative = (config: ArticleConfig) => getPromptByStyle(config, 'informative');
export const persuasive_speech = (config: ArticleConfig) => getPromptByStyle(config, 'persuasive_speech');
