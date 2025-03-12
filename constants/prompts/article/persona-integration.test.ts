/**
 * Example usage of persona and reviewer integration
 *
 * This file demonstrates how the integration works with different configurations.
 * It's not meant to be run as an actual test, but to show the expected behavior.
 */

import { integratePersonaAndReviewer } from './persona-integration';
import { ArticleConfig } from '@/store/writer/config';

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

// Default values for ArticleConfig properties
const defaultConfig: Partial<ArticleConfig> = {
  model: 'gpt-4',
  wordCount: 'medium',
  targetAudience: {
    ageRange: '',
    gender: '',
    incomeLevel: '',
    interests: [],
    userTraits: ''
  },
  writerPersona: {
    type: '',
    style: '',
    characteristics: ''
  },
  reviewerInfo: {
    hasReviewer: false,
    reviewerType: '',
    reviewerRequirements: ''
  }
};

// Example 1: With writer persona only
const configWithWriterPersonaOnly: ArticleConfig = {
  ...defaultConfig,
  topic: '人工智能在教育中的应用',
  coreIdeas: '探讨AI如何改变传统教育模式',
  articleType: 'social_media',
  style: 'technical',
  exampleArticle: '',
  writerPersona: {
    type: 'tech',
    style: 'educational',
    characteristics: '有10年教育科技经验，熟悉AI应用'
  }
} as ArticleConfig;

// Example 2: With reviewer info only
const configWithReviewerInfoOnly: ArticleConfig = {
  ...defaultConfig,
  topic: '人工智能在教育中的应用',
  coreIdeas: '探讨AI如何改变传统教育模式',
  articleType: 'social_media',
  style: 'technical',
  exampleArticle: '',
  reviewerInfo: {
    hasReviewer: true,
    reviewerType: 'expert',
    reviewerRequirements: '确保技术准确性，避免过度夸大AI能力'
  }
} as ArticleConfig;

// Example 3: Testing different article types for anti-AI detection
const articleTypeExamples: ArticleConfig[] = [
  {
    ...defaultConfig,
    topic: '社交媒体营销策略',
    coreIdeas: '如何利用社交媒体提升品牌影响力',
    articleType: 'social_media',
    style: 'casual',
    exampleArticle: ''
  } as ArticleConfig,
  {
    ...defaultConfig,
    topic: '年度财务报告解析',
    coreIdeas: '分析公司财务状况和未来展望',
    articleType: 'business',
    style: 'formal',
    exampleArticle: ''
  } as ArticleConfig,
  {
    ...defaultConfig,
    topic: '毕业典礼致辞',
    coreIdeas: '激励毕业生迎接未来挑战',
    articleType: 'speech',
    style: 'inspirational',
    exampleArticle: ''
  } as ArticleConfig,
  {
    ...defaultConfig,
    topic: '产品介绍视频脚本',
    coreIdeas: '展示产品特点和使用场景',
    articleType: 'video_script',
    style: 'persuasive',
    exampleArticle: ''
  } as ArticleConfig
];

// Function to demonstrate the integration
function demonstrateIntegration() {
  console.log('Example 1: With writer persona only');
  const result1 = integratePersonaAndReviewer(configWithWriterPersonaOnly, sampleBasePrompt);
  console.log(result1);
  console.log('\n-----------------------------------\n');

  console.log('Example 2: With reviewer info only');
  const result2 = integratePersonaAndReviewer(configWithReviewerInfoOnly, sampleBasePrompt);
  console.log(result2);
  console.log('\n-----------------------------------\n');

  console.log('Example 3: Testing different article types for anti-AI detection');
  articleTypeExamples.forEach((config, index) => {
    console.log(`Article Type ${index + 1}: ${config.articleType}`);
    const result = integratePersonaAndReviewer(config, sampleBasePrompt);
    // Extract just the anti-AI part for brevity
    const antiAIPart = result.split('# 最终优化\n')[1] || 'No anti-AI part found';
    console.log('Anti-AI Strategy:', antiAIPart.substring(0, 100) + '...');
    console.log('\n-----------------------------------\n');
  });
}

// Uncomment to run the demonstration
// demonstrateIntegration();
