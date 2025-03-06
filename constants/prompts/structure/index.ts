/**
 * Prompts for article structure generation
 */

// Base prompt for structure generation
export const structureBasePrompt = `根据以下要求生成一篇文章的思维导图结构：

主题：{topic}
风格：{style}
核心思路：{coreIdeas}
文章篇幅：{wordCount}
当前时间参考：{time}
目标人群：
{targetAudience}
{exampleArticle}`;

// Target audience format
export const formatTargetAudience = (targetAudience: any) => {
  if (!targetAudience) return "- 目标人群：不限";

  return `- 年龄层次：${targetAudience?.ageRange || '不限'}
- 性别倾向：${targetAudience?.gender || '不限'}
- 消费层次：${targetAudience?.incomeLevel || '不限'}
- 兴趣类目：${targetAudience?.interests?.join('、') || '不限'}
- 用户特征：${targetAudience?.userTraits || '不限'}`;
};

// Requirements for structure generation
export const structureRequirements = {
  base: `要求：
1. 使用 Markdown 格式的缩进列表
2. 结构要清晰，层次分明
3. 每个要点要简洁明了
4. 保持适当的缩进以表示层级关系
5. 确保内容适合目标人群的阅读习惯和兴趣
6. 根据指定篇幅合理规划各部分内容比例
7. 内容要符合用户特征描述的偏好和行为习惯`,

  detailed: `要求：
1. 使用 Markdown 格式的缩进列表
2. 结构要清晰，层次分明
3. 每个要点要简洁明了
4. 保持适当的缩进以表示层级关系
5. 确保内容适合目标人群的阅读习惯和兴趣
6. 根据指定篇幅合理规划各部分内容比例
7. 内容要符合用户特征描述的偏好和行为习惯
8. 为每个主要部分提供详细的子要点
9. 包含引言和总结部分
10. 考虑内容的逻辑流程和连贯性`,

  simple: `要求：
1. 使用 Markdown 格式的缩进列表
2. 结构要简洁，只包含主要章节
3. 每个要点要简洁明了
4. 保持适当的缩进以表示层级关系
5. 确保内容适合目标人群
6. 根据指定篇幅合理规划结构`,
};

// Length-specific structure requirements
export const structureLengthRequirements = {
  short: `短篇结构要求：
1. 总体结构简洁，包含3-5个主要部分
2. 适合300-800字的文章长度`,

  medium: `中篇结构要求：
1. 总体结构适中，包含4-6个主要部分
2. 适合800-1500字的文章长度`,

  long: `长篇结构要求：
1. 总体结构详细，包含5-8个主要部分
2. 可以适当保留两层结构，最好不要有三层结构
3. 适合1500-3000字的文章长度`,
};

// Style-specific structure requirements
export const structureStyleRequirements = {
  formal: `正式风格结构要求：
1. 结构应包含明确的引言、主体和结论部分
2. 主体部分应有清晰的论点和支持论据
3. 各部分之间应有逻辑连贯性
4. 适合学术、商业或专业场景的结构安排`,

  casual: `轻松风格结构要求：
1. 结构可以更加灵活，不必严格遵循传统格式
2. 可以包含更多个人观点和经验分享的部分
3. 可以使用问答、列表等形式增加互动性
4. 适合博客、社交媒体等非正式场合`,

  persuasive: `说服性风格结构要求：
1. 结构应包含问题提出、论证和号召行动三个主要部分
2. 论证部分应包含多个支持论点和反驳可能的反对意见
3. 结构应有助于逐步构建说服力
4. 结论部分应包含明确的号召行动`,

  descriptive: `描述性风格结构要求：
1. 结构应有助于逐步展开场景、人物或事件的描述
2. 可以按时间顺序、空间顺序或重要性顺序组织内容
3. 应包含足够的细节描述部分
4. 适合旅游、产品介绍等需要生动描述的内容`,

  technical: `技术风格结构要求：
1. 结构应包含明确的概念介绍、技术细节和应用场景
2. 可以包含步骤说明、代码示例或技术规格等专业内容
3. 应有清晰的信息层次，便于读者快速定位所需信息
4. 适合教程、技术文档等专业内容`,

  storytelling: `故事性风格结构要求：
1. 结构应符合故事叙述的基本框架，包含开端、发展、高潮和结局
2. 可以包含人物介绍、场景设置、冲突和解决等元素
3. 结构应有助于维持读者兴趣和情感投入
4. 适合案例分析、品牌故事等需要叙事性的内容`,
};

// Function to combine prompts based on requirements
export const getStructurePrompt = ({
  time,
  topic,
  style,
  coreIdeas,
  wordCount,
  targetAudience,
  exampleArticle,
  detailLevel = "base",
  length = "medium",
}: {
  time: string;
  topic: string;
  style: string;
  coreIdeas: string;
  wordCount: string;
  targetAudience?: any;
  exampleArticle?: string;
  detailLevel?: "simple" | "base" | "detailed";
  length?: "short" | "medium" | "long";
}) => {
  const basePrompt = structureBasePrompt
    .replace("{topic}", topic)
    .replace("{style}", style)
    .replace("{coreIdeas}", coreIdeas)
    .replace("{wordCount}", wordCount)
    .replace("{time}", time)
    .replace("{targetAudience}", formatTargetAudience(targetAudience))
    .replace(
      "{exampleArticle}",
      exampleArticle ? `参考文章：${exampleArticle}` : ""
    );

  const detailReq = structureRequirements[detailLevel] || structureRequirements.base;
  const lengthReq = structureLengthRequirements[length];

  // 确定风格类型并获取相应的风格要求
  let styleType: keyof typeof structureStyleRequirements = "formal"; // 默认为正式风格
  if (style.includes("轻松") || style.includes("随意") || style.includes("casual")) {
    styleType = "casual";
  } else if (style.includes("说服") || style.includes("persuasive")) {
    styleType = "persuasive";
  } else if (style.includes("描述") || style.includes("descriptive")) {
    styleType = "descriptive";
  } else if (style.includes("技术") || style.includes("technical")) {
    styleType = "technical";
  } else if (style.includes("故事") || style.includes("storytelling")) {
    styleType = "storytelling";
  }

  const styleReq = structureStyleRequirements[styleType];

  return `${basePrompt}

${detailReq}

${lengthReq}

${styleReq}

风格与内容结合要求：
1. 确保文章结构与"${style}"风格相匹配
2. 根据"${wordCount}"的篇幅要求合理分配各部分内容
3. 考虑目标人群的特征，确保结构和内容符合其阅读偏好
4. 核心思路"${coreIdeas}"应贯穿整个结构设计
5. 涉及时间相关内容时，参考提供的时间信息"${time}"

直接返回 Markdown 格式的内容，不要使用代码块。`;
};
