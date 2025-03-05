/**
 * Prompts for article generation
 */

// Base prompt for article generation
export const articleBasePrompt = `根据以下文章结构生成一篇完整的文章：

# 文章要求
主题：{topic}
风格：{style}
核心思路：{coreIdeas}
{requirements}

# 文章结构
{outline}`;

// Requirements for article generation
export const articleRequirements = {
  base: `要求：
1. 按照上述结构生成一篇完整的文章
2. 保持文章结构的层次性和逻辑性
3. 使用 Markdown 格式
4. 语言要流畅自然，符合指定的风格`,

  formal: `要求：
1. 按照上述结构生成一篇完整的文章
2. 保持文章结构的层次性和逻辑性
3. 使用 Markdown 格式
4. 语言要正式、专业，适合学术或商业场景
5. 使用准确的术语和数据支持论点
6. 避免使用口语化表达和主观评价`,

  casual: `要求：
1. 按照上述结构生成一篇完整的文章
2. 保持文章结构的层次性和逻辑性
3. 使用 Markdown 格式
4. 语言要轻松、自然，适合日常阅读
5. 可以使用一些口语化表达和生活化比喻
6. 保持亲切友好的语气`,

  creative: `要求：
1. 按照上述结构生成一篇完整的文章
2. 保持文章结构的层次性和逻辑性
3. 使用 Markdown 格式
4. 语言要生动、富有创意，适合吸引读者注意力
5. 可以使用修辞手法和生动的描述
6. 注重情感表达和故事性`,

  technical: `要求：
1. 按照上述结构生成一篇完整的文章
2. 保持文章结构的层次性和逻辑性
3. 使用 Markdown 格式
4. 语言要专业、精确，适合技术内容
5. 使用行业术语和准确的技术描述
6. 注重逻辑性和信息准确性`,
};

// Length-specific requirements for articles
export const articleLengthRequirements = {
  short: `文章篇幅要求：
1. 总字数控制在300-800字之间
2. 各部分内容要简洁明了
3. 重点突出核心观点，避免冗余内容`,

  medium: `文章篇幅要求：
1. 总字数控制在800-1500字之间
2. 各部分内容要详略得当
3. 可以适当展开重要观点，但避免过度冗长`,

  long: `文章篇幅要求：
1. 总字数控制在1500-3000字之间
2. 各部分内容可以深入展开
3. 重要观点可以配合案例、数据或故事进行详细阐述
4. 注意内容的连贯性和逻辑性`,
};

// Function to combine prompts based on requirements
export const getArticlePrompt = ({
  topic,
  style,
  coreIdeas,
  outline,
  requirements,
  length = "medium",
  styleType = "casual",
}: {
  topic: string;
  style: string;
  coreIdeas: string;
  outline: string;
  requirements?: string;
  length?: "short" | "medium" | "long";
  styleType?: "formal" | "casual" | "creative" | "technical";
}) => {
  const basePrompt = articleBasePrompt
    .replace("{topic}", topic)
    .replace("{style}", style)
    .replace("{coreIdeas}", coreIdeas)
    .replace("{outline}", outline)
    .replace(
      "{requirements}",
      requirements ? `补充要求：${requirements}` : ""
    );

  const styleReq = articleRequirements[styleType] || articleRequirements.base;
  const lengthReq = articleLengthRequirements[length];

  return `${basePrompt}

${styleReq}

${lengthReq}

直接返回 Markdown 格式的文章内容，不要使用代码块。`;
};
