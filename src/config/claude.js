import path from 'path';
import fs from 'fs';
import { HOME, readJsonFile, writeJsonFile, backupFile, deepMerge, commandExists } from '../utils.js';

const CONFIG_DIR = path.join(HOME, '.claude');
const SETTINGS_PATH = path.join(CONFIG_DIR, 'settings.json');
const LEGACY_PATH = path.join(CONFIG_DIR, 'claude.json');

function getSettingsPath() {
  if (fs.existsSync(SETTINGS_PATH)) return SETTINGS_PATH;
  if (fs.existsSync(LEGACY_PATH)) return LEGACY_PATH;
  return SETTINGS_PATH; // 默认新建
}

export const claude = {
  id: 'claude',
  name: 'Claude Code',
  command: 'claude',

  isInstalled() {
    return commandExists('claude');
  },

  getConfigPath() {
    return getSettingsPath();
  },

  readConfig() {
    return readJsonFile(getSettingsPath());
  },

  async configure({ apiKey, baseUrl, model }) {
    const configPath = getSettingsPath();
    const existing = readJsonFile(configPath) || {};

    // 备份
    const backupPath = backupFile(configPath);

    // 构建要写入的 env 字段
    const envUpdate = {};
    if (apiKey) envUpdate.ANTHROPIC_API_KEY = apiKey;
    if (baseUrl) envUpdate.ANTHROPIC_BASE_URL = baseUrl;
    if (model) {
      envUpdate.ANTHROPIC_MODEL = model;
      envUpdate.ANTHROPIC_DEFAULT_SONNET_MODEL = model;
    }

    // 深度合并：保留原有配置，只更新密钥相关字段
    const merged = deepMerge(existing, { env: envUpdate });
    writeJsonFile(configPath, merged);

    return { configPath, backupPath };
  },

  async testApiKey(apiKey, baseUrl) {
    const url = baseUrl || 'https://api.anthropic.com';
    try {
      const res = await fetch(`${url}/v1/messages`, {
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
      // 200/400/403 等都说明连接正常, 仅 401 说明密钥无效
      if (res.status === 401) {
        return { ok: false, error: `认证失败 (HTTP 401)` };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  getFields() {
    return [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk-ant-...' },
      { key: 'baseUrl', label: 'Base URL', type: 'text', required: false, default: 'https://api.anthropic.com' },
      { key: 'model', label: '默认模型 (可选)', type: 'text', required: false, placeholder: 'claude-sonnet-4-6' },
    ];
  },
};
