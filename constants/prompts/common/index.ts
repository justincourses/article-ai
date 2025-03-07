/**
 * Common prompt components that can be reused across different endpoints
 */

// Format requirements for different output types
export const formatRequirements = {
  markdown: "使用 Markdown 格式，直接返回内容，不要使用代码块。",
  json: "返回 JSON 格式的数据，确保格式正确且可解析。",
};

// Style requirements for different content types
export const styleRequirements = {
  formal: "使用正式、专业的语言风格，适合学术或商业场景。",
  casual: "使用轻松、自然的语言风格，适合日常阅读。",
  creative: "使用生动、富有创意的语言风格，适合吸引读者注意力。",
  technical: "使用专业术语和精确表达，适合技术内容。",
  social: "使用活泼、互动性强的语言风格，适合社交媒体平台。",
  persuasive: "使用有说服力的语言风格，适合营销和倡导内容。",
  descriptive: "使用生动描述性的语言风格，适合场景和产品描述。",
  storytelling: "使用叙事性的语言风格，适合讲述故事和案例。",
};

// Length requirements for different content types
export const lengthRequirements = {
  mini: {
    description: "迷你内容",
    wordCount: "300字以内",
    structure: "简洁的结构，包含简短的引言、1-2个要点和简短总结。",
  },
  short: {
    description: "短篇内容",
    wordCount: "300-800字",
    structure: "简洁的结构，包含简短的引言、2-3个要点和简短总结。",
  },
  medium: {
    description: "中篇内容",
    wordCount: "800-1500字",
    structure: "包含引言、3-5个主要部分和总结，每部分可有小标题。",
  },
  long: {
    description: "长篇内容",
    wordCount: "1500-3000字",
    structure: "详细的结构，包含引言、5-7个主要部分（可有子部分）和深入的总结。",
  },
};

// Common length requirements for article structure
export const commonLengthRequirements = {
  mini: `迷你内容要求：
1. 总字数控制在300字以内
2. 内容要极度精简，直击核心
3. 只保留最关键的观点和信息
4. 适当使用emoji表情增加亲和力
5. 段落简短，像社交媒体发帖或聊天的风格`,

  short: `短篇内容要求：
1. 总字数控制在300-800字之间
2. 各部分内容要简洁明了
3. 重点突出核心观点，避免冗余内容`,

  medium: `中篇内容要求：
1. 总字数控制在800-1500字之间
2. 各部分内容要详略得当
3. 可以适当展开重要观点，但避免过度冗长`,

  long: `长篇内容要求：
1. 总字数控制在1500-3000字之间
2. 各部分内容可以深入展开
3. 重要观点可以配合案例、数据或故事进行详细阐述
4. 注意内容的连贯性和逻辑性`,
};

// Common structure requirements for different detail levels
export const commonStructureRequirements = {
  simple: `简单结构要求：
1. 结构要简洁，只包含主要章节
2. 每个要点要简洁明了
3. 保持适当的层级关系
4. 根据指定篇幅合理规划结构`,

  base: `基础结构要求：
1. 结构要清晰，层次分明
2. 每个要点要简洁明了
3. 保持适当的层级关系
4. 确保内容适合目标人群
5. 根据指定篇幅合理规划各部分内容比例`,

  detailed: `详细结构要求：
1. 结构要清晰，层次分明
2. 每个要点要简洁明了
3. 保持适当的层级关系
4. 确保内容适合目标人群
5. 根据指定篇幅合理规划各部分内容比例
6. 为每个主要部分提供详细的子要点
7. 包含引言和总结部分
8. 考虑内容的逻辑流程和连贯性`,
};

// Audience targeting requirements
export const audienceRequirements = {
  general: "适合广泛受众，使用通用语言和概念。",
  professional: "适合专业人士，可使用行业术语和深入概念。",
  beginner: "适合初学者，解释基本概念，避免复杂术语。",
  expert: "适合专家级受众，可使用高级概念和深入讨论。",
};

// System prompt base that can be extended
export const systemPromptBase = "你是一个拥有十年经验的内容创作运营专家，精通内容策划、写作和优化。你擅长分析目标受众需求，创建引人入胜的叙事结构，并运用SEO策略提升内容可见度。你能根据不同平台特性调整内容风格，从专业学术论文到吸引眼球的社交媒体帖子都能胜任。你深谙内容营销的核心原则，知道如何通过优质内容建立品牌声誉并推动用户转化。你注重文章的自然流畅，严格避免过度修辞和堆砌辞藻，确保内容读起来自然而不做作。请根据用户需求，运用你丰富的经验生成高质量、有针对性的文章内容。";

// Model-specific system prompt
export const getModelSpecificSystemPrompt = ({ selectedChatModel }: { selectedChatModel: string }) => {
  const basePrompt = "你是一个专业的内容创作助手，擅长根据用户需求生成高质量的文章内容。你注重文章的自然流畅，严格避免过度修辞和堆砌辞藻，确保内容读起来自然而不做作。";

  // Add model-specific instructions if needed
  if (selectedChatModel === 'chat-model-reasoning') {
    return `${basePrompt} 你擅长逻辑推理和结构化思考，能够生成条理清晰、逻辑严密的内容。`;
  } else if (selectedChatModel === 'chat-model-large') {
    return `${basePrompt} 你擅长创意写作和内容整合，能够生成丰富多样、引人入胜的内容。`;
  } else {
    return basePrompt;
  }
};

// Common time reference for all prompts
export const timeReference = (time: string) => `当前时间参考：${time}`;

// Determine content length based on wordCount
export const determineContentLength = (wordCount: string | number | undefined): "mini" | "short" | "medium" | "long" => {
  if (!wordCount) return "medium";

  // If wordCount is "mini", use mini length
  if (wordCount === "mini") {
    return "mini";
  }

  // Otherwise try to parse as number
  const count = typeof wordCount === 'number' ? wordCount : parseInt(wordCount);

  if (isNaN(count)) return "medium";

  if (count <= 300) {
    return "mini";
  } else if (count <= 800) {
    return "short";
  } else if (count <= 1500) {
    return "medium";
  } else {
    return "long";
  }
};

// Common review requirement for natural writing
export const naturalWritingReview = `
请严格审查以下几点：
1. 文章是否存在过度修辞或堆砌辞藻的问题
2. 语言表达是否自然流畅，避免生硬或做作的表达
3. 是否使用了过多的形容词或华丽词藻
4. 内容是否简洁明了，直击要点
5. 是否避免了机械化或模板化的表达方式

确保文章写得自然流畅，就像一个真实的人在说话，而不是机器生成的内容。`;
