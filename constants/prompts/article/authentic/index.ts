import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview, determineContentLength, getStyleAdjustmentsByTypeAndLength } from '../../common/index';
import { exampleArticleRequirements } from '../index';
import { formatTargetAudience } from '../../structure';
import { authenticWritingReview } from '../../common/style/authentic';

// Base prompt for authentic articles
const basePrompt = `作为一位擅长写作真实、亲切内容的作者，请根据以下信息，生成一篇真实风格的文章：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

文章风格：真实风格

大纲：
{outline}

参考文章：
{exampleArticle}

结构分析：
{structureAnalysis}`;

// Authentic style requirements
const styleRequirements = `真实风格要求：
1. 用轻松随意的通俗化表达，引入真实个人轶事和经历
2. 引入真实个人轶事和经历详述而生活的内容
3. 微妙的细节变化与情感流动
4. 在结构和叙述流畅方面表现出良好的平衡
5. 使用恰当与的的比喻和案例
6. 加入一些语气词，让语言更有节奏感
7. 模拟真人自然的对话和思考方式
8. 刻意加入一些小细节，比如偶尔用词笨拙，塑造真实感

1. 按照主题和核心思路创建一篇真实、亲切的文章
2. 使用简洁灵活的 Markdown 格式
3. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构
4. 语言要轻松、自然，像正常人交谈的节奏
5. 可以使用一些口语化表达和生活化比喻
6. 保持亲切友好的语气
7. 可以适当调整结构，保持内容流畅性为主
8. 加入一些个人经历或故事元素，增加真实感
9. 使用一些反问句或感叹句，增加互动性
10. 偶尔使用一些不完整的句子结构，模拟口语表达`;

// Length-specific requirements
const lengthRequirements: Record<string, string> = {
  mini: `文章长度要求：
1. 总体字数控制在300-500字之间
2. 段落长度简短，每段2-3句话为宜
3. 确保内容简洁但不失真实感和细节`,

  short: `文章长度要求：
1. 总体字数控制在800-1200字之间
2. 段落长度适中，每段3-5句话为宜
3. 确保内容简洁但不失真实感和细节`,

  medium: `文章长度要求：
1. 总体字数控制在1500-2500字之间
2. 段落长度适中，每段4-6句话为宜
3. 可以加入更多个人经历和细节描述`,

  long: `文章长度要求：
1. 总体字数控制在3000-5000字之间
2. 段落长度适中，每段5-8句话为宜
3. 可以深入展开个人经历和故事，加入更丰富的细节和情感描述`
};

// Final review requirements
const finalReviewRequirements = `
最终审查要求：
${authenticWritingReview}

特别注意：
1. 确保文章包含真实感的个人经历或故事元素
2. 确保语言表达自然流畅，像真人对话一样
3. 确保有适当的细节描述和情感表达
4. 确保结构自然，避免过于完美或机械化
5. 确保使用了恰当的比喻和实例
6. 确保有一些语气词和口语化表达
7. 确保有一些小的不完美细节，增加真实感`;

// Generate the prompt based on the configuration
export function generatePrompt(config: ArticleConfig): string {
  // Determine content length from wordCount
  const contentLength = determineContentLength(config.wordCount);

  // Get style adjustments
  const styleAdjustments = getStyleAdjustmentsByTypeAndLength('authentic', contentLength);

  let requirements = `${styleRequirements}

${lengthRequirements[contentLength]}

${styleAdjustments}

${finalReviewRequirements}`;

  if (config.targetAudience) {
    requirements = formatTargetAudience(config.targetAudience) + '\n\n' + requirements;
  }

  if (config.exampleArticle) {
    requirements += '\n\n' + exampleArticleRequirements;
  }

  return basePrompt
    .replace('{topic}', config.topic)
    .replace('{coreIdeas}', config.coreIdeas || '无特定核心思路，请根据主题自行发挥。')
    .replace('{timeRef}', timeReference)
    .replace('{requirements}', requirements)
    .replace('{outline}', config.outline || '无特定大纲要求，请根据主题自行组织内容结构。')
    .replace('{exampleArticle}', config.exampleArticle || '无参考文章。')
    .replace('{structureAnalysis}', config.structureAnalysis || '无特定结构分析，请根据主题和要求自行组织内容。');
}

// Export the default function for authentic articles
export default (config: ArticleConfig) => generatePrompt(config);
