/**
 * Tests for the template builder
 */

import { buildPromptTemplate } from './template-builder';
import { ArticleConfig } from '@/store/writer/config';

// Add Jest type declarations
declare global {
  namespace jest {
    interface Matchers<R> {
      toContain(expected: string): R;
      not: Matchers<R>;
    }
  }

  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void) => void;
  const expect: <T>(actual: T) => jest.Matchers<void>;
}

describe('Template Builder', () => {
  it('should generate a basic prompt with minimal config', () => {
    const config: ArticleConfig = {
      topic: '测试主题',
      articleType: 'social_media',
      style: 'casual',
      coreIdeas: '测试核心思路',
      exampleArticle: '',
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
      },
      outline: ''
    };

    const prompt = buildPromptTemplate(config);

    // Check that the prompt contains the basic information
    expect(prompt).toContain('测试主题');
    expect(prompt).toContain('测试核心思路');
    expect(prompt).not.toContain('目标受众');
    expect(prompt).not.toContain('写作者人设');
    expect(prompt).not.toContain('审核者要求');
  });

  it('should include target audience when provided', () => {
    const config: ArticleConfig = {
      topic: '测试主题',
      articleType: 'social_media',
      style: 'casual',
      coreIdeas: '测试核心思路',
      exampleArticle: '',
      model: 'gpt-4',
      wordCount: 'medium',
      targetAudience: {
        ageRange: '18-25',
        gender: '男性',
        incomeLevel: '中等收入',
        interests: ['科技', '游戏'],
        userTraits: '喜欢尝试新事物'
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
      },
      outline: ''
    };

    const prompt = buildPromptTemplate(config);

    // Check that the prompt contains the target audience information
    expect(prompt).toContain('目标受众');
    expect(prompt).toContain('18-25');
    expect(prompt).toContain('男性');
    expect(prompt).toContain('中等收入');
    expect(prompt).toContain('喜欢尝试新事物');
  });

  it('should include writer persona when provided', () => {
    const config: ArticleConfig = {
      topic: '测试主题',
      articleType: 'social_media',
      style: 'casual',
      coreIdeas: '测试核心思路',
      exampleArticle: '',
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
        type: 'tech',
        style: 'professional',
        characteristics: '擅长解释复杂概念'
      },
      reviewerInfo: {
        hasReviewer: false,
        reviewerType: '',
        reviewerRequirements: ''
      },
      outline: ''
    };

    const prompt = buildPromptTemplate(config);

    // Check that the prompt contains the writer persona information
    expect(prompt).toContain('写作者人设');
    expect(prompt).toContain('技术人出身');
    expect(prompt).toContain('专业严谨');
    expect(prompt).toContain('擅长解释复杂概念');
  });

  it('should include reviewer info when provided', () => {
    const config: ArticleConfig = {
      topic: '测试主题',
      articleType: 'social_media',
      style: 'casual',
      coreIdeas: '测试核心思路',
      exampleArticle: '',
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
        hasReviewer: true,
        reviewerType: 'editor',
        reviewerRequirements: '确保内容符合品牌调性'
      },
      outline: ''
    };

    const prompt = buildPromptTemplate(config);

    // Check that the prompt contains the reviewer information
    expect(prompt).toContain('审核者要求');
    expect(prompt).toContain('媒体主编');
    expect(prompt).toContain('确保内容符合品牌调性');
  });

  it('should include all sections when fully configured', () => {
    const config: ArticleConfig = {
      topic: '测试主题',
      articleType: 'social_media',
      style: 'casual',
      coreIdeas: '测试核心思路',
      exampleArticle: '这是一篇参考文章',
      model: 'gpt-4',
      wordCount: 'medium',
      targetAudience: {
        ageRange: '18-25',
        gender: '男性',
        incomeLevel: '中等收入',
        interests: ['科技', '游戏'],
        userTraits: '喜欢尝试新事物'
      },
      writerPersona: {
        type: 'tech',
        style: 'professional',
        characteristics: '擅长解释复杂概念'
      },
      reviewerInfo: {
        hasReviewer: true,
        reviewerType: 'editor',
        reviewerRequirements: '确保内容符合品牌调性'
      },
      outline: '这是文章大纲',
      structureAnalysis: '这是结构分析'
    };

    const prompt = buildPromptTemplate(config);

    // Check that the prompt contains all sections
    expect(prompt).toContain('测试主题');
    expect(prompt).toContain('测试核心思路');
    expect(prompt).toContain('目标受众');
    expect(prompt).toContain('写作者人设');
    expect(prompt).toContain('审核者要求');
    expect(prompt).toContain('这是文章大纲');
    expect(prompt).toContain('这是一篇参考文章');
    expect(prompt).toContain('这是结构分析');
  });
});
