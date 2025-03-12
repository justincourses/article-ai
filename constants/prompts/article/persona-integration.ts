/**
 * Integration of writer persona and reviewer information into article prompts
 */

import { ArticleConfig } from '@/store/writer/config';
import { generateWriterPersonaPrompt, generateReviewerPrompt } from '../common/audience';

/**
 * Integrates writer persona and reviewer information into the article prompt
 * @param config The article configuration
 * @param basePrompt The base article prompt to enhance
 * @returns The enhanced prompt with writer persona and reviewer information
 */
export function integratePersonaAndReviewer(config: ArticleConfig, basePrompt: string): string {
  // Generate writer persona prompt if available
  const writerPersonaPrompt = config.writerPersona
    ? generateWriterPersonaPrompt(config.writerPersona)
    : '';

  // Generate reviewer prompt if available
  const reviewerPrompt = config.reviewerInfo && config.reviewerInfo.hasReviewer
    ? generateReviewerPrompt(config.reviewerInfo)
    : '';

  // Combine the prompts
  let enhancedPrompt = basePrompt;

  // Add writer persona prompt after the style section
  if (writerPersonaPrompt) {
    // If the prompt contains a style section, add after it
    if (enhancedPrompt.includes('# 文章风格与表达')) {
      enhancedPrompt = enhancedPrompt.replace(
        '# 文章风格与表达\n风格：{style}',
        '# 文章风格与表达\n风格：{style}\n\n' + writerPersonaPrompt
      );
    } else {
      // Otherwise add before the structure section
      enhancedPrompt = enhancedPrompt.replace(
        '# 参考结构',
        writerPersonaPrompt + '\n\n# 参考结构'
      );
    }
  }

  // Add reviewer prompt at the end of the prompt
  if (reviewerPrompt) {
    enhancedPrompt = enhancedPrompt + '\n\n' + reviewerPrompt;
  }

  return enhancedPrompt;
}
