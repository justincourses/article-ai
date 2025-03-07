/**
 * Prompts for article generation
 */

import { commonLengthRequirements, timeReference, naturalWritingReview } from '../common';

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
2. 使用 Markdown 格式
3. 语言要流畅自然，符合日常交流的语言习惯
4. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构`,

  formal: `要求：
1. 按照主题和核心思路创建一篇内容严谨的文章
2. 使用规范的 Markdown 格式，包括标题层级、列表和引用
3. 语言要正式、专业，适合学术或商业场景
4. 严格保持文章结构的层次性和逻辑性
5. 使用准确的术语和数据支持论点
6. 避免使用口语化表达和主观评价
7. 段落之间要有清晰的过渡和连接`,

  casual: `要求：
1. 按照主题和核心思路创建一篇轻松易读的文章
2. 使用简洁灵活的 Markdown 格式
3. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构
4. 语言要轻松、自然，像正常人交谈的节奏
5. 可以使用一些口语化表达和生活化比喻
6. 保持亲切友好的语气
7. 可以适当调整结构，保持内容流畅性为主`,

  creative: `要求：
1. 按照主题和核心思路创建一篇有创意的文章
2. 使用 Markdown 格式，可以灵活运用格式增强表现力
3. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构
4. 语言要生动、富有创意，适合吸引读者注意力
5. 像正常人讲故事的语气，保持自然的节奏感
6. 可以使用修辞手法和生动的描述
7. 注重情感表达和故事性
8. 可以采用非传统的结构安排，如故事化、场景化的结构`,

  technical: `要求：
1. 按照主题和核心思路创建一篇技术内容清晰的文章
2. 使用规范的 Markdown 格式，适当使用代码块、表格等技术内容格式
3. 使用大小标题+正文自然段的形式组织内容，避免像学术论文的结构
4. 语言要专业但平易近人，避免过于生硬的表达
5. 使用行业术语和准确的技术描述，但保持对话式的语言节奏
6. 注重逻辑性和信息准确性
7. 结构要清晰，重点突出，便于技术读者快速获取信息`,
};

// Length-specific requirements for articles
export const articleLengthRequirements = commonLengthRequirements;

// Function to combine prompts based on requirements
export const getArticlePrompt = ({
  time,
  topic,
  style,
  coreIdeas,
  outline,
  requirements,
  length = "medium",
  styleType = "casual",
}: {
  time?: string;
  topic: string;
  style: string;
  coreIdeas: string;
  outline: string;
  requirements?: string;
  length?: "mini" | "short" | "medium" | "long";
  styleType?: "formal" | "casual" | "creative" | "technical";
}) => {
  // Get the appropriate requirements based on style type
  const styleRequirements = articleRequirements[styleType] || articleRequirements.casual;

  // Get the appropriate length requirements
  const lengthReq = articleLengthRequirements[length] || articleLengthRequirements.medium;

  // Combine requirements
  const combinedRequirements = `${styleRequirements}

${lengthReq}

${requirements ? `补充要求：
${requirements}` : ''}`;

  // Create the time reference
  const timeRef = time ? timeReference(time) : '';

  // Replace placeholders in the base prompt
  return articleBasePrompt
    .replace('{topic}', topic)
    .replace('{coreIdeas}', coreIdeas)
    .replace('{timeRef}', timeRef)
    .replace('{requirements}', combinedRequirements)
    .replace('{style}', style)
    .replace('{outline}', outline) + `

请在生成文章前，确认以下几点：
1. 文章内容是否完全符合主题和核心思路
2. 文章是否包含了所有必要的内容要点
3. 文章结构是否合理，是否根据风格和受众适当调整
4. 文章篇幅是否符合要求
5. 语言是否流畅自然，符合指定的风格和说话节奏
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. ${styleType !== "formal" ? "文章是否避免了过于学术化或文档式的结构" : "文章是否保持了应有的学术严谨性"}
9. 涉及时间相关内容时，是否参考了提供的时间信息

${naturalWritingReview}

如果有任何未满足的要求，请调整文章内容，直到所有要求都得到满足。

直接返回 Markdown 格式的文章内容，不要使用代码块。`;
};
