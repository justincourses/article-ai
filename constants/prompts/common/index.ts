/**
 * Common prompt components that can be reused across different endpoints
 */

// Import from style module
import * as styleModule from './style';
export const {
  styleRequirements,
  detailedStyleRequirements,
  naturalWritingReview
} = styleModule;
export * as style from './style';

// Import from format module
import * as formatModule from './format';
export const {
  formatRequirements,
  detailedFormatRequirements
} = formatModule;
export * as format from './format';

// Import from length module
import * as lengthModule from './length';
export const {
  lengthRequirements,
  detailedLengthRequirements,
  determineContentLength,
  articleTypeStyleAdjustments,
  getStyleAdjustmentsByTypeAndLength
} = lengthModule;
export * as length from './length';
export const commonLengthRequirements = detailedLengthRequirements;

// Import from structure module
import * as structureModule from './structure';
export const {
  structureRequirements,
  detailedStructureRequirements,
  contentStructureTemplates
} = structureModule;
export * as structure from './structure';
export const commonStructureRequirements = detailedStructureRequirements;

// Import from audience module
import * as audienceModule from './audience';
export const {
  audienceRequirements,
  detailedAudienceRequirements,
  audienceAdaptationGuidelines
} = audienceModule;
export * as audience from './audience';

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
