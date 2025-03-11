import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview } from '../../common';

// Base prompt for business documents
const basePrompt = `请根据以下信息，生成一份商务文档：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

文档类型：{style}

大纲：
{outline}`;

// Style-specific requirements
const styleRequirements = {
  formal_report: `报告应该专业、客观，使用正式的商务语言。
清晰地呈现数据、分析和结论。
保持逻辑性和严谨性。
适当使用图表和数据支持论点。
包含明确的建议或行动计划。`,

  proposal: `提案应该具有说服力和可行性。
清晰地阐述项目目标、方案和预期效果。
包含详细的实施计划和资源需求。
突出方案的优势和创新点。
预设并回应可能的质疑。`,

  announcement: `公告应该简洁明了，传达关键信息。
使用正式但易于理解的语言。
突出重要日期和关键事项。
保持专业和权威性。
考虑各利益相关方的需求。`,

  memo: `备忘录应该简明扼要，重点突出。
使用清晰的层级结构组织信息。
包含具体的行动项目和时间节点。
语言应该直接、准确。
避免不必要的细节。`,
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

请在生成文档前，确认以下几点：
1. 文档内容是否完全符合主题和核心思路
2. 文档是否包含了所有必要的信息和要点
3. 文档结构是否符合商务写作规范
4. 文档篇幅是否符合要求
5. 语言是否专业、准确，符合商务文档要求
6. 是否使用了正确的 Markdown 格式
7. 是否考虑了目标读者的需求和期望
8. 是否包含了必要的商务元素（如摘要、结论等）
9. 涉及时间相关内容时，是否参考了提供的时间信息

${naturalWritingReview}

如果有任何未满足的要求，请调整文档内容，直到所有要求都得到满足。

直接返回 Markdown 格式的文档内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const formal_report = (config: ArticleConfig) => getPromptByStyle(config, 'formal_report');
export const proposal = (config: ArticleConfig) => getPromptByStyle(config, 'proposal');
export const announcement = (config: ArticleConfig) => getPromptByStyle(config, 'announcement');
export const memo = (config: ArticleConfig) => getPromptByStyle(config, 'memo');
