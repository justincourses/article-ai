import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview, determineContentLength, getStyleAdjustmentsByTypeAndLength } from '../../common/index';
import { exampleArticleRequirements } from '../index';

// Base prompt for social media articles
const basePrompt = `作为一位经验丰富的社交媒体内容创作者，请根据以下信息，生成一篇社交媒体文章：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

文章风格：{style}

大纲：
{outline}

参考文章：
{exampleArticle}

结构分析：
{structureAnalysis}`;

// Style-specific requirements
const styleRequirements = {
  formal: `文章应该采用正式、学术的语气，使用专业术语和规范的表达方式。
保持客观、理性的论述风格，避免过于口语化的表达。
注重逻辑性和严谨性，适当引用数据和研究支持观点。
语言要流畅自然，符合正式场合的语言习惯。
使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构。

1. 按照主题和核心思路创建一篇内容严谨的文章
2. 使用规范的 Markdown 格式，包括标题层级、列表和引用
3. 语言要正式、专业，适合学术或商业场景
4. 严格保持文章结构的层次性和逻辑性
5. 使用准确的术语和数据支持论点
6. 避免使用口语化表达和主观评价
7. 段落之间要有清晰的过渡和连接`,

  casual: `文章应该采用轻松、自然的语气，像朋友间的对话一样。
可以使用日常用语和口语化表达，但要保持适度。
重点在于让内容易于理解和引起共鸣。
语言要流畅自然，符合日常交流的语言习惯。
使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构。

1. 按照主题和核心思路创建一篇轻松易读的文章
2. 使用简洁灵活的 Markdown 格式
3. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构
4. 语言要轻松、自然，像正常人交谈的节奏
5. 可以使用一些口语化表达和生活化比喻
6. 保持亲切友好的语气
7. 可以适当调整结构，保持内容流畅性为主`,

  persuasive: `文章应该具有强烈的说服力和感染力。
使用有力的论据和具体的例子来支持观点。
注重情感共鸣，但同时保持逻辑性。
语言要流畅自然，符合日常交流的语言习惯。
使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构。`,

  descriptive: `文章应该重视细节描写，生动形象地展现主题。
使用丰富的修辞手法，营造具体的场景和氛围。
注重感官描写，让读者能够身临其境。
语言要流畅自然，符合日常交流的语言习惯。
使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构。`,

  creative: `文章应该富有创意和想象力，能够吸引读者的注意力。
使用独特的视角和表达方式，展现主题的新颖性。
注重情感表达和故事性，让内容更加生动有趣。
语言要流畅自然，符合日常交流的语言习惯。
使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构。

1. 按照主题和核心思路创建一篇有创意的文章
2. 使用 Markdown 格式，可以灵活运用格式增强表现力
3. 使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构
4. 语言要生动、富有创意，适合吸引读者注意力
5. 像正常人讲故事的语气，保持自然的节奏感
6. 可以使用修辞手法和生动的描述
7. 注重情感表达和故事性
8. 可以采用非传统的结构安排，如故事化、场景化的结构`,

  technical: `文章应该清晰准确地传达技术信息，使复杂概念易于理解。
使用专业术语，但同时提供必要的解释和背景信息。
注重逻辑性和信息准确性，确保内容的可靠性。
语言要流畅自然，符合日常交流的语言习惯。
使用大小标题+正文自然段的形式组织内容，避免过于形式化的文档结构。

1. 按照主题和核心思路创建一篇技术内容清晰的文章
2. 使用规范的 Markdown 格式，适当使用代码块、表格等技术内容格式
3. 使用大小标题+正文自然段的形式组织内容，避免像学术论文的结构
4. 语言要专业但平易近人，避免过于生硬的表达
5. 使用行业术语和准确的技术描述，但保持对话式的语言节奏
6. 注重逻辑性和信息准确性
7. 结构要清晰，重点突出，便于技术读者快速获取信息`,
};

// Function to generate prompt based on style
const getPromptByStyle = (config: ArticleConfig, style: string) => {
  const { topic, coreIdeas, wordCount, exampleArticle, outline, structureAnalysis } = config;

  // Get the appropriate requirements based on style
  const requirements = styleRequirements[style as keyof typeof styleRequirements] || styleRequirements.formal;

  // Determine content length
  const contentLength = determineContentLength(wordCount);

  // Get the appropriate length requirements
  const lengthReq = commonLengthRequirements[wordCount as keyof typeof commonLengthRequirements] || commonLengthRequirements.medium;

  // Get style adjustments based on article type and content length
  const styleAdjustments = getStyleAdjustmentsByTypeAndLength('social_media', contentLength);

  // Create the time reference
  const timeRef = timeReference(new Date().toISOString());

  // Add example article requirements if an example is provided
  const exampleReq = exampleArticle ? exampleArticleRequirements : '';

  // Replace placeholders in the base prompt
  return basePrompt
    .replace('{topic}', topic)
    .replace('{coreIdeas}', coreIdeas)
    .replace('{timeRef}', timeRef)
    .replace('{requirements}', `${requirements}\n\n${lengthReq}\n\n${styleAdjustments}\n\n${exampleReq}`)
    .replace('{style}', style)
    .replace('{outline}', outline || '未提供大纲')
    .replace('{exampleArticle}', exampleArticle || '未提供参考文章')
    .replace('{structureAnalysis}', structureAnalysis || '未提供结构分析') + `

请在生成社交媒体文章前，确认以下几点：
1. 文章内容是否完全符合主题和核心思路
2. 文章是否包含了所有必要的内容要点
3. 文章结构是否合理，是否有清晰的引言、主体和结论
4. 文章篇幅是否符合要求
5. 语言是否符合指定的社交媒体风格
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. 文章是否具有足够的吸引力和传播性
9. 涉及时间相关内容时，是否参考了提供的时间信息
10. 是否遵循了文章类型和篇幅的风格调整要求
11. 是否参考了提供的大纲结构
12. 是否借鉴了参考文章的优点

${naturalWritingReview}

如果有任何未满足的要求，请调整文章内容，直到所有要求都得到满足。

直接返回 Markdown 格式的文章内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const formal = (config: ArticleConfig) => getPromptByStyle(config, 'formal');
export const casual = (config: ArticleConfig) => getPromptByStyle(config, 'casual');
export const persuasive = (config: ArticleConfig) => getPromptByStyle(config, 'persuasive');
export const descriptive = (config: ArticleConfig) => getPromptByStyle(config, 'descriptive');
export const creative = (config: ArticleConfig) => getPromptByStyle(config, 'creative');
export const technical = (config: ArticleConfig) => getPromptByStyle(config, 'technical');
