/**
 * Prompts for article structure generation
 */

import { commonLengthRequirements, commonStructureRequirements, timeReference, naturalWritingReview } from '../common';

// Base prompt for structure generation
export const structureBasePrompt = `根据以下要求生成一篇文章的思维导图结构：

主题：{topic}
风格：{style}
核心思路：{coreIdeas}
文章篇幅：{wordCount}
{timeRef}
目标人群：
{targetAudience}
{exampleArticle}`;

// Target audience format
export const formatTargetAudience = (targetAudience: any) => {
  if (!targetAudience) return "- 目标人群：不限";

  return `- 年龄层次：${targetAudience?.ageRange || '不限'}
- 性别倾向：${targetAudience?.gender || '不限'}
- 消费层次：${targetAudience?.incomeLevel || '不限'}
- 兴趣类目：${targetAudience?.interests?.join('、') || '不限'}
- 用户特征：${targetAudience?.userTraits || '不限'}`;
};

// Requirements for structure generation
export const structureRequirements = commonStructureRequirements;

// Length-specific structure requirements
export const structureLengthRequirements = commonLengthRequirements;

// Style-specific structure requirements
export const structureStyleRequirements = {
  formal: `正式风格结构要求：
1. 结构应包含明确的引言、主体和结论部分
2. 主体部分应有清晰的论点和支持论据
3. 各部分之间应有逻辑连贯性
4. 适合学术、商业或专业场景的结构安排`,

  casual: `轻松风格结构要求：
1. 结构可以更加灵活，不必严格遵循传统格式
2. 可以包含更多个人观点和经验分享的部分
3. 可以使用问答、列表等形式增加互动性
4. 适合博客、社交媒体等非正式场合`,

  persuasive: `说服性风格结构要求：
1. 结构应包含问题提出、论证和号召行动三个主要部分
2. 论证部分应包含多个支持论点和反驳可能的反对意见
3. 结构应有助于逐步构建说服力
4. 结论部分应包含明确的号召行动`,

  descriptive: `描述性风格结构要求：
1. 结构应围绕描述对象的不同方面或特征组织
2. 可以按照空间顺序、时间顺序或重要性顺序安排内容
3. 应包含生动细节和具体例子
4. 适合旅游、产品介绍等需要生动描述的内容`,

  technical: `技术风格结构要求：
1. 结构应包含明确的概念介绍、技术细节和应用示例
2. 可以使用步骤说明、比较分析等形式
3. 应按照从基础到高级的顺序安排内容
4. 适合教程、技术文档等专业内容`,

  storytelling: `故事性风格结构要求：
1. 结构应包含明确的开端、发展、高潮和结局
2. 可以使用场景描述、人物对话等叙事元素
3. 应有清晰的情节线索和主题
4. 适合案例分析、品牌故事等需要叙事性的内容`,
};

// Function to determine style type based on style description
export const determineStyleType = (style: string): 'formal' | 'casual' | 'persuasive' | 'descriptive' | 'technical' | 'storytelling' => {
  const styleLower = style.toLowerCase();

  if (styleLower.includes('正式') || styleLower.includes('学术') || styleLower.includes('商业')) {
    return 'formal';
  } else if (styleLower.includes('轻松') || styleLower.includes('日常') || styleLower.includes('博客')) {
    return 'casual';
  } else if (styleLower.includes('说服') || styleLower.includes('营销') || styleLower.includes('倡导')) {
    return 'persuasive';
  } else if (styleLower.includes('描述') || styleLower.includes('旅游') || styleLower.includes('产品')) {
    return 'descriptive';
  } else if (styleLower.includes('技术') || styleLower.includes('教程') || styleLower.includes('指南')) {
    return 'technical';
  } else if (styleLower.includes('故事') || styleLower.includes('案例') || styleLower.includes('叙事')) {
    return 'storytelling';
  } else {
    return 'casual'; // Default to casual
  }
};

// Example article analysis requirements
export const exampleArticleAnalysisRequirements = `
如果提供了参考文章，请分析并总结以下方面：
1. 文章的核心概念和关键词
2. 文章的文风和口吻特点
3. 文章的结构安排和段落组织方式
4. 文章的侧重点和论述角度
5. 文章的表达技巧和修辞手法
6. 文章的优点和可借鉴之处

请将分析结果放在结构的最后，作为创作参考。
`;

// Function to combine prompts based on requirements
export const getStructurePrompt = ({
  time,
  topic,
  style,
  coreIdeas,
  wordCount,
  targetAudience,
  exampleArticle = '',
  detailLevel = "base",
  length,
}: {
  time?: string;
  topic: string;
  style: string;
  coreIdeas: string;
  wordCount?: string;
  targetAudience?: any;
  exampleArticle?: string;
  detailLevel?: "simple" | "base" | "detailed";
  length?: "mini" | "short" | "medium" | "long";
}) => {
  // Determine length based on wordCount if not explicitly provided
  const contentLength = length || (wordCount ?
    (wordCount === "mini" ? "mini" :
      parseInt(wordCount) <= 300 ? "mini" :
      parseInt(wordCount) <= 800 ? "short" :
      parseInt(wordCount) <= 1500 ? "medium" : "long")
    : "medium");

  // Format target audience
  const formattedTargetAudience = formatTargetAudience(targetAudience);

  // Determine style type
  const styleType = determineStyleType(style);

  // Get requirements based on detail level
  const detailReq = structureRequirements[detailLevel] || structureRequirements.base;

  // Get length requirements
  const lengthReq = structureLengthRequirements[contentLength] || structureLengthRequirements.medium;

  // Get style requirements
  const styleReq = structureStyleRequirements[styleType] || structureStyleRequirements.casual;

  // Format example article if provided
  const formattedExampleArticle = exampleArticle ? `\n\n参考文章：\n${exampleArticle}` : '';

  // Create the time reference
  const timeRef = time ? timeReference(time) : '';

  // Define outline depth requirements based on content length
  let outlineDepthReq = '';
  if (contentLength === 'mini' || contentLength === 'short') {
    outlineDepthReq = `
大纲层级要求：
1. 由于是${contentLength === 'mini' ? '迷你' : '短篇'}内容，请只使用一级标题进行简单分段
2. 不要使用二级或更深层级的标题
3. 保持结构简单明了，直接列出3-5个主要段落即可
4. 每个段落用简短的一句话描述内容要点`;
  } else if (contentLength === 'medium') {
    outlineDepthReq = `
大纲层级要求：
1. 由于是中篇内容，主要使用一级标题进行分段
2. 只在必要时使用二级标题展开复杂概念
3. 避免使用三级或更深层级的标题
4. 一级标题控制在4-6个左右`;
  } else {
    outlineDepthReq = `
大纲层级要求：
1. 由于是长篇内容，可以使用两级标题结构
2. 一级标题用于主要章节划分，控制在5-7个左右
3. 二级标题用于展开复杂概念或详细论述，每个一级标题下可有2-4个二级标题
4. 避免使用三级或更深层级的标题，保持结构清晰`;
  }

  // Example article reference requirements
  const exampleArticleReq = exampleArticle ? `
参考文章结构要求：
1. 分析参考文章的结构特点和组织方式
2. 借鉴参考文章中有效的结构元素和段落安排
3. 结合参考文章的优点，优化当前文章的结构
4. 保持预设的结构框架，但参考范文进行适当调整
5. 不要完全照搬参考文章的结构，而是取其精华` : '';

  // Add example article analysis requirements if an example is provided
  const analysisReq = exampleArticle ? exampleArticleAnalysisRequirements : '';

  // Replace placeholders in the base prompt
  return structureBasePrompt
    .replace('{topic}', topic)
    .replace('{style}', style)
    .replace('{coreIdeas}', coreIdeas)
    .replace('{wordCount}', wordCount || '不限')
    .replace('{timeRef}', timeRef)
    .replace('{targetAudience}', formattedTargetAudience)
    .replace('{exampleArticle}', formattedExampleArticle) + `

${detailReq}

${lengthReq}

${styleReq}

${outlineDepthReq}

${exampleArticleReq}

请使用 Markdown 格式的缩进列表生成文章结构，确保结构清晰、层次分明，并符合所有要求。请直接返回内容，不要使用任何代码块（\`\`\`）包裹内容。

在设计结构时，请注意以下几点：
1. 结构应该自然流畅，避免过于机械或公式化的安排
2. 各部分之间应有逻辑连贯性，便于读者理解
3. 结构应该服务于内容，而不是为了结构而结构
4. 考虑到最终文章的可读性和自然度，避免过于复杂的层级结构
5. 不要使用代码块格式，直接返回纯文本的大纲内容

${analysisReq}

${naturalWritingReview}`;
};
