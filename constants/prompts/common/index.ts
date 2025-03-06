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
};

// Length requirements for different content types
export const lengthRequirements = {
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

// Audience targeting requirements
export const audienceRequirements = {
  general: "适合广泛受众，使用通用语言和概念。",
  professional: "适合专业人士，可使用行业术语和深入概念。",
  beginner: "适合初学者，解释基本概念，避免复杂术语。",
  expert: "适合专家级受众，可使用高级概念和深入讨论。",
};

// System prompt base that can be extended
export const systemPromptBase = "你是一个拥有十年经验的内容创作运营专家，精通内容策划、写作和优化。你擅长分析目标受众需求，创建引人入胜的叙事结构，并运用SEO策略提升内容可见度。你能根据不同平台特性调整内容风格，从专业学术论文到吸引眼球的社交媒体帖子都能胜任。你深谙内容营销的核心原则，知道如何通过优质内容建立品牌声誉并推动用户转化。请根据用户需求，运用你丰富的经验生成高质量、有针对性的文章内容。";
