# 写作者人设与审核者信息集成

本目录包含了将用户设置的写作者人设和审核者信息集成到提示词系统中的实现。

## 功能概述

1. **写作者人设集成**：
   - 如果用户在受众设置中选择了作者类型和写作风格，系统会将这些信息集成到提示词中
   - 这些设置会覆盖原来的默认撰稿人设置，使生成的内容更符合用户期望的写作风格和特点

2. **审核者信息集成**：
   - 如果用户设置了审核者信息，系统会在最终审核阶段将这些信息加入提示词
   - 这些设置会覆盖默认的审核者偏好信息，使生成的内容更符合特定审核者的要求

## 实现方式

### 写作者人设

写作者人设包含三个主要部分：

1. **作者类型**：基于作者的专业背景和出身，如媒体人、技术人、教授等
2. **写作风格**：如专业严谨、轻松随意、幽默风趣等
3. **个人特点**：用户自定义的作者特点描述

系统会根据这些设置生成相应的提示词，指导AI以特定的写作风格和视角创作内容。

### 审核者信息

审核者信息包含两个主要部分：

1. **审核者类型**：如媒体主编、出版社编辑、机关领导等
2. **审核要求**：用户自定义的审核要求描述

系统会根据这些设置生成相应的提示词，指导AI考虑特定审核者的偏好和要求。

## 文件结构

- `writer-persona.ts`: 定义了写作者人设和审核者信息的类型和提示词映射
- `index.ts`: 导出写作者人设和审核者信息的函数和类型

## 使用方法

在生成文章提示词时，系统会自动检查用户是否设置了写作者人设和审核者信息，并将其集成到提示词中：

```typescript
import { generateWriterPersonaPrompt, generateReviewerPrompt } from '@/constants/prompts/common/audience';

// 生成写作者人设提示词
const writerPersonaPrompt = generateWriterPersonaPrompt(config.writerPersona);

// 生成审核者信息提示词
const reviewerPrompt = generateReviewerPrompt(config.reviewerInfo);

// 将提示词集成到基础提示词中
const enhancedPrompt = basePrompt + writerPersonaPrompt + reviewerPrompt;
```

## 扩展方式

可以通过以下方式扩展功能：

1. 在 `writerPersonaTypePrompts` 中添加新的作者类型
2. 在 `writerPersonaStylePrompts` 中添加新的写作风格
3. 在 `reviewerTypePrompts` 中添加新的审核者类型
