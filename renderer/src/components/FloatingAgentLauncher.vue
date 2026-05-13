<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <button
    type="button"
    class="floating-agent-launcher floating-agent-launcher--docked"
    :aria-expanded="isOpen ? 'true' : 'false'"
    aria-label="打开 AI智能体"
    @click="emit('toggle')"
  >
    <span class="floating-agent-launcher__bot">AI</span>
    <span class="floating-agent-launcher__label">AI智能体</span>
  </button>
</template>
