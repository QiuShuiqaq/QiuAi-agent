<script setup>
import { computed } from 'vue'

const props = defineProps({
  profileDraft: {
    type: Object,
    required: true
  },
  profiles: {
    type: Array,
    required: true
  },
  activeProfileId: {
    type: String,
    default: ''
  },
  modelCatalog: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'update-profile-field',
  'save-profile',
  'reset-profile',
  'select-profile',
  'enable-profile',
  'remove-profile',
  'apply-model'
])

const freeModels = computed(() => Array.isArray(props.modelCatalog?.free) ? props.modelCatalog.free : [])
const paidModels = computed(() => Array.isArray(props.modelCatalog?.paid) ? props.modelCatalog.paid : [])

function updateField(field, event) {
  emit('update-profile-field', {
    field,
    value: event?.target?.value ?? ''
  })
}
</script>

<template>
  <section class="agent-settings-panel">
    <header class="section-header">
      <h2>Agent设置</h2>
    </header>

    <div class="agent-settings-panel__layout">
      <section class="agent-settings-panel__main">
        <section class="agent-settings-panel__block">
          <div class="agent-settings-panel__block-header">
            <strong>参数设置</strong>
            <span>保存后立即写入本地配置档案</span>
          </div>

          <div class="agent-settings-panel__form">
            <label class="form-field">
              <span>配置名称</span>
              <input
                :value="profileDraft.name || ''"
                type="text"
                placeholder="例如：GLM默认档"
                @input="updateField('name', $event)"
              />
            </label>

            <label class="form-field">
              <span>提供方</span>
              <input
                :value="profileDraft.providerName || ''"
                type="text"
                placeholder="例如：智谱 / Groq / Claude"
                @input="updateField('providerName', $event)"
              />
            </label>

            <label class="form-field">
              <span>模型名称</span>
              <input
                :value="profileDraft.model || ''"
                type="text"
                placeholder="例如：glm-4-flash"
                @input="updateField('model', $event)"
              />
            </label>

            <label class="form-field">
              <span>请求地址</span>
              <input
                :value="profileDraft.requestUrl || ''"
                type="text"
                placeholder="此处仅在 Agent设置 中维护"
                @input="updateField('requestUrl', $event)"
              />
            </label>

            <label class="form-field">
              <span>请求方式</span>
              <input
                :value="profileDraft.method || 'POST'"
                type="text"
                placeholder="POST"
                @input="updateField('method', $event)"
              />
            </label>

            <label class="form-field">
              <span>认证方式</span>
              <input
                :value="profileDraft.authType || 'bearer'"
                type="text"
                placeholder="bearer / x-api-key"
                @input="updateField('authType', $event)"
              />
            </label>

            <div class="agent-settings-panel__actions">
              <button type="button" class="primary-action" @click="emit('save-profile')">保存配置</button>
              <button type="button" class="secondary-action" @click="emit('reset-profile')">清空新建</button>
            </div>
          </div>
        </section>

        <section class="agent-settings-panel__block">
          <div class="agent-settings-panel__block-header">
            <strong>配置档案</strong>
            <span>只允许启用一个档案</span>
          </div>

          <div class="agent-settings-panel__profiles">
            <article
              v-for="profile in profiles"
              :key="profile.id"
              class="agent-settings-panel__profile-card"
              :class="{ 'agent-settings-panel__profile-card--active': profile.id === activeProfileId }"
            >
              <div class="agent-settings-panel__profile-top">
                <div class="agent-settings-panel__profile-copy">
                  <strong>{{ profile.name || '未命名配置' }}</strong>
                  <div class="agent-settings-panel__profile-head">
                    <span>{{ profile.providerName || '未设置提供方' }} / {{ profile.model || '未设置模型' }}</span>
                    <div class="agent-settings-panel__profile-actions">
                      <button
                        type="button"
                        class="secondary-action secondary-action--compact agent-settings-panel__delete-button"
                        @click="emit('remove-profile', profile.id)"
                      >
                        删除
                      </button>
                      <button
                        type="button"
                        class="secondary-action secondary-action--compact agent-settings-panel__edit-button"
                        @click="emit('select-profile', profile.id)"
                      >
                        编辑
                      </button>
                      <button
                        v-if="profile.id === activeProfileId"
                        type="button"
                        class="primary-action"
                        disabled
                      >
                        已启用
                      </button>
                      <button
                        v-else
                        type="button"
                        class="primary-action"
                        @click="emit('enable-profile', profile.id)"
                      >
                        启用
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>

      <section class="agent-settings-panel__catalog">
        <section class="agent-settings-panel__block">
          <div class="agent-settings-panel__block-header">
            <strong>可接入模型</strong>
            <span>点击应用后会把对应内容填入左侧参数设置</span>
          </div>

          <div class="agent-settings-panel__catalog-group">
            <div class="agent-settings-panel__catalog-title">免费模型</div>
            <article
              v-for="item in freeModels"
              :key="item.id"
              class="agent-settings-panel__model-card"
            >
              <div class="agent-settings-panel__model-copy">
                <strong>{{ item.title }}</strong>
                <span>{{ item.providerName }} / {{ item.model }}</span>
                <small>{{ item.description }}</small>
              </div>
              <button type="button" class="primary-action" @click="emit('apply-model', item)">应用</button>
            </article>
          </div>

          <div class="agent-settings-panel__catalog-group">
            <div class="agent-settings-panel__catalog-title">付费模型</div>
            <article
              v-for="item in paidModels"
              :key="item.id"
              class="agent-settings-panel__model-card"
            >
              <div class="agent-settings-panel__model-copy">
                <strong>{{ item.title }}</strong>
                <span>{{ item.providerName }} / {{ item.model }}</span>
                <small>{{ item.description }}</small>
              </div>
              <button type="button" class="primary-action" @click="emit('apply-model', item)">应用</button>
            </article>
          </div>
        </section>
      </section>
    </div>
  </section>
</template>
