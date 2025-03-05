/**
 * Central export point for all prompt modules
 */

// Export common prompts
export * from './common';

// Export article prompts
export * as articlePrompts from './article';

// Export structure prompts
export * as structurePrompts from './structure';

// Export summary prompts
export * as summaryPrompts from './summary';

// System prompt that can be used across different endpoints
export const systemPrompt = ({ selectedChatModel }: { selectedChatModel: string }) => {
  const basePrompt = "你是一个专业的内容创作助手，擅长根据用户需求生成高质量的文章内容。";

  // Add model-specific instructions if needed
  if (selectedChatModel === 'chat-model-reasoning') {
    return `${basePrompt} 你擅长逻辑推理和结构化思考，能够生成条理清晰、逻辑严密的内容。`;
  } else if (selectedChatModel === 'chat-model-large') {
    return `${basePrompt} 你擅长创意写作和内容整合，能够生成丰富多样、引人入胜的内容。`;
  } else {
    return basePrompt;
  }
};
