/**
 * Example usage of persona and reviewer integration
 *
 * This file demonstrates how the integration works with different configurations.
 * It's not meant to be run as an actual test, but to show the expected behavior.
 */

import { integratePersonaAndReviewer } from './persona-integration';

// Sample base prompt
const sampleBasePrompt = `根据以下要求生成一篇完整的文章：

# 文章基本信息
主题：人工智能在教育中的应用
核心思路：探讨AI如何改变传统教育模式
当前时间参考：2023年10月
要求：
1. 按照主题和核心思路创建一篇内容丰富的文章
2. 使用 Markdown 格式

# 文章风格与表达
风格：科技解析

# 参考结构
# 引言
## AI在教育中的现状
# AI教育应用案例
# 未来展望
# 结论`;

// Example 1: With writer persona only
const configWithWriterPersonaOnly = {
  topic: '人工智能在教育中的应用',
  coreIdeas: '探讨AI如何改变传统教育模式',
  articleType: 'social_media',
  style: 'technical',
  writerPersona: {
    type: 'tech',
    style: 'educational',
    characteristics: '有10年教育科技经验，熟悉AI应用'
  }
};

// Example 2: With reviewer info only
const configWithReviewerInfoOnly = {
  topic: '人工智能在教育中的应用',
  coreIdeas: '探讨AI如何改变传统教育模式',
  articleType: 'social_media',
  style: 'technical',
  reviewerInfo: {
    hasReviewer: true,
    reviewerType: 'expert',
    reviewerRequirements: '确保技术准确性，避免过度夸大AI能力'
  }
};

// Example 3: With both writer persona and reviewer info
const configWithBoth = {
  topic: '人工智能在教育中的应用',
  coreIdeas: '探讨AI如何改变传统教育模式',
  articleType: 'social_media',
  style: 'technical',
  writerPersona: {
    type: 'professor',
    style: 'academic',
    characteristics: '教育学教授，研究教育技术20年'
  },
  reviewerInfo: {
    hasReviewer: true,
    reviewerType: 'academic_reviewer',
    reviewerRequirements: '确保学术严谨性，引用最新研究'
  }
};

// Example 4: With no writer persona or reviewer info
const configWithNeither = {
  topic: '人工智能在教育中的应用',
  coreIdeas: '探讨AI如何改变传统教育模式',
  articleType: 'social_media',
  style: 'technical'
};

/**
 * Example usage:
 *
 * const result1 = integratePersonaAndReviewer(configWithWriterPersonaOnly, sampleBasePrompt);
 * // Result will include writer persona but not reviewer info
 *
 * const result2 = integratePersonaAndReviewer(configWithReviewerInfoOnly, sampleBasePrompt);
 * // Result will include reviewer info but not writer persona
 *
 * const result3 = integratePersonaAndReviewer(configWithBoth, sampleBasePrompt);
 * // Result will include both writer persona and reviewer info
 *
 * const result4 = integratePersonaAndReviewer(configWithNeither, sampleBasePrompt);
 * // Result will be the same as the base prompt
 */
