/**
 * Prompts for article structure generation
 */

// Base prompt for structure generation
export const structureBasePrompt = `根据以下要求生成一篇文章的思维导图结构：

主题：{topic}
风格：{style}
核心思路：{coreIdeas}
文章篇幅：{wordCount}
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
2. 每部分可包含1-2个子要点
3. 适合300-800字的文章长度`,

  medium: `中篇结构要求：
1. 总体结构适中，包含4-6个主要部分
2. 每部分可包含2-3个子要点
3. 适合800-1500字的文章长度`,

  long: `长篇结构要求：
1. 总体结构详细，包含5-8个主要部分
2. 每部分可包含3-5个子要点，可有更深层次的结构
3. 适合1500-3000字的文章长度`,
};

// Function to combine prompts based on requirements
export const getStructurePrompt = ({
  topic,
  style,
  coreIdeas,
  wordCount,
  targetAudience,
  exampleArticle,
  detailLevel = "base",
  length = "medium",
}: {
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
    .replace("{targetAudience}", formatTargetAudience(targetAudience))
    .replace(
      "{exampleArticle}",
      exampleArticle ? `参考文章：${exampleArticle}` : ""
    );

  const detailReq = structureRequirements[detailLevel] || structureRequirements.base;
  const lengthReq = structureLengthRequirements[length];

  return `${basePrompt}

${detailReq}

${lengthReq}

直接返回 Markdown 格式的内容，不要使用代码块。`;
};
