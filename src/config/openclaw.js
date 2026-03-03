import path from 'path';
import { HOME, readJsonFile, writeJsonFile, backupFile, deepMerge, commandExists } from '../utils.js';

const CONFIG_DIR = path.join(HOME, '.openclaw');
const CONFIG_PATH = path.join(CONFIG_DIR, 'openclaw.json');

// 模型提供商预设
const PROVIDER_PRESETS = {
  claude: {
    providerId: '78code-claude',
    api: 'anthropic-messages',
    model: { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6' },
    contextWindow: 200000,
    maxTokens: 65536,
  },
  openai: {
    providerId: '78code-openai',
    api: 'openai-completions',
    model: { id: 'gpt-4o', name: 'GPT-4o' },
    contextWindow: 128000,
    maxTokens: 16384,
  },
  gemini: {
    providerId: '78code-gemini',
    api: 'openai-completions',
    model: { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    contextWindow: 1000000,
    maxTokens: 65536,
  },
};

export const openclaw = {
  id: 'openclaw',
  name: 'OpenClaw',
  command: 'openclaw',
  needsModelChoice: true,

  isInstalled() {
    return commandExists('openclaw');
  },

  getConfigPath() {
    return CONFIG_PATH;
  },

  readConfig() {
    return readJsonFile(CONFIG_PATH);
  },

  getModelChoices() {
    return [
      { label: 'Claude (Anthropic)', value: 'claude' },
      { label: 'OpenAI (GPT)', value: 'openai' },
      { label: 'Gemini (Google)', value: 'gemini' },
    ];
  },

  async configure({ apiKey, baseUrl, modelChoice }) {
    const existing = readJsonFile(CONFIG_PATH) || {};
    const backupPath = backupFile(CONFIG_PATH);

    const preset = PROVIDER_PRESETS[modelChoice];
    const modelRef = `${preset.providerId}/${preset.model.id}`;

    const providerConfig = {
      [preset.providerId]: {
        baseUrl: baseUrl,
        apiKey: apiKey,
        api: preset.api,
        models: [
          {
            id: preset.model.id,
            name: preset.model.name,
            reasoning: false,
            input: ['text'],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: preset.contextWindow,
            maxTokens: preset.maxTokens,
          },
        ],
      },
    };

    const update = {
      models: {
        mode: 'merge',
        providers: providerConfig,
      },
      agents: {
        defaults: {
          model: {
            primary: modelRef,
          },
          models: {
            [modelRef]: {},
          },
        },
      },
    };

    const merged = deepMerge(existing, update);
    writeJsonFile(CONFIG_PATH, merged);

    return { configPath: CONFIG_PATH, backupPath };
  },

  async testApiKey(apiKey, baseUrl, modelChoice) {
    if (modelChoice === 'claude') {
      return testAnthropic(apiKey, baseUrl);
    }
    return testOpenAICompat(apiKey, baseUrl);
  },
};

async function testAnthropic(apiKey, baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: `认证失败 (HTTP ${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function testOpenAICompat(apiKey, baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: `认证失败 (HTTP ${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
