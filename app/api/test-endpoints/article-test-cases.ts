import { NextRequest, NextResponse } from 'next/server';
import { articlePrompts } from '@/constants/prompts';
import { DEFAULT_MODELS } from '@/constants/writer/models';
import { systemPrompt } from '@/constants/prompts';

// 测试用例类型定义
interface TestCase {
  name: string;
  input: {
    topic: string;
    style: string;
    coreIdeas: string;
    outline: string;
    requirements?: string;
    length?: 'mini' | 'short' | 'medium' | 'long';
    styleType?: 'formal' | 'casual' | 'creative' | 'technical';
    wordCount?: string | number;
    messages?: any[];
  };
  expected: {
    finalLength: 'mini' | 'short' | 'medium' | 'long';
    requirementsExtracted?: boolean;
  };
}

// 测试用例集合
const TEST_CASES: TestCase[] = [
  {
    name: '基本测试 - 使用默认长度',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '专业、详细',
      coreIdeas: '探讨AI如何改变医疗诊断和治疗方式',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'medium',
      styleType: 'formal',
    },
    expected: {
      finalLength: 'medium',
    }
  },
  {
    name: '字数覆盖长度 - mini (字符串)',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '简洁、精炼',
      coreIdeas: '探讨AI如何改变医疗诊断',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'medium', // 这个应该被wordCount覆盖
      styleType: 'casual',
      wordCount: 'mini',
    },
    expected: {
      finalLength: 'mini',
    }
  },
  {
    name: '字数覆盖长度 - 数字 (300以内)',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '简洁、精炼',
      coreIdeas: '探讨AI如何改变医疗诊断',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'medium', // 这个应该被wordCount覆盖
      styleType: 'casual',
      wordCount: 250,
    },
    expected: {
      finalLength: 'mini',
    }
  },
  {
    name: '字数覆盖长度 - 数字 (300-800)',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '简洁、精炼',
      coreIdeas: '探讨AI如何改变医疗诊断',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'medium', // 这个应该被wordCount覆盖
      styleType: 'casual',
      wordCount: 500,
    },
    expected: {
      finalLength: 'short',
    }
  },
  {
    name: '字数覆盖长度 - 数字 (800-1500)',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '简洁、精炼',
      coreIdeas: '探讨AI如何改变医疗诊断',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'short', // 这个应该被wordCount覆盖
      styleType: 'casual',
      wordCount: 1200,
    },
    expected: {
      finalLength: 'medium',
    }
  },
  {
    name: '字数覆盖长度 - 数字 (1500以上)',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '简洁、精炼',
      coreIdeas: '探讨AI如何改变医疗诊断',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'medium', // 这个应该被wordCount覆盖
      styleType: 'casual',
      wordCount: 2000,
    },
    expected: {
      finalLength: 'long',
    }
  },
  {
    name: '从消息中提取要求',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '简洁、精炼',
      coreIdeas: '探讨AI如何改变医疗诊断',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'medium',
      styleType: 'casual',
      messages: [
        {
          id: 'test-msg',
          role: 'user',
          content: 'generate article with requirements: 增加对AI医疗伦理问题的讨论'
        }
      ]
    },
    expected: {
      finalLength: 'medium',
      requirementsExtracted: true
    }
  },
  {
    name: '直接提供要求',
    input: {
      topic: '人工智能在医疗领域的应用',
      style: '简洁、精炼',
      coreIdeas: '探讨AI如何改变医疗诊断',
      outline: '# 人工智能在医疗领域的应用\n- 引言\n- AI在医疗诊断中的应用\n- 结论',
      length: 'medium',
      styleType: 'casual',
      requirements: '增加对AI医疗伦理问题的讨论'
    },
    expected: {
      finalLength: 'medium',
      requirementsExtracted: true
    }
  }
];

/**
 * 运行所有测试用例并返回结果
 */
export async function runAllTests() {
  const results = [];

  for (const testCase of TEST_CASES) {
    try {
      // 准备测试数据
      const {
        topic,
        style,
        coreIdeas,
        outline,
        requirements,
        length = "medium",
        styleType = "casual",
        wordCount,
        messages = []
      } = testCase.input;

      const time = new Date().toISOString();
      const id = `test-${Date.now()}`;

      // 确定长度
      let contentLength = length;
      if (wordCount) {
        // 如果wordCount是"mini"，使用mini长度
        if (wordCount === "mini") {
          contentLength = "mini";
        } else {
          // 否则尝试解析为数字
          const count = typeof wordCount === 'number' ? wordCount : parseInt(wordCount as string);
          if (count <= 300) {
            contentLength = "mini";
          } else if (count <= 800) {
            contentLength = "short";
          } else if (count <= 1500) {
            contentLength = "medium";
          } else {
            contentLength = "long";
          }
        }
      }

      // 从消息内容中提取要求（如果未直接提供）
      let extractedRequirements = requirements;
      if (!extractedRequirements && messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const content = lastMessage.content;

        // 检查内容是否包含要求
        if (content.includes('with requirements:')) {
          extractedRequirements = content.split('with requirements:')[1].trim();
        }
      }

      // 使用提示工具生成提示
      const prompt = articlePrompts.getArticlePrompt({
        time,
        topic,
        style,
        coreIdeas,
        outline,
        requirements: extractedRequirements,
        length: contentLength as any,
        styleType: styleType as any,
      });

      // 创建带有提示的消息
      const promptMessages = [
        {
          id,
          role: "user",
          content: prompt,
        },
      ];

      // 使用常量中的文章模型
      const modelToUse = DEFAULT_MODELS.ARTICLE;

      // 获取系统提示
      const system = systemPrompt({ selectedChatModel: modelToUse });

      // 验证测试结果
      const testPassed = testCase.expected.finalLength === contentLength;
      const requirementsTest = testCase.expected.requirementsExtracted !== undefined ?
        (!!extractedRequirements === testCase.expected.requirementsExtracted) : true;

      // 添加测试结果
      results.push({
        name: testCase.name,
        passed: testPassed && requirementsTest,
        details: {
          input: testCase.input,
          expected: testCase.expected,
          actual: {
            finalLength: contentLength,
            extractedRequirements: extractedRequirements || null,
          },
          prompt: prompt.substring(0, 200) + '...' // 只显示提示的前200个字符
        }
      });
    } catch (error) {
      results.push({
        name: testCase.name,
        passed: false,
        error: (error as Error).message
      });
    }
  }

  return {
    totalTests: TEST_CASES.length,
    passedTests: results.filter(r => r.passed).length,
    results
  };
}

/**
 * 测试端点，运行所有测试用例并返回结果
 */
export async function GET(request: Request) {
  try {
    const testResults = await runAllTests();

    return NextResponse.json({
      success: true,
      testResults
    });
  } catch (error) {
    console.error('Error running article tests:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    }, { status: 500 });
  }
}
