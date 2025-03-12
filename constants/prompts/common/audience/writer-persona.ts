/**
 * Writer persona and reviewer information for prompt generation
 */

// Type definitions
export interface WriterPersona {
  type?: string;
  style?: string;
  characteristics?: string;
}

export interface ReviewerInfo {
  hasReviewer: boolean;
  reviewerType?: string;
  reviewerRequirements?: string;
}

// Writer persona type mapping
export const writerPersonaTypePrompts: Record<string, string> = {
  media: `作为一位媒体人出身的作者，你擅长以新闻视角解读事件，善于抓住热点，文章结构清晰，语言简洁有力，善于使用引人入胜的开头和结尾。`,
  tech: `作为一位技术人出身的作者，你擅长解释复杂技术概念，使用精确的术语，关注细节和准确性，善于使用类比和示例来解释技术原理。`,
  executive: `作为一位企业高管出身的作者，你擅长从战略和管理角度分析问题，文章具有前瞻性和洞察力，善于使用商业案例和数据支持观点。`,
  professor: `作为一位教授出身的作者，你擅长学术性写作，逻辑严密，论证充分，善于引用研究和理论，文章结构系统化且有教育意义。`,
  businessman: `作为一位商人出身的作者，你擅长从商业价值和市场角度分析问题，注重实用性和投资回报，语言直接务实，善于使用商业智慧。`,
  entrepreneur: `作为一位草根创业者出身的作者，你文章风格亲民接地气，善于分享亲身经历和教训，语言充满激情和鼓舞性，注重实战经验。`,
  mother: `作为一位全职妈妈出身的作者，你擅长从家庭和育儿角度分析问题，文章温暖亲切，富有同理心，善于分享生活智慧和育儿经验。`,
  expert: `作为一位行业专家出身的作者，你擅长深度分析行业趋势和现象，文章专业权威，观点独到，善于使用行业案例和数据支持论点。`,
  government: `作为一位政府工作者出身的作者，你擅长从政策和公共管理角度分析问题，文章严谨规范，善于解读政策导向和社会影响。`,
  researcher: `作为一位研究人员出身的作者，你擅长科学严谨的写作，注重数据和实证，善于分析研究方法和结果，文章结构清晰有条理。`,
  doctor: `作为一位医生出身的作者，你擅长从健康和医学角度分析问题，文章专业准确，善于解释医学概念，注重科学性和实用建议。`,
  lawyer: `作为一位律师出身的作者，你擅长从法律和权益角度分析问题，文章逻辑严密，论证充分，善于解读法律条款和案例分析。`,
};

// Writer persona style mapping
export const writerPersonaStylePrompts: Record<string, string> = {
  professional: `你的写作风格专业严谨，使用准确的术语和概念，论证充分，结构清晰，适合专业领域的深度内容。`,
  casual: `你的写作风格轻松随意，语言亲切自然，使用日常用语和表达，善于与读者建立亲近感，适合轻松阅读的内容。`,
  humorous: `你的写作风格幽默风趣，善于使用双关语、比喻和夸张手法，文章充满趣味性，能够引发读者的笑声和共鸣。`,
  storytelling: `你的写作风格故事性强，善于构建引人入胜的叙事，使用场景描写和人物刻画，让读者沉浸在故事情节中。`,
  inspirational: `你的写作风格励志鼓舞，充满正能量和激励性，善于使用鼓舞人心的例子和语言，激发读者的行动力和信心。`,
  educational: `你的写作风格教育启发，注重知识传递和学习价值，善于解释概念和原理，引导读者思考和学习。`,
  analytical: `你的写作风格分析性强，善于深入剖析问题本质，使用逻辑推理和数据支持，帮助读者全面理解复杂问题。`,
  academic: `你的写作风格学术性强，遵循学术规范，使用专业术语和引用，论证严密，适合学术研究和专业讨论。`,
  journalistic: `你的写作风格新闻报道式，注重事实和客观性，使用5W1H原则，结构清晰，信息密度高，适合新闻和时事内容。`,
};

// Reviewer type mapping
export const reviewerTypePrompts: Record<string, string> = {
  editor: `文章将由媒体主编审核，他们注重内容的新闻价值、时效性和吸引力，要求标题醒目，开头引人入胜，结构清晰，语言精炼。`,
  operations: `文章将由运营人员审核，他们关注内容的用户吸引力、互动性和转化效果，要求内容符合平台调性，有明确的用户价值和行动引导。`,
  expert: `文章将由领域专家审核，他们注重内容的专业准确性、深度和洞察力，要求论点有力，论证充分，引用可靠，避免常见误解。`,
  client: `文章将由客户审核，他们关注内容是否符合品牌调性、传达核心信息，以及能否达成营销目标，要求内容符合品牌价值观和市场定位。`,
  publisher: `文章将由出版社编辑审核，他们注重内容的质量、深度和市场价值，要求文章有独特视角，结构完整，语言精炼，符合出版标准。`,
  government_official: `文章将由机关领导审核，他们关注内容的政治导向、社会影响和政策符合度，要求内容严谨规范，表述准确，避免敏感问题。`,
  consultant: `文章将由专业咨询顾问审核，他们注重内容的专业性、实用性和价值导向，要求分析深入，建议可行，有明确的问题解决方案。`,
  press_bureau: `文章将由新闻出版署审核，他们关注内容的政策符合度、社会责任和价值导向，要求内容积极健康，避免违规内容，符合出版规范。`,
  legal_advisor: `文章将由法律顾问审核，他们关注内容的法律合规性、风险规避和权益保护，要求表述准确，避免法律风险，尊重知识产权。`,
  academic_reviewer: `文章将由学术审稿人审核，他们注重内容的学术严谨性、创新性和研究价值，要求方法可靠，论证充分，引用规范，符合学术标准。`,
  content_supervisor: `文章将由内容监管人员审核，他们关注内容的合规性、安全性和社会影响，要求内容健康积极，避免敏感话题，符合内容监管要求。`,
  senior_management: `文章将由高级管理层审核，他们关注内容的战略符合度、品牌影响和商业价值，要求内容体现组织愿景和战略目标，具有高层次视角。`,
};

// Generate writer persona prompt based on writer persona settings
export function generateWriterPersonaPrompt(writerPersona: WriterPersona | undefined): string {
  if (!writerPersona) return '';

  const parts: string[] = [];

  // Add writer type prompt if available
  if (writerPersona.type && writerPersonaTypePrompts[writerPersona.type]) {
    parts.push(writerPersonaTypePrompts[writerPersona.type]);
  }

  // Add writer style prompt if available
  if (writerPersona.style && writerPersonaStylePrompts[writerPersona.style]) {
    parts.push(writerPersonaStylePrompts[writerPersona.style]);
  }

  // Add writer characteristics if available
  if (writerPersona.characteristics) {
    parts.push(`你的个人特点：${writerPersona.characteristics}`);
  }

  return parts.length > 0 ? `# 写作者人设\n${parts.join('\n')}` : '';
}

// Generate reviewer prompt based on reviewer settings
export function generateReviewerPrompt(reviewerInfo: ReviewerInfo | undefined): string {
  if (!reviewerInfo || !reviewerInfo.hasReviewer) return '';

  const parts: string[] = [];

  // Add reviewer type prompt if available
  if (reviewerInfo.reviewerType && reviewerTypePrompts[reviewerInfo.reviewerType]) {
    parts.push(reviewerTypePrompts[reviewerInfo.reviewerType]);
  }

  // Add reviewer requirements if available
  if (reviewerInfo.reviewerRequirements) {
    parts.push(`审核要求：${reviewerInfo.reviewerRequirements}`);
  }

  return parts.length > 0 ? `# 审核者要求\n${parts.join('\n')}` : '';
}
