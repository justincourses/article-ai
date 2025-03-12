/**
 * Common length requirements that can be reused across different content types
 */

// Basic length definitions
export const lengthRequirements = {
  mini: {
    description: "迷你内容",
    wordCount: "300字以内",
    structure: "简洁的结构，包含简短的引言、1-2个要点和简短总结。",
  },
  short: {
    description: "短篇内容",
    wordCount: "300-800字",
    structure: "简洁的结构，包含简短的引言、2-3个要点和简短总结。",
  },
  medium: {
    description: "中篇内容",
    wordCount: "800-1500字",
    structure: "包含引言、3-5个主要部分和总结，每部分可有小标题。",
  },
  long: {
    description: "长篇内容",
    wordCount: "1500-3000字",
    structure: "详细的结构，包含引言、5-7个主要部分（可有子部分）和深入的总结。",
  },
};

// Detailed length requirements
export const detailedLengthRequirements = {
  mini: `迷你内容要求：
1. 总字数控制在300字以内
2. 内容要极度精简，直击核心
3. 只保留最关键的观点和信息`,

  short: `短篇内容要求：
1. 总字数控制在300-800字之间
2. 各部分内容要简洁明了
3. 重点突出核心观点，避免冗余内容`,

  medium: `中篇内容要求：
1. 总字数控制在800-1500字之间
2. 各部分内容要详略得当
3. 可以适当展开重要观点，但避免过度冗长`,

  long: `长篇内容要求：
1. 总字数控制在1500-3000字之间
2. 各部分内容可以深入展开
3. 重要观点可以配合案例、数据或故事进行详细阐述
4. 注意内容的连贯性和逻辑性`,
};

// Helper function to determine content length based on wordCount
export const determineContentLength = (wordCount: string | number | undefined): "mini" | "short" | "medium" | "long" => {
  if (!wordCount) return "medium";

  // If wordCount is "mini", use mini length
  if (wordCount === "mini") {
    return "mini";
  }

  // Otherwise try to parse as number
  const count = typeof wordCount === 'number' ? wordCount : parseInt(wordCount);

  if (isNaN(count)) return "medium";

  if (count <= 300) {
    return "mini";
  } else if (count <= 800) {
    return "short";
  } else if (count <= 1500) {
    return "medium";
  } else {
    return "long";
  }
};

// Article type-specific style adjustments based on content length
export const articleTypeStyleAdjustments = {
  // 政商类文章的风格调整
  business: {
    mini: `政商类迷你内容风格调整：
1. 使用正式、专业的语言，避免过于口语化的表达
2. 不使用emoji表情，保持专业性
3. 使用简洁但正式的段落结构
4. 避免使用生活化的口语表达
5. 保持客观、理性的论述风格`,

    short: `政商类短篇内容风格调整：
1. 使用正式、专业的语言，避免过于口语化的表达
2. 不使用emoji表情，保持专业性
3. 使用规范的段落结构
4. 避免使用生活化的口语表达
5. 保持客观、理性的论述风格`,

    medium: `政商类中篇内容风格调整：
1. 使用正式、专业的语言，避免过于口语化的表达
2. 不使用emoji表情，保持专业性
3. 使用规范的段落结构和标题层级
4. 避免使用生活化的口语表达
5. 保持客观、理性的论述风格
6. 可适当引用数据和研究支持观点`,

    long: `政商类长篇内容风格调整：
1. 使用正式、专业的语言，避免过于口语化的表达
2. 不使用emoji表情，保持专业性
3. 使用规范的段落结构和标题层级
4. 避免使用生活化的口语表达
5. 保持客观、理性的论述风格
6. 引用数据和研究支持观点
7. 使用专业术语和规范的表达方式`
  },

  // 社交媒体类文章的风格调整
  social_media: {
    mini: `社交媒体迷你内容风格调整：
1. 使用轻松、活泼的语言
2. 适当使用emoji表情增加亲和力
3. 段落简短，像社交媒体发帖或聊天的风格
4. 可以使用生活化的口语表达
5. 保持亲切友好的语气`,

    short: `社交媒体短篇内容风格调整：
1. 使用轻松、活泼的语言
2. 适当使用emoji表情增加亲和力
3. 段落简短，保持轻松的阅读节奏
4. 可以使用生活化的口语表达
5. 保持亲切友好的语气`,

    medium: `社交媒体中篇内容风格调整：
1. 使用轻松、活泼的语言
2. 适当使用emoji表情增加亲和力
3. 段落长度适中，保持轻松的阅读节奏
4. 可以使用生活化的口语表达
5. 保持亲切友好的语气
6. 可以使用一些生活化比喻`,

    long: `社交媒体长篇内容风格调整：
1. 使用轻松、活泼的语言
2. 适当使用emoji表情增加亲和力
3. 段落长度适中，保持轻松的阅读节奏
4. 可以使用生活化的口语表达
5. 保持亲切友好的语气
6. 可以使用一些生活化比喻
7. 注意保持内容的连贯性和逻辑性`
  },

  // 演讲类文章的风格调整
  speech: {
    mini: `演讲类迷你内容风格调整：
1. 使用简洁有力的语言
2. 不使用emoji表情
3. 使用简短但有力的段落
4. 可以使用一些修辞手法增强表现力
5. 语言要有感染力和号召力`,

    short: `演讲类短篇内容风格调整：
1. 使用简洁有力的语言
2. 不使用emoji表情
3. 使用简短但有力的段落
4. 可以使用一些修辞手法增强表现力
5. 语言要有感染力和号召力
6. 注重语言的节奏感`,

    medium: `演讲类中篇内容风格调整：
1. 使用简洁有力的语言
2. 不使用emoji表情
3. 使用有节奏感的段落结构
4. 可以使用一些修辞手法增强表现力
5. 语言要有感染力和号召力
6. 注重语言的节奏感
7. 可以使用一些反问、排比等修辞手法`,

    long: `演讲类长篇内容风格调整：
1. 使用简洁有力的语言
2. 不使用emoji表情
3. 使用有节奏感的段落结构
4. 可以使用一些修辞手法增强表现力
5. 语言要有感染力和号召力
6. 注重语言的节奏感
7. 可以使用一些反问、排比等修辞手法
8. 注意演讲的整体结构和逻辑性`
  },

  // 视频脚本类文章的风格调整
  video_script: {
    mini: `视频脚本迷你内容风格调整：
1. 使用简洁、直接的语言
2. 不使用emoji表情
3. 使用简短的段落和句子
4. 可以使用一些口语化表达，但要符合视频脚本的特点
5. 注重语言的节奏感和画面感`,

    short: `视频脚本短篇内容风格调整：
1. 使用简洁、直接的语言
2. 不使用emoji表情
3. 使用简短的段落和句子
4. 可以使用一些口语化表达，但要符合视频脚本的特点
5. 注重语言的节奏感和画面感
6. 可以加入一些场景描述`,

    medium: `视频脚本中篇内容风格调整：
1. 使用简洁、直接的语言
2. 不使用emoji表情
3. 使用简短的段落和句子
4. 可以使用一些口语化表达，但要符合视频脚本的特点
5. 注重语言的节奏感和画面感
6. 加入场景描述和转场说明
7. 注意脚本的整体结构和节奏`,

    long: `视频脚本长篇内容风格调整：
1. 使用简洁、直接的语言
2. 不使用emoji表情
3. 使用简短的段落和句子
4. 可以使用一些口语化表达，但要符合视频脚本的特点
5. 注重语言的节奏感和画面感
6. 加入详细的场景描述和转场说明
7. 注意脚本的整体结构和节奏
8. 可以加入更多的视觉和音效指示`
  }
};

// Helper function to get style adjustments based on article type and content length
export const getStyleAdjustmentsByTypeAndLength = (
  articleType: string,
  contentLength: "mini" | "short" | "medium" | "long"
): string => {
  // Default to business type if not found
  const typeAdjustments = articleTypeStyleAdjustments[articleType as keyof typeof articleTypeStyleAdjustments]
    || articleTypeStyleAdjustments.business;

  // Get the appropriate length adjustment
  return typeAdjustments[contentLength];
};
