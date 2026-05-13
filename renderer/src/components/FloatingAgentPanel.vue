<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  activeMenu: {
    type: String,
    default: ''
  },
  userGoal: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  conversationMessages: {
    type: Array,
    default: () => []
  },
  draftSuggestion: {
    type: Object,
    default: null
  },
  pendingQuestion: {
    type: Object,
    default: null
  },
  confirmCard: {
    type: Object,
    default: null
  },
  scenePresets: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'close',
  'update:user-goal',
  'send',
  'clear',
  'confirm-fill',
  'select-scene-preset'
])

const selectedPresetId = ref('')

const featuredScenePresets = computed(() => {
  return (Array.isArray(props.scenePresets) ? props.scenePresets : []).filter((preset) => preset?.isFeatured === true)
})

const extraScenePresets = computed(() => {
  return (Array.isArray(props.scenePresets) ? props.scenePresets : []).filter((preset) => preset?.isFeatured !== true)
})

const hasScenePresets = computed(() => {
  return featuredScenePresets.value.length > 0 || extraScenePresets.value.length > 0
})

watch(() => props.activeMenu, () => {
  selectedPresetId.value = ''
})

function handleSelectScenePreset(preset) {
  if (!preset?.promptText) {
    return
  }

  emit('select-scene-preset', preset)
}

function handleExtraPresetChange(event) {
  const presetId = String(event?.target?.value || '')
  selectedPresetId.value = presetId
  const matchedPreset = extraScenePresets.value.find((preset) => preset.id === presetId)
  if (!matchedPreset) {
    return
  }

  handleSelectScenePreset(matchedPreset)
}
</script>

<template>
  <aside
    class="floating-agent-panel"
    :class="{ 'floating-agent-panel--open': visible }"
  >
    <header class="floating-agent-panel__header">
      <div class="floating-agent-panel__title">
        <strong>AI智能体</strong>
        <span>{{ isLoading ? '思考中...' : '待命中' }}</span>
      </div>
      <button type="button" class="floating-agent-panel__close" @click="emit('close')">收起</button>
    </header>

    <section class="floating-agent-panel__body">
      <section class="floating-agent-panel__meta">
        <div class="floating-agent-panel__meta-card">
          <strong>当前菜单</strong>
          <span>{{ activeMenu || '--' }}</span>
        </div>
        <p class="floating-agent-panel__meta-copy">仅辅助填写当前页面参数，不会自动提交任务。</p>
      </section>

      <section class="floating-agent-panel__presets">
        <template v-if="hasScenePresets">
          <div v-if="featuredScenePresets.length" class="floating-agent-panel__preset-group">
            <div class="floating-agent-panel__preset-heading">
              <strong>常用场景</strong>
            </div>
            <div class="floating-agent-panel__preset-grid">
              <button
                v-for="preset in featuredScenePresets"
                :key="preset.id"
                type="button"
                class="floating-agent-panel__preset-card"
                @click="handleSelectScenePreset(preset)"
              >
                <strong>{{ preset.title }}</strong>
                <span>{{ preset.description }}</span>
              </button>
            </div>
          </div>

          <label v-if="extraScenePresets.length" class="floating-agent-panel__preset-group">
            <span class="floating-agent-panel__preset-heading">更多场景</span>
            <select
              :value="selectedPresetId"
              class="floating-agent-panel__preset-select"
              @change="handleExtraPresetChange"
            >
              <option value="">请选择更多场景</option>
              <option
                v-for="preset in extraScenePresets"
                :key="preset.id"
                :value="preset.id"
              >
                {{ preset.title }}
              </option>
            </select>
          </label>
        </template>

        <p v-else class="floating-agent-panel__preset-empty">当前菜单暂无推荐场景</p>
      </section>

      <section class="floating-agent-panel__chat">
        <div class="floating-agent-panel__section-title">聊天记录</div>
        <div class="floating-agent-panel__message-list">
          <article
            v-for="(message, index) in conversationMessages"
            :key="message.id || `${message.role || 'message'}-${index}`"
            class="floating-agent-panel__message"
            :class="`floating-agent-panel__message--${message.role || 'assistant'}`"
          >
            <strong>{{ message.role === 'user' ? '你' : 'AI智能体' }}</strong>
            <p>{{ message.content }}</p>
          </article>
          <p v-if="!conversationMessages.length" class="floating-agent-panel__message-empty">
            先说出你的需求，我会尽量用最少轮次帮你整理当前页面的参数。
          </p>
        </div>
      </section>

      <section v-if="pendingQuestion" class="floating-agent-panel__status-card">
        <strong>{{ pendingQuestion.label || '还缺一个关键信息' }}</strong>
        <p>{{ pendingQuestion.placeholder || '补充后我再继续整理参数。' }}</p>
      </section>

      <section v-if="draftSuggestion" class="floating-agent-panel__status-card">
        <strong>建议摘要</strong>
        <p>{{ draftSuggestion.reason || '已整理出当前页面可填写的建议参数。' }}</p>
      </section>

      <section v-if="confirmCard" class="floating-agent-panel__status-card">
        <strong>{{ confirmCard.title || '确认填写' }}</strong>
        <p>{{ confirmCard.summary || '确认后我会填写当前页面参数。' }}</p>
        <p
          v-for="note in confirmCard.riskNotes || []"
          :key="note"
          class="floating-agent-panel__status-note"
        >
          {{ note }}
        </p>
        <button type="button" class="primary-action floating-agent-panel__confirm" @click="emit('confirm-fill')">
          {{ confirmCard.confirmLabel || '确认填写' }}
        </button>
      </section>

      <label class="floating-agent-panel__field">
        <span>输入需求</span>
        <textarea
          :value="userGoal"
          rows="5"
          placeholder="例如：帮我做一套清爽夏季女装详情页，整体明亮干净，重点突出面料和版型"
          @input="emit('update:user-goal', $event.target.value)"
        />
      </label>

      <div class="floating-agent-panel__actions">
        <button type="button" class="primary-action" :disabled="isLoading" @click="emit('send')">
          {{ isLoading ? '思考中...' : '发送' }}
        </button>
        <button type="button" class="secondary-action" @click="emit('clear')">清空对话</button>
      </div>
    </section>
  </aside>
</template>
