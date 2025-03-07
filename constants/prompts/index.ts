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

// Re-export systemPrompt from common for backward compatibility
export { getModelSpecificSystemPrompt as systemPrompt } from './common';
