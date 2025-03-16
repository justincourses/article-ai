/**
 * Common style requirements that can be reused across different content types
 */

// Basic style definitions
export const styleRequirements = {
  formal: "使用正式、专业的语言风格，适合学术或商业场景。",
  casual: "使用轻松、自然的语言风格，适合日常阅读。",
  creative: "使用生动、富有创意的语言风格，适合吸引读者注意力。",
  technical: "使用专业术语和精确表达，适合技术内容。",
  social: "使用活泼、互动性强的语言风格，适合社交媒体平台。",
  persuasive: "使用有说服力的语言风格，适合营销和倡导内容。",
  descriptive: "使用生动描述性的语言风格，适合场景和产品描述。",
  storytelling: "使用叙事性的语言风格，适合讲述故事和案例。",
  authentic: "用轻松随意的通俗化表达，引入真实个人轶事和经历详述而生活的内容。",
};

// Detailed style requirements
export const detailedStyleRequirements = {
  formal: `正式风格要求：
1. 使用正式、专业的语言风格，适合学术或商业场景
2. 避免使用口语化、俚语或过于随意的表达
3. 保持客观、理性的论述风格
4. 使用完整的句子和段落结构
5. 适当引用数据和研究支持观点`,

  casual: `轻松风格要求：
1. 使用轻松、自然的语言风格，适合日常阅读
2. 可以使用日常用语和简单表达
3. 语气友好亲切，像与读者对话
4. 可以使用一些口语化表达，但不过度
5. 保持内容易于理解和接近`,

  creative: `创意风格要求：
1. 使用生动、富有创意的语言风格，适合吸引读者注意力
2. 运用比喻、隐喻等修辞手法增强表现力
3. 使用新颖的表达方式和独特的视角
4. 可以适当打破常规，但保持内容可理解
5. 注重情感表达和感官描述`,

  technical: `技术风格要求：
1. 使用专业术语和精确表达，适合技术内容
2. 保持逻辑清晰，结构严谨
3. 使用准确的专业词汇和定义
4. 避免模糊或歧义表达
5. 适当解释复杂概念，确保专业性与可理解性平衡`,

  social: `社交风格要求：
1. 使用活泼、互动性强的语言风格，适合社交媒体平台
2. 语言简洁有力，适合快速阅读
3. 可以使用流行语和简短句式
4. 注重与读者建立联系和互动
5. 保持内容有趣、相关且易于分享`,

  persuasive: `说服风格要求：
1. 使用有说服力的语言风格，适合营销和倡导内容
2. 强调价值主张和核心利益
3. 使用有力的论据和证据支持观点
4. 注重情感诉求和逻辑论证的结合
5. 清晰传达行动号召和期望结果`,

  descriptive: `描述风格要求：
1. 使用生动描述性的语言风格，适合场景和产品描述
2. 注重细节和感官描写
3. 使用丰富的形容词和生动的动词
4. 创造身临其境的阅读体验
5. 平衡描述的丰富性和简洁性`,

  storytelling: `叙事风格要求：
1. 使用叙事性的语言风格，适合讲述故事和案例
2. 建立清晰的叙事结构（开端、发展、高潮、结局）
3. 塑造生动的角色和场景
4. 创造情感共鸣和代入感
5. 确保故事与主题和目的相关`,

  authentic: `真实风格要求：
1. 用轻松随意的通俗化表达，引入真实个人轶事和经历
2. 引入真实个人轶事和经历详述而生活的内容
3. 微妙的细节变化与情感流动
4. 在结构和叙述流畅方面表现出良好的平衡
5. 使用恰当与的的比喻和案例
6. 加入一些语气词，让语言更有节奏感
7. 模拟真人自然的对话和思考方式
8. 刻意加入一些小细节，比如偶尔用词笨拙，塑造真实感`,
};

// Common review requirement for natural writing
export const naturalWritingReview = `
请严格审查以下几点：
1. 文章是否存在过度修辞或堆砌辞藻的问题
2. 语言表达是否自然流畅，避免生硬或做作的表达
3. 是否使用了过多的形容词或华丽词藻
4. 内容是否简洁明了，直击要点
5. 是否避免了机械化或模板化的表达方式

确保文章写得自然流畅，就像一个真实的人在说话，而不是机器生成的内容。`;

// Final optimization prompt to avoid AI detection
export const antiAIDetectionOptimization = {
  // 基础降AI策略
  basic: `
请对文章进行最后一轮检查，以避免AI检测：

1. 看看文章有没有用太多华丽词藻，写得太过花哨
2. 读一遍看看是不是像真人说话那样自然，不要太生硬
3. 检查有没有堆砌太多形容词，读起来太做作
4. 内容要简单直接，说重点，不要绕来绕去
5. 避免那种一看就是模板生成的机械化表达，要有人味儿

Replace all transition words and conjunctions in the sentences with the most basic and commonly used ones. Use simple expressions, avoiding complex vocabulary. Ensure the logical connections between sentences are clear. Deletes the conclusion part in the end of the text.
`,

  // 综合降AI策略
  comprehensive: {
    // 策略二：润色句子
    polishSentences: {
      zh: `将以上文字重新修改，写作风格界于书面学术写作和口语描述之间。保证所有的句子都要有主语，不要用复杂的长难句，尽量用短句输出。替换掉所有的非日常词汇。`,
      en: `Rewrite the text with a writing style between formal academic writing and casual conversation. Ensure that all sentences have subjects, avoid using complex and long sentences, and try to use short sentences. Replace any uncommon or non-daily words with simpler alternatives.`
    },

    // 策略四：简化句子结构
    simplifySentenceStructure: {
      zh: `将长句拆分为几个简洁、明了的短句，每个句子聚焦于表达一个具体的意思，避免使用过于复杂的复合句或从句。保持句子的清晰度和易理解性，确保读者能迅速把握主要观点，避免冗长而不必要的表达。`,
      en: `Break long sentences into shorter, clearer ones. Each sentence should focus on expressing one specific idea. Avoid using overly complex compound or subordinate clauses. Keep sentences clear and easy to understand, so readers can quickly grasp the main points without unnecessary complexity.`
    },

    // 策略五：减少专业术语
    reduceTechnicalTerms: {
      zh: `避免使用过多专业术语或难懂的术语，尤其是那些普通读者不容易理解的词汇。尽量采用常见、通俗易懂的表达方式，确保文章内容能够让广泛的读者群体，包括非专业人士，轻松理解。`,
      en: `Avoid using too many technical terms or jargon, especially those that ordinary readers may not understand. Use common, easily comprehensible language to ensure the content is accessible to a broader audience, including non-specialists.`
    },

    // 策略六：提高文章可读性
    improveReadability: {
      zh: `通过使用简洁、易懂的语言，使文章的内容更容易被读者接受。避免使用难以理解的表达或复杂的术语，确保文章结构清晰、段落内容简洁，并确保每一段落围绕一个清晰的主题展开，增强文章的流畅性和可读性。`,
      en: `Use simple, easy-to-understand language to make the content more accessible to readers. Avoid difficult expressions or complex terms. Ensure the structure is clear, paragraphs are concise, and each section centers around one main topic, enhancing the overall flow and readability.`
    },

    // 策略七：提高段落清晰度
    improveParagraphClarity: {
      zh: `每一段落应集中讨论一个主题，避免在同一段落中加入多个互不相关的论点。确保每个段落逻辑清晰，并且上下段落之间有自然的过渡，使读者能够轻松地跟随作者的思路进行阅读。`,
      en: `Each paragraph should focus on one central idea, avoiding the introduction of multiple unrelated points. Ensure each paragraph is logically coherent and has natural transitions between paragraphs, allowing readers to follow the author's thought process easily.`
    },

    // 策略八：保持语言简洁
    keepLanguageConcise: {
      zh: `删减文章中不必要的修饰语和重复表达，避免使用冗长的形容词或副词，使语言更加简练和有力。确保每句话都能准确传达信息，避免使用过多装饰性语言或无实际意义的修辞。`,
      en: `Eliminate unnecessary modifiers and repetitive expressions in the text. Avoid long adjectives or adverbs. Ensure each sentence conveys its message concisely and avoid using excessive decorative language or meaningless rhetoric.`
    },

    // 策略九：避免过多被动语态
    avoidPassiveVoice: {
      zh: `尽量使用主动语态来增强句子的活力，使语言更直接、清晰。被动语态的使用应限于必要时，避免过度使用，因为被动语态可能让句子显得模糊或拖沓，从而降低文章的可读性。`,
      en: `Try to use active voice to make the sentences more dynamic, direct, and clear. Limit the use of passive voice to cases where it is absolutely necessary. Overuse of passive constructions can make sentences vague or cumbersome, thus reducing readability.`
    },

    // 策略十：避免使用过于复杂的短语
    avoidComplexPhrases: {
      zh: `避免使用结构复杂、意义模糊的短语或词组，尽量使用简洁、清晰的短语表达。尤其是在阐述复杂观点时，尽量采用简明的语言和表达方式，以便使文章内容易于理解并富有条理。`,
      en: `Avoid using overly complex or ambiguous phrases. Opt for simpler and clearer expressions, especially when discussing complex ideas. Use straightforward language and concise expressions to ensure the content is easy to understand and well-organized.`
    },

    // 策略十一：增强真实感
    enhanceAuthenticity: {
      zh: `增加一些个人化的表达和口头禅，确保有一些小的不完美，如偶尔的口语化表达。在适当位置加入一些细节描述，增加真实感。使用一些反问句或感叹句，增加互动性。偶尔使用一些不完整的句子结构，模拟口语表达。`,
      en: `Add some personalized expressions and verbal tics. Ensure there are small imperfections, such as occasional colloquial expressions. Add some detailed descriptions in appropriate places to increase authenticity. Use rhetorical questions or exclamations to increase interactivity. Occasionally use incomplete sentence structures to simulate spoken language.`
    }
  },

  // 组合策略 - 提供几种常用组合
  combinations: {
    // 基础人性化组合
    basic: `
请对文章进行以下优化，使其更像人类写作：

1. 将长句拆分为简短、清晰的句子，每句只表达一个观点
2. 使用简单、常见的过渡词和连接词
3. 确保每个句子都有明确的主语
4. 尽量使用主动语态而非被动语态
5. 删除文末的总结部分
6. 避免使用过多修饰词和华丽辞藻
7. 确保段落之间有自然的过渡
8. 使用日常用语，避免专业术语和生僻词汇
`,

    // 学术文章优化组合
    academic: `
请对学术文章进行以下优化，使其更像人类写作：

1. 保持专业性的同时，简化句子结构
2. 使用基础的学术过渡词，避免过于复杂的连接词
3. 确保每个段落只讨论一个主题
4. 适当使用主动语态，减少被动语态的比例
5. 用简单词汇解释复杂概念
6. 删除不必要的修饰语和重复表达
7. 确保论点清晰，避免模糊或过于复杂的表述
8. 保留必要的专业术语，但确保解释清楚
`,

    // 社交媒体内容优化组合
    social: `
请对社交媒体内容进行以下优化，使其更像人类写作：

1. 使用非常口语化、简短的句子
2. 加入一些口头禅和日常表达
3. 偶尔使用不完整的句子结构（如省略主语）
4. 使用简单、直接的词汇
5. 避免过于完美的段落结构
6. 适当加入一些网络用语
7. 保持内容轻松活泼，避免过于正式
8. 确保内容有互动性和亲和力
`,

    // 营销内容优化组合
    marketing: `
请对营销内容进行以下优化，使其更像人类写作：

1. 使用简短、有力的句子吸引注意力
2. 确保每个段落都有明确的价值主张
3. 使用日常用语而非营销术语
4. 减少过度使用的形容词和夸张表达
5. 加入一些个人化的表达和观点
6. 使用主动语态增强说服力
7. 确保行动号召自然而非强制
8. 避免过于完美的结构，适当加入一些转折
`,

    // 真实风格优化组合
    authentic: `
请对内容进行以下优化，使其更像真实人类写作：

1. 加入一些个人化的表达和口头禅
2. 确保有一些小的不完美，如偶尔的口语化表达
3. 使用简单、日常的词汇和表达方式
4. 在适当位置加入一些细节描述，增加真实感
5. 确保段落之间有自然的过渡
6. 避免过于完美的结构，适当加入一些转折
7. 使用一些反问句或感叹句，增加互动性
8. 偶尔使用一些不完整的句子结构，模拟口语表达
`
  }
};

// 完整的反AI检测流程
export const completeAntiAIDetectionProcess = `
请按照以下步骤对文章进行全面优化，使其更像人类写作：

第一步：内容结构优化
1. 删除文末的总结部分
2. 确保每个段落只讨论一个主题
3. 在段落之间创建自然的过渡
4. 避免过于完美的结构，适当加入一些不规则性

第二步：句子优化
1. 将长句拆分为简短、清晰的句子
2. 确保每个句子都有明确的主语
3. 尽量使用主动语态而非被动语态
4. 使用基础、常见的过渡词和连接词

第三步：词汇优化
1. 使用简单、日常的词汇替换复杂或生僻的词汇
2. 减少专业术语的使用，或提供简单解释
3. 删除不必要的修饰语和重复表达
4. 避免使用过多形容词和华丽辞藻

第四步：语气和风格优化
1. 确保语气自然，像真人对话
2. 适当加入一些个人化的表达和观点
3. 避免过于机械化或模板化的表达
4. 加入一些小细节，增加真实感和亲近感

最高优先级检查标准（必须严格执行）：
Replace all transition words and conjunctions in the sentences with the most basic and commonly used ones. Use simple expressions, avoiding complex vocabulary. Ensure the logical connections between sentences are clear. Deletes the conclusion part in the end of the text.
`;
