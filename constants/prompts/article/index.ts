/**
 * Prompts for article generation
 */

// Base prompt for article generation
export const articleBasePrompt = `根据以下要求生成一篇完整的文章：

# 文章基本信息
主题：{topic}
核心思路：{coreIdeas}
当前时间参考：{time}
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
export const articleLengthRequirements = {
  short: `文章篇幅要求：
1. 总字数控制在500-800字之间
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
  time,
  topic,
  style,
  coreIdeas,
  outline,
  requirements,
  length = "medium",
  styleType = "casual",
}: {
  time: string;
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
    .replace("{time}", time)
    .replace(
      "{requirements}",
      requirements ? `补充要求：${requirements}` : ""
    );

  const styleReq = articleRequirements[styleType] || articleRequirements.base;
  const lengthReq = articleLengthRequirements[length];

  return `${basePrompt}

${styleReq}

${lengthReq}

# 格式与结构要求
${styleType === "formal" ?
`结构应保持学术性和严谨性，遵循引言、主体、结论的基本架构。` :
`结构应以大小标题+正文自然段落的形式呈现，避免像学术文档或论文的格式。文章应该像一个流畅的对话或故事，而不是一份正式报告。`}

# 语言与表达要求
${styleType === "formal" ?
`语言应保持专业和学术性，使用正式的表达方式。` :
`语言应符合正常人说话的节奏，保持自然流畅的对话感，避免生硬或过于学术化的表达。即使是专业内容，也应该用平易近人的方式表达。`}

需要注意的是，参考结构只是写作内容的指引，但不是文章结构的硬性要求，行文方式和文章结构应该考虑到文章风格及受众，以及其他的特别要求来调整。

# 完成后检查清单
请在完成文章后，检查以下要点是否都已满足：
1. 文章是否符合指定的主题和核心思路
2. 文章风格是否符合要求
3. 文章结构是否合理，是否根据风格和受众适当调整
4. 文章篇幅是否符合要求
5. 语言是否流畅自然，符合指定的风格和说话节奏
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. ${styleType !== "formal" ? "文章是否避免了过于学术化或文档式的结构" : "文章是否保持了应有的学术严谨性"}
9. 涉及时间相关内容时，是否参考了提供的时间信息

如果有任何未满足的要求，请调整文章内容，直到所有要求都得到满足。

直接返回 Markdown 格式的文章内容，不要使用代码块。`;
};
