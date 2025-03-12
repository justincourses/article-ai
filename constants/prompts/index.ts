/**
 * Prompts for content generation
 */

import { getModelSpecificSystemPrompt as systemPrompt } from './common';
import * as articlePrompts from './article';
import * as summaryPrompts from './summary';
import * as structurePrompts from './structure';
import { determineContentLength, timeReference } from './common';

// Export all prompts
export {
  systemPrompt,
  articlePrompts,
  summaryPrompts,
  structurePrompts,
  determineContentLength,
  timeReference
};

// Export the main template builder
export { buildPromptTemplate } from './template-builder';
