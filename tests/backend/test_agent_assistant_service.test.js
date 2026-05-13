import { describe, expect, it } from 'vitest'

describe('agentAssistantService', () => {
  it('returns a confirm-fill response with sanitized draft suggestions for parameter menus', async () => {
    const { createAgentAssistantService } = await import('../../main/src/services/agentAssistantService.js')

    const service = createAgentAssistantService()
    const response = await service.askAgentAssistant({
      message: '做一张日系清新女装电商主图',
      menuKey: 'single-design',
      availableMenus: [
        { key: 'single-design', label: '单图设计' }
      ],
      availableModels: [
        { value: 'gpt-image-2', label: 'gpt-image-2' }
      ],
      availableRatios: [
        { value: '1:1', label: '1:1' }
      ],
      availableImageTypes: [
        {
          id: 'system-empty-image-type',
          name: '无类型图片',
          category: '按钮提示词',
          summary: ''
        }
      ],
      availablePositiveTemplates: [
        {
          id: 'style-jp-clean',
          name: '日系清新',
          category: '按钮提示词',
          summary: '干净、柔和、电商主图风格'
        }
      ],
      availableNegativeTemplates: [
        {
          id: 'system-empty-negative-prompt',
          name: '无负向提示词',
          category: '反向提示词',
          summary: ''
        }
      ],
      currentDraftSummary: {
        taskName: '',
        model: 'gpt-image-2'
      }
    })

    expect(response).toMatchObject({
      type: 'confirm_fill',
      reply: expect.any(String),
      draftSuggestion: expect.objectContaining({
        taskName: expect.any(String),
        menuKey: 'single-design',
        model: 'gpt-image-2',
        ratio: '1:1',
        imageTypeTemplateId: 'system-empty-image-type',
        positiveTemplateId: 'style-jp-clean',
        negativeTemplateId: 'system-empty-negative-prompt',
        exclusivePrompt: expect.any(String),
        globalStylePrompt: expect.any(String),
        generateCount: 1
      }),
      confirmCard: expect.objectContaining({
        title: expect.any(String),
        confirmLabel: '确认填写',
        riskNotes: expect.any(Array)
      })
    })
    expect(JSON.stringify(response)).not.toContain('apiBaseUrl')
    expect(JSON.stringify(response)).not.toContain('ipc')
    expect(JSON.stringify(response)).not.toContain('sk-')
  })

  it('returns a follow-up question when critical prerequisites are missing', async () => {
    const { createAgentAssistantService } = await import('../../main/src/services/agentAssistantService.js')

    const service = createAgentAssistantService()
    const response = await service.askAgentAssistant({
      message: '帮我基于这张图做一套详情页',
      menuKey: 'series-design',
      availableMenus: [
        { key: 'series-design', label: '套图设计' }
      ],
      availableModels: [
        { value: 'gpt-image-2', label: 'gpt-image-2' },
        { value: 'nano-banana-fast', label: 'nano-banana-fast' }
      ],
      availableRatios: [
        { value: '1:1', label: '1:1' },
        { value: '4:3', label: '4:3' }
      ],
      availableImageTypes: [
        {
          id: 'system-empty-image-type',
          name: '无类型图片',
          category: '按钮提示词',
          summary: ''
        }
      ],
      availablePositiveTemplates: [
        {
          id: 'style-clean',
          name: '电商通用',
          category: '按钮提示词',
          summary: '干净、清晰、电商展示'
        }
      ],
      availableNegativeTemplates: [
        {
          id: 'system-empty-negative-prompt',
          name: '无负向提示词',
          category: '反向提示词',
          summary: ''
        }
      ],
      currentDraftSummary: {
        hasUploadedImages: false
      }
    })

    expect(response).toMatchObject({
      type: 'question',
      reply: expect.any(String),
      pendingQuestion: expect.objectContaining({
        key: expect.any(String),
        label: expect.any(String),
        required: true
      })
    })
    expect(response.reply).toContain('先上传图片')
  })

  it('returns a safe chat answer for read-only menus', async () => {
    const { createAgentAssistantService } = await import('../../main/src/services/agentAssistantService.js')

    const service = createAgentAssistantService()
    const response = await service.askAgentAssistant({
      message: '工作台都展示什么数据？',
      menuKey: 'workspace'
    })

    expect(response).toMatchObject({
      type: 'chat',
      reply: expect.any(String)
    })
    expect(response.reply).toContain('工作台')
    expect(JSON.stringify(response)).not.toContain('apiBaseUrl')
    expect(JSON.stringify(response)).not.toContain('Authorization')
  })
})
