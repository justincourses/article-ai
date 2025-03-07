# 文章生成测试工具

这个测试工具用于验证文章生成过程中的参数传递，特别是关于文章篇幅的处理。

## 测试内容

测试工具主要验证以下内容：

1. **文章长度处理**：
   - 验证默认长度设置是否正确传递
   - 验证字数（wordCount）是否正确覆盖长度（length）设置
   - 验证不同字数范围是否正确映射到对应的长度类别（mini, short, medium, long）

2. **要求提取**：
   - 验证直接提供的要求是否正确传递
   - 验证从消息内容中提取的要求是否正确

3. **提示词构建**：
   - 验证最终提示词是否包含正确的长度要求
   - 验证最终提示词是否包含正确的风格要求
   - 验证最终提示词是否包含用户的额外要求

## 测试方法

测试工具提供两种测试方式：

1. **手动测试**：
   - 用户可以手动配置测试参数
   - 查看生成的提示词和参数处理结果
   - 适合深入分析特定场景

2. **自动测试**：
   - 预设多个测试用例，覆盖各种边界情况
   - 自动运行所有测试用例并显示结果
   - 适合快速验证整体功能正确性

## 实现细节

### 文章长度处理逻辑

文章长度处理遵循以下规则：

```typescript
// 确定长度
let contentLength = length;
if (wordCount) {
  // 如果wordCount是"mini"，使用mini长度
  if (wordCount === "mini") {
    contentLength = "mini";
  } else {
    // 否则尝试解析为数字
    const count = parseInt(wordCount);
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
```

### 要求提取逻辑

从消息中提取要求的逻辑：

```typescript
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
```

## 测试结果

通过测试，我们确认：

1. 文章长度处理逻辑正确，wordCount参数能够正确覆盖length参数
2. 不同字数范围正确映射到对应的长度类别
3. 要求提取逻辑正确，能够从消息内容中提取要求
4. 最终提示词包含正确的长度要求和风格要求

## 建议

1. 考虑在服务器端添加更多的参数验证，确保参数类型正确
2. 考虑添加更多的单元测试，覆盖更多的边界情况
3. 考虑在客户端添加参数验证，避免发送无效的请求
