export const agentModelCatalog = {
  free: [
    {
      id: 'glm-4-flash',
      providerName: '智谱',
      model: 'glm-4-flash',
      title: 'GLM-4-Flash',
      description: '默认免费档，适合日常聊天和轻量辅助。',
      requestUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'llama-3.1-8b-instant',
      providerName: 'Groq',
      model: 'llama-3.1-8b-instant',
      title: 'Llama 3.1 8B Instant',
      description: '回复速度快，适合低成本快速问答。',
      requestUrl: 'https://api.groq.com/openai/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'spark-lite',
      providerName: '讯飞星火',
      model: 'spark-lite',
      title: 'Spark Lite',
      description: '轻量通用模型，适合基础辅助场景。',
      requestUrl: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'qwen-turbo',
      providerName: '通义千问',
      model: 'qwen-turbo',
      title: 'Qwen Turbo',
      description: '综合平衡，适合常规问答和提示词整理。',
      requestUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'gemini-2.5-flash',
      providerName: 'Google Gemini',
      model: 'gemini-2.5-flash',
      title: 'Gemini 2.5 Flash',
      description: '轻快响应，适合通用文本辅助。',
      requestUrl: 'https://generativelanguage.googleapis.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    }
  ],
  paid: [
    {
      id: 'glm-4-0520',
      providerName: '智谱',
      model: 'glm-4-0520',
      title: 'GLM-4-0520',
      description: '更高质量输出，适合正式场景。',
      requestUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'qwen-max',
      providerName: '通义千问',
      model: 'qwen-max',
      title: 'Qwen Max',
      description: '更强推理与生成质量。',
      requestUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'spark-ultra',
      providerName: '讯飞星火',
      model: 'spark-ultra',
      title: 'Spark Ultra',
      description: '适合高质量中文理解与生成。',
      requestUrl: 'https://spark-api-open.xf-yun.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'doubao-3.5-pro',
      providerName: '豆包',
      model: 'doubao-3.5-pro',
      title: 'Doubao 3.5 Pro',
      description: '适合常规商业场景对话。',
      requestUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'claude-3-5-sonnet-20241022',
      providerName: 'Anthropic',
      model: 'claude-3-5-sonnet-20241022',
      title: 'Claude 3.5 Sonnet',
      description: '擅长结构化表达与复杂需求整理。',
      requestUrl: 'https://api.anthropic.com/v1/messages',
      method: 'POST',
      authType: 'x-api-key'
    },
    {
      id: 'mistral-large-2411',
      providerName: 'Mistral',
      model: 'mistral-large-2411',
      title: 'Mistral Large 2411',
      description: '适合多语言文本处理。',
      requestUrl: 'https://api.mistral.ai/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'deepseek-chat',
      providerName: 'DeepSeek',
      model: 'deepseek-chat',
      title: 'DeepSeek Chat',
      description: '适合中文问答与内容整理。',
      requestUrl: 'https://api.deepseek.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'Baichuan4-Turbo',
      providerName: '百川',
      model: 'Baichuan4-Turbo',
      title: 'Baichuan4 Turbo',
      description: '适合企业级中文助手场景。',
      requestUrl: 'https://api.baichuan-ai.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'yi-large',
      providerName: '零一万物',
      model: 'yi-large',
      title: 'Yi Large',
      description: '综合质量较强，适合通用助手。',
      requestUrl: 'https://api.01.ai/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'abab6.5-chat',
      providerName: 'MiniMax',
      model: 'abab6.5-chat',
      title: 'MiniMax abab6.5',
      description: '适合日常问答与创意整理。',
      requestUrl: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'SkyChat-V2',
      providerName: '天工',
      model: 'SkyChat-V2',
      title: 'SkyChat V2',
      description: '适合中文场景沟通与总结。',
      requestUrl: 'https://api.tiangong.cn/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'hunyuan-large',
      providerName: '腾讯混元',
      model: 'hunyuan-large',
      title: 'Hunyuan Large',
      description: '适合稳定的中文商业场景。',
      requestUrl: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'xverse-70b-chat',
      providerName: '元象',
      model: 'xverse-70b-chat',
      title: 'Xverse 70B Chat',
      description: '适合大体量对话任务。',
      requestUrl: 'https://api.xverse.cn/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'zhipu-pro',
      providerName: '智增增',
      model: 'zhipu-pro',
      title: 'Zhipu Pro',
      description: '适合高质量中文辅助。',
      requestUrl: 'https://api.zhizengyun.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    },
    {
      id: 'infini-chat',
      providerName: 'InfiniMind',
      model: 'infini-chat',
      title: 'Infini Chat',
      description: '适合通用聊天与文本整理。',
      requestUrl: 'https://api.infini-mind.com/v1/chat/completions',
      method: 'POST',
      authType: 'bearer'
    }
  ]
}

