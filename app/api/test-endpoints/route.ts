import { NextResponse } from 'next/server';
import { DEFAULT_MODELS } from '@/constants/writer/models';

export async function GET(request: Request) {
  // Test data for structure endpoint
  const structureData = {
    id: 'test-structure',
    topic: '人工智能在医疗领域的应用',
    style: 'formal',
    coreIdeas: '探讨AI如何改变医疗诊断和治疗方式',
    wordCount: 'medium',
    targetAudience: {
      ageRange: '25-45',
      gender: '不限',
      incomeLevel: '中高收入',
      interests: ['科技', '医疗', '创新'],
      userTraits: '关注健康科技的专业人士'
    },
    messages: [
      {
        id: 'test-msg-1',
        role: 'user',
        content: 'generate outline'
      }
    ]
  };

  // Test data for article endpoint
  const articleData = {
    id: 'test-article',
    topic: '人工智能在医疗领域的应用',
    style: 'formal',
    coreIdeas: '探讨AI如何改变医疗诊断和治疗方式',
    wordCount: 'medium',
    outline: `# 人工智能在医疗领域的应用
- 引言
  - 医疗行业面临的挑战
  - AI技术的发展历程
- AI在医疗诊断中的应用
  - 影像识别
  - 病理分析
- AI在治疗方案制定中的作用
  - 个性化治疗
  - 药物研发
- 案例分析
  - 成功案例
  - 面临的挑战
- 未来展望
  - 技术趋势
  - 伦理考量
- 结论`,
    messages: [
      {
        id: 'test-msg-2',
        role: 'user',
        content: 'generate article with requirements: 增加对AI医疗伦理问题的讨论'
      }
    ]
  };

  // Test structure endpoint
  let structureResponse;
  try {
    const structureRes = await fetch(`${request.headers.get('origin')}/api/structure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(structureData),
    });

    structureResponse = {
      status: structureRes.status,
      statusText: structureRes.statusText,
      headers: Object.fromEntries(structureRes.headers.entries()),
    };
  } catch (error) {
    structureResponse = { error: (error as Error).message };
  }

  // Test article endpoint
  let articleResponse;
  try {
    const articleRes = await fetch(`${request.headers.get('origin')}/api/article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    articleResponse = {
      status: articleRes.status,
      statusText: articleRes.statusText,
      headers: Object.fromEntries(articleRes.headers.entries()),
    };
  } catch (error) {
    articleResponse = { error: (error as Error).message };
  }

  return NextResponse.json({
    structureEndpoint: structureResponse,
    articleEndpoint: articleResponse,
    message: '这是一个测试端点，用于验证新的API端点是否正常工作。实际响应内容是流式的，无法在此直接显示。'
  });
}
