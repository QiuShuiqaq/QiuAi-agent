export function createDefaultAgentConversationSession() {
  return {
    status: 'idle',
    messages: [],
    draftSuggestion: null,
    pendingQuestion: null,
    confirmCard: null,
    lastApplyResult: null
  }
}

export function createAgentConversationStore() {
  return {
    sessionsByMenu: {}
  }
}

export function resolveAgentConversationSession(store, menuKey) {
  const normalizedMenuKey = String(menuKey || '').trim()
  if (!normalizedMenuKey) {
    return createDefaultAgentConversationSession()
  }

  if (!store.sessionsByMenu[normalizedMenuKey]) {
    store.sessionsByMenu[normalizedMenuKey] = createDefaultAgentConversationSession()
  }

  return store.sessionsByMenu[normalizedMenuKey]
}

export function clearAgentConversationSession(store, menuKey) {
  const normalizedMenuKey = String(menuKey || '').trim()
  if (!normalizedMenuKey) {
    return
  }

  store.sessionsByMenu[normalizedMenuKey] = createDefaultAgentConversationSession()
}
