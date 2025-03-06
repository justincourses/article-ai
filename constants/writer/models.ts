// Writer model configurations

// Default models for each generation step
export const DEFAULT_MODELS = {
  OUTLINE: 'chat-model-large',
  ARTICLE: 'chat-model-reasoning',
  SUMMARY: 'chat-model-large',
};

// Default article configuration
export const DEFAULT_ARTICLE_CONFIG = {
  topic: '',
  style: '',
  coreIdeas: '',
  exampleArticle: '',
  model: DEFAULT_MODELS.ARTICLE, // This will be kept in the config but not shown in UI
  wordCount: '',
  targetAudience: {
    ageRange: '',
    gender: '',
    incomeLevel: '',
    interests: [],
    userTraits: ''
  }
};

// Default writer configuration
export const DEFAULT_WRITER_CONFIG = {
  fontSize: 16,
  fontFamily: 'Inter',
  theme: 'system' as 'light' | 'dark' | 'system',
  lineSpacing: 1.5,
  autoSave: true,
  spellCheck: true,
  wordCount: true,
  focusMode: false,
  customShortcuts: {}
};
