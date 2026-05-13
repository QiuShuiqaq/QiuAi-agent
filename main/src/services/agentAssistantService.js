const DEFAULT_MENU_KEY = 'single-design'
const DEFAULT_GENERATE_COUNT = 1
const MAX_TASK_NAME_LENGTH = 24
const READ_ONLY_MENU_SET = new Set(['workspace', 'model-pricing', 'prompt-library', 'agent-settings'])
const IMAGE_REQUIRED_MENU_SET = new Set(['single-image', 'single-design', 'series-design', 'series-generate'])

function normalizeText(value = '') {
  return String(value || '').trim()
}

function normalizeOptionList(items = []) {
  return Array.isArray(items) ? items.filter(Boolean) : []
}

function buildSearchCorpus(...parts) {
  return parts
    .map((part) => normalizeText(part).toLowerCase())
    .filter(Boolean)
    .join(' ')
}

function sanitizeSuggestionText(value = '', fallbackValue = '') {
  const normalizedValue = normalizeText(value)
  if (!normalizedValue) {
    return fallbackValue
  }

  return normalizedValue
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/[A-Za-z]:\\[^\s]*/g, '')
    .replace(/\/[A-Za-z0-9._/-]+/g, '')
    .replace(/\b(?:ipc|apiBaseUrl|api[-_ ]?key|channel|preload|electron|authorization|bearer)\b/gi, '')
    .replace(/\bsk-[a-z0-9-]+\b/gi, '')
    .trim()
}

function sanitizeSummary(value = '') {
  return sanitizeSuggestionText(value).slice(0, 160)
}

function buildTaskName(userGoal, currentDraftSummary = {}) {
  const sourceText = sanitizeSuggestionText(userGoal) || normalizeText(currentDraftSummary.taskName) || '智能生成任务'
  return sourceText.slice(0, MAX_TASK_NAME_LENGTH) || '智能生成任务'
}

function matchMenu(activeMenu, availableMenus = []) {
  const menus = normalizeOptionList(availableMenus)
  const matchedMenu = menus.find((item) => item?.key === activeMenu)
  return matchedMenu?.key || menus[0]?.key || activeMenu || DEFAULT_MENU_KEY
}

function matchModel(userGoal, availableModels = [], currentDraftSummary = {}) {
  const models = normalizeOptionList(availableModels)
  const requestedText = buildSearchCorpus(userGoal)
  const currentModel = normalizeText(currentDraftSummary.model)

  const directMatch = models.find((item) => {
    const value = normalizeText(item?.value).toLowerCase()
    const label = normalizeText(item?.label).toLowerCase()
    return (value && requestedText.includes(value)) || (label && requestedText.includes(label))
  })

  if (directMatch) {
    return {
      value: directMatch.value || '',
      matched: true
    }
  }

  const currentMatch = models.find((item) => item?.value === currentModel)
  if (currentMatch) {
    return {
      value: currentMatch.value || '',
      matched: true
    }
  }

  return {
    value: models[0]?.value || '',
    matched: requestedText.length === 0
  }
}

function matchRatio(userGoal, availableRatios = []) {
  const ratios = normalizeOptionList(availableRatios)
  const requestedText = buildSearchCorpus(userGoal)

  const directMatch = ratios.find((item) => {
    const value = normalizeText(item?.value).toLowerCase()
    const label = normalizeText(item?.label).toLowerCase()
    return (value && requestedText.includes(value)) || (label && requestedText.includes(label))
  })

  if (directMatch) {
    return {
      value: directMatch.value || '',
      matched: true
    }
  }

  return {
    value: ratios[0]?.value || '',
    matched: requestedText.length === 0
  }
}

function scoreTemplateMatch(template = {}, searchCorpus = '') {
  const name = normalizeText(template?.name).toLowerCase()
  const summary = normalizeText(template?.summary).toLowerCase()
  const prompt = normalizeText(template?.prompt).toLowerCase()
  let score = 0

  if (!searchCorpus) {
    return score
  }

  if (name && searchCorpus.includes(name)) {
    score += 6
  }

  const tokens = [...new Set(`${name} ${summary} ${prompt}`.split(/[\s,，、/()（）\-_:：]+/).filter((token) => token.length >= 2))]
  for (const token of tokens) {
    if (searchCorpus.includes(token)) {
      score += 1
    }
  }

  return score
}

function matchTemplate(userGoal, templates = [], fallbackId = '') {
  const normalizedTemplates = normalizeOptionList(templates)
  const searchCorpus = buildSearchCorpus(userGoal)
  let bestTemplate = null
  let bestScore = 0

  for (const template of normalizedTemplates) {
    const score = scoreTemplateMatch(template, searchCorpus)
    if (score > bestScore) {
      bestScore = score
      bestTemplate = template
    }
  }

  if (bestTemplate) {
    return {
      id: bestTemplate.id || fallbackId,
      matched: true
    }
  }

  return {
    id: fallbackId || normalizedTemplates[0]?.id || '',
    matched: searchCorpus.length === 0
  }
}

function resolveGenerateCount(userGoal, activeMenu) {
  const normalizedGoal = normalizeText(userGoal)
  const matchedNumber = normalizedGoal.match(/(\d{1,3})\s*(张|组|个)/)
  if (!matchedNumber) {
    return DEFAULT_GENERATE_COUNT
  }

  const parsedCount = Math.max(1, Number(matchedNumber[1]) || DEFAULT_GENERATE_COUNT)
  if (activeMenu === 'series-design' || activeMenu === 'series-generate') {
    return Math.min(500, parsedCount)
  }

  return DEFAULT_GENERATE_COUNT
}

function buildExclusivePrompt(userGoal, positiveTemplates = [], positiveTemplateId = '') {
  const normalizedGoal = sanitizeSuggestionText(userGoal)
  const matchedTemplate = normalizeOptionList(positiveTemplates).find((item) => item.id === positiveTemplateId)
  const templateSummary = sanitizeSummary(matchedTemplate?.summary || matchedTemplate?.prompt || '')
  const parts = [normalizedGoal, templateSummary].filter(Boolean)
  return parts.join('，').slice(0, 220)
}

function buildGlobalStylePrompt(userGoal, imageTypes = [], imageTypeTemplateId = '') {
  const normalizedGoal = sanitizeSuggestionText(userGoal)
  const matchedTemplate = normalizeOptionList(imageTypes).find((item) => item.id === imageTypeTemplateId)
  const templateName = sanitizeSummary(matchedTemplate?.name || '')
  const styleParts = []

  if (templateName && templateName !== '无类型图片') {
    styleParts.push(`画面类型贴近${templateName}`)
  }

  if (normalizedGoal) {
    styleParts.push(normalizedGoal)
  }

  styleParts.push('整体风格保持干净、清晰、适合电商展示')
  return styleParts.join('，').slice(0, 220)
}

function buildUnmatchedField(field, requested, fallbackValue, reason) {
  return {
    field,
    requested: sanitizeSummary(requested),
    fallbackValue: sanitizeSummary(fallbackValue),
    reason: sanitizeSummary(reason)
  }
}

function buildConfidenceNotes({ menuKey, modelMatched, ratioMatched, imageTypeMatched, positiveMatched, negativeMatched }) {
  const notes = [
    `当前建议已限定在 ${menuKey} 菜单允许范围内`,
    'AI智能体只会辅助填写当前页面参数，不会自动提交任务'
  ]

  if (modelMatched && ratioMatched) {
    notes.push('模型和比例已命中现有可选项')
  } else {
    notes.push('部分字段未命中，已回退到当前可用选项')
  }

  if (imageTypeMatched || positiveMatched || negativeMatched) {
    notes.push('提示词建议参考当前提示词库，不暴露内部模板结构')
  }

  return notes
}

function buildReason(unmatchedFields = []) {
  if (!unmatchedFields.length) {
    return '已根据当前菜单、现有模型、比例和模板整理出一套可直接填写的参数建议'
  }

  return `已整理出一套最接近需求的参数建议，以下字段未命中现有选项：${unmatchedFields.map((item) => item.field).join('、')}`
}

function sanitizeReply(value = '') {
  return sanitizeSuggestionText(value).replace(/\s+/g, ' ').trim()
}

function buildReadOnlyReply(menuKey, message) {
  const safeMessage = sanitizeSummary(message)

  if (menuKey === 'workspace') {
    return `工作台主要展示统计卡片、积分仪表盘、本地任务积分记录、网络监控和主机信息。你现在问的是：${safeMessage || '工作台说明'}。`
  }

  if (menuKey === 'model-pricing') {
    return '模型价格页主要展示模型积分消耗和充值档位，适合查看成本对比，不支持参数填写。'
  }

  if (menuKey === 'prompt-library') {
    return '提示词库页主要用于查看和维护正向提示词、负向提示词以及写法参考，AI智能体只会引用这些内容给出建议。'
  }

  return '当前页面主要用于配置或查看信息，AI智能体可以回答使用问题，但不会改动这里的设置。'
}

function buildConfirmCard(menuKey, draftSuggestion) {
  return {
    title: '确认填写当前参数',
    summary: sanitizeSummary(`将把建议填写到 ${menuKey} 页面，提交动作仍由你手动完成。`),
    confirmLabel: '确认填写',
    riskNotes: [
      '仅填写当前已打开页面的参数',
      '不会自动提交任务',
      draftSuggestion?.unmatchedFields?.length
        ? '有部分字段未命中，已按现有可选项回退'
        : '建议字段均在当前页面可选范围内'
    ]
  }
}

function createPendingQuestion(key, label, placeholder) {
  return {
    key,
    label,
    placeholder,
    required: true
  }
}

function createAgentAssistantService() {
  async function generateSuggestion({
    userGoal = '',
    activeMenu = DEFAULT_MENU_KEY,
    availableMenus = [],
    availableModels = [],
    availableRatios = [],
    availableImageTypes = [],
    availablePositiveTemplates = [],
    availableNegativeTemplates = [],
    currentDraftSummary = {}
  } = {}) {
    const normalizedGoal = normalizeText(userGoal)
    const menuKey = matchMenu(activeMenu, availableMenus)
    const modelMatch = matchModel(normalizedGoal, availableModels, currentDraftSummary)
    const ratioMatch = matchRatio(normalizedGoal, availableRatios)
    const imageTypeMatch = matchTemplate(normalizedGoal, availableImageTypes, availableImageTypes[0]?.id || '')
    const positiveTemplateMatch = matchTemplate(normalizedGoal, availablePositiveTemplates, availablePositiveTemplates[0]?.id || '')
    const negativeTemplateMatch = matchTemplate(normalizedGoal, availableNegativeTemplates, availableNegativeTemplates[0]?.id || '')
    const unmatchedFields = []

    if (!modelMatch.matched && normalizedGoal) {
      unmatchedFields.push(buildUnmatchedField(
        'model',
        normalizedGoal,
        modelMatch.value,
        '当前需求中提到的模型不在现有模型列表内，已回退到当前可用模型'
      ))
    }

    if (!ratioMatch.matched && normalizedGoal) {
      unmatchedFields.push(buildUnmatchedField(
        'ratio',
        normalizedGoal,
        ratioMatch.value,
        '当前需求中提到的比例不在现有比例列表内，已回退到默认比例'
      ))
    }

    const suggestion = {
      taskName: buildTaskName(normalizedGoal, currentDraftSummary),
      menuKey,
      model: modelMatch.value || '',
      ratio: ratioMatch.value || '',
      imageTypeTemplateId: imageTypeMatch.id || '',
      positiveTemplateId: positiveTemplateMatch.id || '',
      negativeTemplateId: negativeTemplateMatch.id || '',
      exclusivePrompt: buildExclusivePrompt(normalizedGoal, availablePositiveTemplates, positiveTemplateMatch.id || ''),
      globalStylePrompt: buildGlobalStylePrompt(normalizedGoal, availableImageTypes, imageTypeMatch.id || ''),
      generateCount: resolveGenerateCount(normalizedGoal, menuKey),
      reason: buildReason(unmatchedFields),
      confidenceNotes: buildConfidenceNotes({
        menuKey,
        modelMatched: modelMatch.matched,
        ratioMatched: ratioMatch.matched,
        imageTypeMatched: imageTypeMatch.matched,
        positiveMatched: positiveTemplateMatch.matched,
        negativeMatched: negativeTemplateMatch.matched
      }),
      unmatchedFields
    }

    return JSON.parse(JSON.stringify(suggestion))
  }

  async function askAgentAssistant({
    message = '',
    menuKey = DEFAULT_MENU_KEY,
    availableMenus = [],
    availableModels = [],
    availableRatios = [],
    availableImageTypes = [],
    availablePositiveTemplates = [],
    availableNegativeTemplates = [],
    currentDraftSummary = {}
  } = {}) {
    const normalizedMessage = normalizeText(message)
    const normalizedMenuKey = matchMenu(menuKey, availableMenus.length ? availableMenus : [{ key: menuKey, label: menuKey }])

    if (READ_ONLY_MENU_SET.has(normalizedMenuKey)) {
      return {
        type: 'chat',
        reply: buildReadOnlyReply(normalizedMenuKey, normalizedMessage)
      }
    }

    if (IMAGE_REQUIRED_MENU_SET.has(normalizedMenuKey) && currentDraftSummary?.hasUploadedImages === false) {
      return {
        type: 'question',
        reply: '当前页面要先上传图片，AI智能体才能继续帮你整理更准确的参数。请先上传图片后再继续。',
        pendingQuestion: createPendingQuestion('upload_image_first', '请先上传图片', '上传完成后继续描述需求')
      }
    }

    const draftSuggestion = await generateSuggestion({
      userGoal: normalizedMessage,
      activeMenu: normalizedMenuKey,
      availableMenus,
      availableModels,
      availableRatios,
      availableImageTypes,
      availablePositiveTemplates,
      availableNegativeTemplates,
      currentDraftSummary
    })

    return {
      type: 'confirm_fill',
      reply: sanitizeReply('我已经整理出一套当前页面可直接填写的参数建议。确认后我只会帮你填写参数，不会自动提交任务。'),
      draftSuggestion,
      confirmCard: buildConfirmCard(normalizedMenuKey, draftSuggestion)
    }
  }

  return {
    askAgentAssistant,
    generateSuggestion
  }
}

module.exports = {
  createAgentAssistantService
}
