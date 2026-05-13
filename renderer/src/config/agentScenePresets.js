export const agentScenePresets = [
  {
    id: 'single-design-main',
    title: '电商主图',
    description: '适合商品主视觉展示，强调主体清晰、质感突出。',
    promptText: '请帮我生成一张适合电商展示的商品主图，突出主体完整展示、画面干净高级、光影清晰、质感真实，整体适合首页点击和转化。',
    menus: ['single-design'],
    category: '单图设计',
    isFeatured: true,
    sortOrder: 10
  },
  {
    id: 'single-design-white-bg',
    title: '白底图',
    description: '适合平台白底规范场景，背景纯净，主体完整。',
    promptText: '请帮我生成一张标准电商白底图，背景纯白干净，主体完整清晰，边缘利落，适合平台商品卡片展示，不要复杂道具和额外装饰。',
    menus: ['single-design'],
    category: '单图设计',
    isFeatured: true,
    sortOrder: 20
  },
  {
    id: 'single-design-model',
    title: '模特图',
    description: '适合服饰或穿戴商品的人物展示场景。',
    promptText: '请帮我生成一张适合电商展示的模特图，重点突出服饰或穿戴商品本身，人物姿态自然，构图干净，画面具有高级感和购买吸引力。',
    menus: ['single-design'],
    category: '单图设计',
    isFeatured: true,
    sortOrder: 30
  },
  {
    id: 'single-design-closeup',
    title: '细节特写图',
    description: '适合放大展示材质、纹理、做工与细节。',
    promptText: '请帮我生成一张商品细节特写图，重点展示材质、纹理、做工和局部结构，画面清楚干净，适合电商详情页放大说明。',
    menus: ['single-design'],
    category: '单图设计',
    isFeatured: false,
    sortOrder: 40
  },
  {
    id: 'single-design-scene',
    title: '场景氛围图',
    description: '适合用生活化场景提升商品氛围与代入感。',
    promptText: '请帮我生成一张商品场景氛围图，通过合适的生活化场景突出产品调性和使用氛围，保持主体明确，整体适合电商展示和种草传播。',
    menus: ['single-design'],
    category: '单图设计',
    isFeatured: false,
    sortOrder: 50
  },
  {
    id: 'series-generate-detail',
    title: '详情页套组',
    description: '适合围绕主图延展完整详情页内容。',
    promptText: '请帮我规划一组适合电商详情页的图片，围绕同一商品统一风格输出，包括主卖点、使用场景、细节展示和信息节奏，整体适合详情页连续浏览。',
    menus: ['series-generate'],
    category: '套图生成',
    isFeatured: true,
    sortOrder: 10
  },
  {
    id: 'series-generate-selling-points',
    title: '卖点说明套组',
    description: '适合按卖点拆解成多张说明图。',
    promptText: '请帮我生成一组卖点说明图，按商品核心卖点逐张拆解展示，突出功能价值、差异点和用户感知利益，整体风格统一，适合电商详情页说明。',
    menus: ['series-generate'],
    category: '套图生成',
    isFeatured: true,
    sortOrder: 20
  },
  {
    id: 'series-generate-size',
    title: '尺寸说明套组',
    description: '适合围绕尺寸、规格和结构做完整说明。',
    promptText: '请帮我生成一组尺寸说明图，重点展示商品尺寸、规格和结构信息，信息清晰直观，画面整洁，适合用户快速理解商品参数。',
    menus: ['series-generate'],
    category: '套图生成',
    isFeatured: false,
    sortOrder: 30
  },
  {
    id: 'series-generate-material',
    title: '材质细节套组',
    description: '适合连续展示材质与工艺细节。',
    promptText: '请帮我生成一组材质细节说明图，围绕商品材质、纹理、工艺和局部做工做连续展示，整体风格统一，适合电商详情页增强信任感。',
    menus: ['series-generate'],
    category: '套图生成',
    isFeatured: false,
    sortOrder: 40
  },
  {
    id: 'series-design-restyle',
    title: '多图统一风格重设计',
    description: '适合一整套图片的统一重做。',
    promptText: '请帮我把这一整套商品图统一重设计，保持信息完整的前提下，让整体风格更统一、更干净、更适合电商展示，并强化商品调性和卖点表达。',
    menus: ['series-design'],
    category: '套图设计',
    isFeatured: true,
    sortOrder: 10
  },
  {
    id: 'series-design-full-page',
    title: '主图详情图整套重做',
    description: '适合从主图到详情图整套升级。',
    promptText: '请帮我重做一整套商品图，包括主图与详情图，让整套画面统一、节奏清晰、卖点突出，更适合电商首页和详情页完整展示。',
    menus: ['series-design'],
    category: '套图设计',
    isFeatured: true,
    sortOrder: 20
  },
  {
    id: 'series-design-storyboard',
    title: '卖点分镜拆解图',
    description: '适合按卖点逻辑拆成多张分镜图。',
    promptText: '请帮我把商品卖点拆成一组有节奏的分镜说明图，每张图各自承担清晰的信息任务，整体风格统一，适合电商详情页连续阅读。',
    menus: ['series-design'],
    category: '套图设计',
    isFeatured: false,
    sortOrder: 30
  }
]

function normalizePreset(preset = {}) {
  return {
    id: String(preset.id || '').trim(),
    title: String(preset.title || '').trim(),
    description: String(preset.description || '').trim(),
    promptText: String(preset.promptText || '').trim(),
    menus: Array.isArray(preset.menus) ? preset.menus.filter((item) => typeof item === 'string' && item.trim()) : [],
    category: String(preset.category || '').trim(),
    isFeatured: preset.isFeatured === true,
    sortOrder: Number.isFinite(Number(preset.sortOrder)) ? Number(preset.sortOrder) : 9999
  }
}

export function getAgentScenePresetsByMenu(menuKey = '') {
  const normalizedMenuKey = String(menuKey || '').trim()

  return agentScenePresets
    .map((preset) => normalizePreset(preset))
    .filter((preset) => preset.id && preset.title && preset.promptText)
    .filter((preset) => preset.menus.includes(normalizedMenuKey))
    .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title, 'zh-CN'))
}
