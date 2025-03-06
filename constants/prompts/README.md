# 提示词管理系统

本目录包含了应用中使用的各种提示词（Prompts）的集中管理系统。通过这种方式，我们可以更好地组织、维护和复用提示词，使代码更加清晰和可维护。

## 目录结构

```
constants/prompts/
├── common/           # 通用提示词组件
├── article/          # 文章生成相关提示词
├── structure/        # 文章结构生成相关提示词
├── summary/          # 文章摘要生成相关提示词
└── index.ts          # 主导出文件
```

## 使用方法

### 导入提示词

```typescript
// 导入所有提示词
import * as prompts from '@/constants/prompts';

// 导入特定类别的提示词
import { articlePrompts } from '@/constants/prompts';
import { structurePrompts } from '@/constants/prompts';
import { summaryPrompts } from '@/constants/prompts';

// 导入系统提示词
import { systemPrompt } from '@/constants/prompts';
```

### 生成文章提示词

```typescript
const prompt = articlePrompts.getArticlePrompt({
  topic: '人工智能在教育中的应用',
  style: '科技解析',
  coreIdeas: '探讨AI如何改变传统教育模式',
  outline: '# 引言\n## AI在教育中的现状\n# AI教育应用案例\n...',
  requirements: '重点关注中国市场',
  length: 'medium',  // 'short', 'medium', 'long'
  styleType: 'technical',  // 'formal', 'casual', 'creative', 'technical'
});
```

### 生成结构提示词

```typescript
const prompt = structurePrompts.getStructurePrompt({
  topic: '可持续发展与企业责任',
  style: '商业分析',
  coreIdeas: '探讨企业如何平衡利润与环保责任',
  wordCount: '1500',
  targetAudience: {
    ageRange: '25-45岁',
    gender: '不限',
    incomeLevel: '中高收入',
    interests: ['商业', '环保', '社会责任'],
    userTraits: '关注可持续发展的商业人士'
  },
  detailLevel: 'detailed',  // 'simple', 'base', 'detailed'
  length: 'medium',  // 'short', 'medium', 'long'
});
```

### 生成摘要提示词

```typescript
const prompt = summaryPrompts.getSummaryPrompt({
  article: '完整的文章内容...',
  format: 'detailed',  // 'simple', 'base', 'detailed'
  style: 'social',  // 'social', 'formal', 'casual'
  includeImagePrompt: true,
  length: 'medium',  // 'short', 'medium', 'long'
});
```

## 提示词组件

### 通用组件

- `formatRequirements`: 不同输出格式的要求
- `styleRequirements`: 不同内容风格的要求
- `lengthRequirements`: 不同内容长度的要求
- `audienceRequirements`: 不同目标受众的要求
- `systemPromptBase`: 可扩展的系统提示词基础

### 文章生成组件

- `articleBasePrompt`: 文章生成的基础提示词
- `articleRequirements`: 不同风格的文章要求
- `articleLengthRequirements`: 不同长度的文章要求

### 结构生成组件

- `structureBasePrompt`: 结构生成的基础提示词
- `formatTargetAudience`: 格式化目标受众信息
- `structureRequirements`: 不同详细程度的结构要求
- `structureLengthRequirements`: 不同长度的结构要求
- `structureStyleRequirements`: 不同风格的结构要求（包括正式、轻松、说服性、描述性、技术和故事性风格）

### 摘要生成组件

- `summaryBasePrompt`: 摘要生成的基础提示词
- `summaryFormatRequirements`: 不同格式的摘要要求
- `summaryStyleRequirements`: 不同风格的摘要要求
- `summaryImagePromptRequirements`: 不同长度文章的图像提示词要求

## 自定义和扩展

可以通过修改各个组件文件来自定义和扩展提示词。例如，添加新的风格、格式或长度要求，或者调整现有提示词的内容。

## 风格与结构的关系

在生成文章结构时，系统会根据指定的风格自动选择合适的结构要求。目前支持以下风格类型：

- `formal`: 正式风格，适合学术、商业或专业场景
- `casual`: 轻松风格，适合博客、社交媒体等非正式场合
- `persuasive`: 说服性风格，适合营销、倡导等需要说服读者的内容
- `descriptive`: 描述性风格，适合旅游、产品介绍等需要生动描述的内容
- `technical`: 技术风格，适合教程、技术文档等专业内容
- `storytelling`: 故事性风格，适合案例分析、品牌故事等需要叙事性的内容

系统会根据用户输入的风格描述自动匹配最合适的风格类型，并应用相应的结构要求。
