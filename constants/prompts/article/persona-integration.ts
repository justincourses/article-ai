/**
 * Integration of writer persona and reviewer information into article prompts
 */

import { ArticleConfig } from '@/store/writer/config';
import { generateWriterPersonaPrompt, generateReviewerPrompt } from '../common/audience';
import { antiAIDetectionOptimization } from '../common';
import { formatTargetAudience } from '../structure';

/**
 * Selects the appropriate anti-AI detection strategy based on article type and style
 * @param config The article configuration
 * @returns The appropriate anti-AI detection strategy
 */
function selectAntiAIStrategy(config: ArticleConfig): string {
  const { articleType, style } = config;

  if (!antiAIDetectionOptimization || typeof antiAIDetectionOptimization !== 'object') {
    return antiAIDetectionOptimization || '';
  }

  // Select strategy based on article type
  if (articleType === 'social_media') {
    return antiAIDetectionOptimization.combinations.social || antiAIDetectionOptimization.basic;
  } else if (articleType === 'business') {
    return antiAIDetectionOptimization.combinations.marketing || antiAIDetectionOptimization.basic;
  } else if (articleType === 'speech') {
    // For speeches, we want a more natural, conversational tone
    return antiAIDetectionOptimization.comprehensive.polishSentences.zh || antiAIDetectionOptimization.basic;
  } else if (articleType === 'video_script') {
    // For video scripts, we want a more engaging, conversational tone
    return antiAIDetectionOptimization.combinations.social || antiAIDetectionOptimization.basic;
  }

  // Default to basic strategy
  return antiAIDetectionOptimization.basic || '';
}

/**
 * Formats target audience information for inclusion in the prompt
 * @param config The article configuration
 * @returns Formatted target audience section
 */
function formatTargetAudienceSection(config: ArticleConfig): string {
  if (!config.targetAudience) return '';

  const targetAudienceInfo = formatTargetAudience(config.targetAudience);

  return targetAudienceInfo ? `# 目标受众\n${targetAudienceInfo}` : '';
}

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

  // Generate target audience section
  const targetAudienceSection = formatTargetAudienceSection(config);

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

  // Add target audience section after writer persona or style section
  if (targetAudienceSection) {
    if (writerPersonaPrompt && enhancedPrompt.includes(writerPersonaPrompt)) {
      enhancedPrompt = enhancedPrompt.replace(
        writerPersonaPrompt,
        writerPersonaPrompt + '\n\n' + targetAudienceSection
      );
    } else if (enhancedPrompt.includes('# 文章风格与表达')) {
      enhancedPrompt = enhancedPrompt.replace(
        '# 文章风格与表达\n风格：{style}',
        '# 文章风格与表达\n风格：{style}\n\n' + targetAudienceSection
      );
    } else {
      // Otherwise add before the structure section
      enhancedPrompt = enhancedPrompt.replace(
        '# 参考结构',
        targetAudienceSection + '\n\n# 参考结构'
      );
    }
  }

  // Add reviewer prompt at the end of the prompt
  if (reviewerPrompt) {
    enhancedPrompt = enhancedPrompt + '\n\n' + reviewerPrompt;
  }

  // Add anti-AI detection optimization prompt at the very end
  // Select the appropriate strategy based on article type and style
  const antiAIPrompt = selectAntiAIStrategy(config);

  enhancedPrompt = enhancedPrompt + '\n\n# 最终优化\n' + antiAIPrompt;

  return enhancedPrompt;
}
