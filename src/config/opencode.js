import path from 'path';
import { HOME, readJsonFile, writeJsonFile, backupFile, deepMerge, commandExists } from '../utils.js';

const CONFIG_DIR = path.join(HOME, '.config', 'opencode');
const CONFIG_PATH = path.join(CONFIG_DIR, 'opencode.json');

// 模型提供商预设（provider ID 在运行时根据 baseUrl 动态生成）
const PROVIDER_PRESETS = {
  claude: {
    providerSuffix: 'claude',
    npm: '@ai-sdk/anthropic',
    namePrefix: 'Custom Claude',
    model: 'claude-sonnet-4-6',
    modelName: 'Claude Sonnet 4.6',
    contextWindow: 200000,
    maxTokens: 65536,
  },
  openai: {
    providerSuffix: 'openai',
    npm: '@ai-sdk/openai-compatible',
    namePrefix: 'Custom OpenAI',
    model: 'gpt-4o',
    modelName: 'GPT-4o',
    contextWindow: 128000,
    maxTokens: 16384,
  },
  gemini: {
    providerSuffix: 'gemini',
    npm: '@ai-sdk/openai-compatible',
    namePrefix: 'Custom Gemini',
    model: 'gemini-2.5-pro',
    modelName: 'Gemini 2.5 Pro',
    contextWindow: 1000000,
    maxTokens: 65536,
  },
};

/**
 * 从 Base URL 提取 provider ID 前缀
 */
function hostFromUrl(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/\./g, '-').replace(/^www-/, '');
  } catch {
    return 'custom';
  }
}

export const opencode = {
  id: 'opencode',
  name: 'OpenCode',
  command: 'opencode',
  needsModelChoice: true,

  isInstalled() {
    return commandExists('opencode');
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
    const host = hostFromUrl(baseUrl);
    const providerId = `${host}-${preset.providerSuffix}`;
    const providerName = `${preset.namePrefix} (${host})`;

    const providerConfig = {
      [providerId]: {
        npm: preset.npm,
        name: providerName,
        options: {
          baseURL: baseUrl,
          apiKey: apiKey,
        },
        models: {
          [preset.model]: {
            name: preset.modelName,
            limit: {
              context: preset.contextWindow,
              output: preset.maxTokens,
            },
          },
        },
      },
    };

    const update = {
      provider: providerConfig,
      model: `${providerId}/${preset.model}`,
    };

    const merged = deepMerge(existing, update);
    writeJsonFile(CONFIG_PATH, merged);

    return { configPath: CONFIG_PATH, backupPath };
  },

  async testApiKey(apiKey, baseUrl, modelChoice) {
    // 根据选择的模型类型用不同的测试方式
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
    if (res.status === 401) {
      return { ok: false, error: `认证失败 (HTTP 401)` };
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
    if (res.status === 401) {
      return { ok: false, error: `认证失败 (HTTP 401)` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
