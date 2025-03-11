/**
 * Common format requirements that can be reused across different content types
 */

// Basic format requirements
export const formatRequirements = {
  markdown: "使用 Markdown 格式，直接返回内容，不要使用代码块。",
  json: "返回 JSON 格式的数据，确保格式正确且可解析。",
  html: "使用 HTML 格式，确保标签正确闭合且结构合理。",
  plaintext: "使用纯文本格式，不包含任何标记语言。",
};

// Detailed format requirements
export const detailedFormatRequirements = {
  markdown: `Markdown 格式要求：
1. 使用 Markdown 语法格式化内容
2. 使用 # 表示一级标题，## 表示二级标题，依此类推
3. 使用 * 或 - 创建无序列表，使用数字创建有序列表
4. 使用 **文本** 表示加粗，*文本* 表示斜体
5. 使用 [链接文本](URL) 创建超链接
6. 使用 > 创建引用块
7. 直接返回内容，不要使用代码块包裹`,

  json: `JSON 格式要求：
1. 返回有效的 JSON 格式数据
2. 确保所有键名使用双引号包裹
3. 确保所有字符串值使用双引号包裹
4. 确保数组和对象结构正确
5. 避免使用注释
6. 确保格式正确且可解析`,

  html: `HTML 格式要求：
1. 使用有效的 HTML 标签结构
2. 确保所有标签正确闭合
3. 使用适当的语义化标签（如 <header>, <article>, <section> 等）
4. 使用 <h1> 到 <h6> 表示标题层级
5. 使用 <p> 标签包裹段落
6. 使用 <ul> 和 <li> 创建无序列表，<ol> 和 <li> 创建有序列表
7. 使用 <a href="URL"> 创建超链接
8. 确保结构合理且易于阅读`,

  plaintext: `纯文本格式要求：
1. 不使用任何标记语言或格式化语法
2. 使用空行分隔段落
3. 使用缩进或空格表示层级结构
4. 使用符号（如 *, -, 数字等）手动创建列表
5. 确保内容易于阅读和理解，即使没有格式化`,
};
