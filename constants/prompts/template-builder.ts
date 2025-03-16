/**
 * Template builder for generating prompts
 *
 * This module provides a flexible way to build prompts by combining different sections
 * based on user configuration. It uses a template-based approach where each section
 * can be conditionally included or customized.
 */

import { ArticleConfig } from '@/store/writer/config';
import { formatTargetAudience } from './structure';
import { generateWriterPersonaPrompt, generateReviewerPrompt } from './common/audience';
import { timeReference, antiAIDetectionOptimization, naturalWritingReview } from './common';
import { articleRequirements, articleLengthRequirements } from './article';
import { determineContentLength, getStyleAdjustmentsByTypeAndLength } from './common';

// Interface for template sections
interface TemplateSection {
  id: string;
  title: string;
  content: (config: ArticleConfig) => string;
  condition?: (config: ArticleConfig) => boolean;
  order: number;
}

// Main template sections
const templateSections: TemplateSection[] = [
  {
    id: 'header',
    title: '',
    content: (config) => {
      const articleType = config.articleType || 'social_media';

      const headers = {
        'social_media': '作为一位经验丰富的社交媒体内容创作者，请根据以下信息，生成一篇社交媒体文章：',
        'business': '作为一位拥有多年国家公务系统经验的撰稿人，对阅读对象有着极高的敏感性，请根据以下信息，生成一篇商业文章：',
        'speech': '作为一位世界五百强企业的首席演讲稿撰稿人，请根据以下信息，生成一篇演讲稿：',
        'video_script': '作为一位资深编剧和小说家，请根据以下信息，生成一个视频脚本：',
        'authentic': '作为一位擅长写作真实、亲切内容的作者，请根据以下信息，生成一篇真实风格的文章：'
      };

      return headers[articleType as keyof typeof headers] || headers.social_media;
    },
    order: 0
  },
  {
    id: 'topic',
    title: '主题',
    content: (config) => config.topic || '',
    order: 10
  },
  {
    id: 'coreIdeas',
    title: '核心思路',
    content: (config) => config.coreIdeas || '',
    order: 20
  },
  {
    id: 'timeRef',
    title: '',
    content: (config) => timeReference(new Date().toISOString()),
    order: 30
  },
  {
    id: 'requirements',
    title: '要求',
    content: (config) => {
      const { articleType, style, wordCount } = config;

      // Get base requirements
      const baseReq = articleRequirements.base;

      // Get length requirements
      const contentLength = determineContentLength(wordCount);
      const lengthReq = articleLengthRequirements[wordCount as keyof typeof articleLengthRequirements] || articleLengthRequirements.medium;

      // Get style adjustments
      const styleAdjustments = getStyleAdjustmentsByTypeAndLength(articleType, contentLength);

      return `${baseReq}\n\n${lengthReq}\n\n${styleAdjustments}`;
    },
    order: 40
  },
  {
    id: 'style',
    title: '文章风格',
    content: (config) => config.style || '',
    order: 50
  },
  {
    id: 'emojiUsage',
    title: '表情符号使用',
    content: (config) => {
      const emojiUsage = config.emojiUsage || 'none';

      const emojiInstructions = {
        'none': '请不要在文章中使用任何表情符号或emoji。',
        'light': '请在文章中适当地使用少量表情符号(emoji)，主要在关键点或段落结尾处，以增强表达效果，但不要过度使用。',
        'heavy': '请在文章中大量使用表情符号(emoji)，可以在句子中、段落开头和结尾处使用，以增强文章的活泼感和表现力。'
      };

      return emojiInstructions[emojiUsage as keyof typeof emojiInstructions] || emojiInstructions.none;
    },
    order: 55
  },
  {
    id: 'targetAudience',
    title: '目标受众',
    content: (config) => {
      if (!config.targetAudience) return '';

      const targetAudienceInfo = formatTargetAudience(config.targetAudience);
      if (!targetAudienceInfo) return '';

      const audienceType = {
        'social_media': '读者',
        'business': '读者',
        'speech': '听众',
        'video_script': '观众',
        'authentic': '读者'
      };

      const type = audienceType[config.articleType as keyof typeof audienceType] || '读者';

      return `请确保内容、语言风格和表达方式适合以下目标${type}：\n${targetAudienceInfo}`;
    },
    condition: (config) => {
      return !!config.targetAudience &&
        (!!config.targetAudience.ageRange ||
         !!config.targetAudience.gender ||
         !!config.targetAudience.incomeLevel ||
         !!config.targetAudience.userTraits ||
         (config.targetAudience.interests && config.targetAudience.interests.length > 0));
    },
    order: 60
  },
  {
    id: 'writerPersona',
    title: '写作者人设',
    content: (config) => {
      if (!config.writerPersona) return '';
      return generateWriterPersonaPrompt(config.writerPersona);
    },
    condition: (config) => {
      return !!config.writerPersona &&
        (!!config.writerPersona.type ||
         !!config.writerPersona.style ||
         !!config.writerPersona.characteristics);
    },
    order: 70
  },
  {
    id: 'outline',
    title: '大纲',
    content: (config) => config.outline || '未提供大纲',
    order: 80
  },
  {
    id: 'exampleArticle',
    title: '参考文章',
    content: (config) => config.exampleArticle || '未提供参考文章',
    condition: (config) => !!config.exampleArticle,
    order: 90
  },
  {
    id: 'structureAnalysis',
    title: '结构分析',
    content: (config) => config.structureAnalysis || '未提供结构分析',
    condition: (config) => !!config.structureAnalysis,
    order: 100
  },
  {
    id: 'reviewerInfo',
    title: '审核者要求',
    content: (config) => {
      if (!config.reviewerInfo || !config.reviewerInfo.hasReviewer) return '';
      return generateReviewerPrompt(config.reviewerInfo);
    },
    condition: (config) => {
      return !!config.reviewerInfo &&
        config.reviewerInfo.hasReviewer &&
        (!!config.reviewerInfo.reviewerType ||
         !!config.reviewerInfo.reviewerRequirements);
    },
    order: 110
  },
  {
    id: 'finalChecks',
    title: '',
    content: (config) => {
      const contentType = {
        'social_media': '社交媒体文章',
        'business': '商业文章',
        'speech': '演讲稿',
        'video_script': '视频脚本',
        'authentic': '真实风格文章'
      };

      const type = contentType[config.articleType as keyof typeof contentType] || '文章';

      return `
请在生成${type}前，确认以下几点：
1. 内容是否完全符合主题和核心思路
2. 是否包含了所有必要的内容要点
3. 结构是否合理，是否有清晰的开场、主体和结尾
4. 篇幅是否符合要求
5. 语言是否符合指定的风格
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. 内容是否具有足够的吸引力和表现力
9. 涉及时间相关内容时，是否参考了提供的时间信息
10. 是否参考了提供的大纲结构
11. 是否借鉴了参考文章的优点
12. 内容和表达方式是否适合目标受众

${naturalWritingReview}

如果有任何未满足的要求，请调整内容，直到所有要求都得到满足。

直接返回 Markdown 格式的内容，不要使用代码块。`;
    },
    order: 120
  },
  {
    id: 'antiAI',
    title: '最终优化',
    content: (config) => {
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
      } else if (articleType === 'authentic') {
        // For authentic articles, we want a very natural, conversational tone with imperfections
        return antiAIDetectionOptimization.combinations.authentic || antiAIDetectionOptimization.basic;
      }

      // Default to basic strategy
      return antiAIDetectionOptimization.basic || '';
    },
    order: 130
  }
];

/**
 * Builds a prompt template based on the provided configuration
 * @param config The article configuration
 * @returns The complete prompt template
 */
export function buildPromptTemplate(config: ArticleConfig): string {
  // Filter sections based on conditions
  const filteredSections = templateSections.filter(section =>
    !section.condition || section.condition(config)
  );

  // Sort sections by order
  const sortedSections = filteredSections.sort((a, b) => a.order - b.order);

  // Build the prompt
  let prompt = '';

  sortedSections.forEach(section => {
    const content = section.content(config);
    if (!content) return;

    if (section.title) {
      prompt += `\n\n# ${section.title}\n${content}`;
    } else {
      prompt += `\n\n${content}`;
    }
  });

  // Trim and return
  return prompt.trim();
}
