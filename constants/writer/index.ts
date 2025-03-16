// Writer component constants

// Tab values
export const TABS = {
  BASIC: 'basic',
  AUDIENCE: 'audience',
  ADVANCED: 'advanced',
} as const;

export const CONTENT_TABS = {
  OUTLINE: 'outline',
  ARTICLE: 'article',
  SUMMARY: 'summary',
} as const;

// Article types and their corresponding styles
export const ARTICLE_TYPES = [
  { value: 'social_media', label: '社交媒体' },
  { value: 'speech', label: '演讲稿' },
  { value: 'business', label: '政商公文' },
  { value: 'video_script', label: '视频脚本' },
] as const;

export const STYLE_OPTIONS_BY_TYPE = {
  social_media: [
    { value: 'formal', label: '正式学术' },
    { value: 'casual', label: '轻松随意' },
    { value: 'persuasive', label: '说服力强' },
    { value: 'descriptive', label: '描述细致' },
  ],
  speech: [
    { value: 'motivational', label: '激励演讲' },
    { value: 'ceremonial', label: '庆典致辞' },
    { value: 'informative', label: '信息传递' },
    { value: 'persuasive_speech', label: '说服演讲' },
  ],
  business: [
    { value: 'formal_report', label: '正式报告' },
    { value: 'proposal', label: '提案文书' },
    { value: 'announcement', label: '公告通知' },
    { value: 'memo', label: '备忘录' },
    { value: 'business_email', label: '商务邮件' },
    { value: 'red_headed_document', label: '红头文件' },
  ],
  video_script: [
    { value: 'educational', label: '教育视频' },
    { value: 'entertainment', label: '娱乐内容' },
    { value: 'promotional', label: '营销推广' },
    { value: 'documentary', label: '纪实风格' },
  ],
} as const;

// Legacy STYLE_OPTIONS for backward compatibility
export const STYLE_OPTIONS = STYLE_OPTIONS_BY_TYPE.social_media;

export const WORD_COUNT_OPTIONS = [
  { value: 'mini', label: '迷你 (300字以内)' },
  { value: 'short', label: '短文 (300-800字)' },
  { value: 'medium', label: '中等 (800-1500字)' },
  { value: 'long', label: '长文 (1500-3000字)', disabled: true },
];

export const MODEL_OPTIONS = [
  { value: 'chat-model-large', label: '通用大模型' },
  { value: 'chat-model-reasoning', label: '推理增强模型' },
];

export const GENDER_OPTIONS = [
  { value: 'all', label: '不限' },
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
];

export const AGE_RANGE_OPTIONS = [
  { value: 'all', label: '不限' },
  { value: '18-24', label: '18-24岁' },
  { value: '25-34', label: '25-34岁' },
  { value: '35-44', label: '35-44岁' },
  { value: '45-54', label: '45-54岁' },
  { value: '55+', label: '55岁以上' },
];

export const INCOME_LEVEL_OPTIONS = [
  { value: 'all', label: '不限' },
  { value: 'low', label: '低收入' },
  { value: 'medium', label: '中等收入' },
  { value: 'high', label: '高收入' },
];

// API endpoints
export const API_ENDPOINTS = {
  STRUCTURE: '/api/structure',
  ARTICLE: '/api/article',
  SUMMARY: '/api/summary',
  IMAGE: '/api/image',
  PICTURE: '/api/picture',
};

// Chat model IDs
export const CHAT_IDS = {
  OUTLINE_GENERATOR: 'outline-generator',
  ARTICLE_GENERATOR: 'article-generator',
  SUMMARY_GENERATOR: 'summary-generator',
};

// API configuration
export const API_CONFIG = {
  MAX_DURATION: 60, // Maximum duration for API routes in seconds
};
