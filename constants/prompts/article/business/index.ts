import { ArticleConfig } from '@/store/writer/config';
import { commonLengthRequirements, timeReference, naturalWritingReview, determineContentLength, getStyleAdjustmentsByTypeAndLength } from '../../common/index';

// Base prompt for business articles
const basePrompt = `作为一位拥有多年国家公务系统经验的撰稿人，对阅读对象有着极高的敏感性，请根据以下信息，生成一篇商业文章：

主题：{topic}

核心思路：
{coreIdeas}

{timeRef}

要求：
{requirements}

文章风格：{style}

大纲：
{outline}`;

// Style-specific requirements
const styleRequirements = {
  formal_report: `报告应采用高度正式、专业的商务语言。
严格遵循标准报告格式，包括摘要、引言、正文、结论和建议等部分。
使用精确的商业和行业术语，保持客观中立的语气。
提供详实的数据分析、图表和证据支持所有观点和结论。
语言要简洁明了，符合正式商业报告的表达习惯。
使用规范的标题层级结构，确保报告逻辑清晰、结构严谨。
适合提交给高管、董事会或外部利益相关者的正式商业报告。`,

  proposal: `提案应该清晰地阐述问题、解决方案和预期成果。
使用专业、有说服力的语言，突出提案的价值和可行性。
包含详细的实施计划、时间表和资源需求。
提供数据支持和分析，证明提案的必要性和潜在回报。
语言要精准专业，符合商业提案的表达习惯。
使用大小标题+正文自然段的形式组织内容，确保提案结构清晰有序。`,

  announcement: `公告应该简洁明了，直接传达关键信息。
使用正式、清晰的语言，避免歧义和误解。
按照重要性顺序组织内容，确保核心信息突出。
考虑受众需求，提供必要的背景和后续步骤。
语言要正式得体，符合公告通知的表达习惯。
使用大小标题+正文自然段的形式组织内容，确保公告结构规范有序。`,

  memo: `备忘录应该简洁、直接，重点突出。
使用清晰、专业的语言，避免不必要的细节。
明确标明主题、日期、发送者和接收者。
按照逻辑顺序组织内容，便于快速阅读和理解。
语言要简洁明了，符合内部沟通的表达习惯。
使用大小标题+正文自然段的形式组织内容，确保备忘录结构清晰有序。`,

  business_email: `商务邮件应该专业、简洁，直接表达核心信息。
包含清晰的主题行、恰当的称呼和结束语。
使用正式但友好的语气，保持专业礼貌。
按照逻辑顺序组织内容，确保信息传递清晰。
段落简短，重点突出，便于快速阅读。
包含必要的联系信息和后续行动建议。
遵循标准商务邮件格式，包括问候语、正文和签名。
语言要简洁明了，避免冗长和复杂的句式。`,

  red_headed_document: `红头文件应严格遵循官方公文格式规范。
包含完整的发文机关、文号、标题、正文、落款等要素。
使用规范的公文语言，保持庄重严肃的语气。
内容层次分明，条理清晰，逻辑严密。
使用标准的公文结构，包括标题、主送机关、正文、落款等。
语言要精准规范，符合公文写作规范。
注重文件的权威性和严肃性，避免口语化表达。
按照"发文字号-标题-主送单位-正文-落款"的标准格式组织内容。
正文部分可使用编号条款形式，确保内容清晰有序。`,
};

// Function to generate prompt based on style
const getPromptByStyle = (config: ArticleConfig, style: string) => {
  const { topic, coreIdeas, wordCount } = config;

  // Get the appropriate requirements based on style
  const requirements = styleRequirements[style as keyof typeof styleRequirements] || styleRequirements.formal_report;

  // Determine content length
  const contentLength = determineContentLength(wordCount);

  // Get the appropriate length requirements
  const lengthReq = commonLengthRequirements[wordCount as keyof typeof commonLengthRequirements] || commonLengthRequirements.medium;

  // Get style adjustments based on article type and content length
  const styleAdjustments = getStyleAdjustmentsByTypeAndLength('business', contentLength);

  // Create the time reference
  const timeRef = timeReference(new Date().toISOString());

  // Replace placeholders in the base prompt
  return basePrompt
    .replace('{topic}', topic)
    .replace('{coreIdeas}', coreIdeas)
    .replace('{timeRef}', timeRef)
    .replace('{requirements}', `${requirements}\n\n${lengthReq}\n\n${styleAdjustments}`)
    .replace('{style}', style)
    .replace('{outline}', '') + `

请在生成商业文章前，确认以下几点：
1. 文章内容是否完全符合主题和核心思路
2. 文章是否包含了所有必要的商业内容要点
3. 文章结构是否合理，是否有清晰的引言、主体和结论
4. 文章篇幅是否符合要求
5. 语言是否专业准确，符合指定的商业风格
6. 是否使用了正确的 Markdown 格式
7. 是否满足了所有补充要求
8. 文章是否提供了有价值的商业见解或建议
9. 涉及时间相关内容时，是否参考了提供的时间信息
10. 是否遵循了文章类型和篇幅的风格调整要求

${naturalWritingReview}

如果有任何未满足的要求，请调整文章内容，直到所有要求都得到满足。

直接返回 Markdown 格式的文章内容，不要使用代码块。`;
};

// Export style-specific prompt generators
export const formal_report = (config: ArticleConfig) => getPromptByStyle(config, 'formal_report');
export const proposal = (config: ArticleConfig) => getPromptByStyle(config, 'proposal');
export const announcement = (config: ArticleConfig) => getPromptByStyle(config, 'announcement');
export const memo = (config: ArticleConfig) => getPromptByStyle(config, 'memo');
export const business_email = (config: ArticleConfig) => getPromptByStyle(config, 'business_email');
export const red_headed_document = (config: ArticleConfig) => getPromptByStyle(config, 'red_headed_document');
