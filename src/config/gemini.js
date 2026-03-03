import path from 'path';
import { HOME, readJsonFile, writeJsonFile, readTextFile, writeTextFile, backupFile, commandExists } from '../utils.js';

const CONFIG_DIR = path.join(HOME, '.gemini');
const ENV_PATH = path.join(CONFIG_DIR, '.env');
const SETTINGS_PATH = path.join(CONFIG_DIR, 'settings.json');

function parseEnv(content) {
  const result = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result[key] = val;
  }
  return result;
}

function serializeEnv(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

export const gemini = {
  id: 'gemini',
  name: 'Gemini CLI',
  command: 'gemini',

  isInstalled() {
    return commandExists('gemini');
  },

  getConfigPath() {
    return ENV_PATH;
  },

  readConfig() {
    const content = readTextFile(ENV_PATH);
    return content ? parseEnv(content) : null;
  },

  async configure({ apiKey, baseUrl }) {
    // 1. 写入 .env（API Key + Base URL）
    const existingEnv = readTextFile(ENV_PATH);
    const backupPath = backupFile(ENV_PATH);

    const env = existingEnv ? parseEnv(existingEnv) : {};
    if (apiKey) env.GEMINI_API_KEY = apiKey;
    if (baseUrl) env.GOOGLE_GEMINI_BASE_URL = baseUrl;

    writeTextFile(ENV_PATH, serializeEnv(env));

    // 2. 写入 settings.json（切换认证模式为 api-key）
    const existingSettings = readJsonFile(SETTINGS_PATH) || {};
    backupFile(SETTINGS_PATH);

    if (!existingSettings.security) existingSettings.security = {};
    if (!existingSettings.security.auth) existingSettings.security.auth = {};
    existingSettings.security.auth.selectedType = 'gemini-api-key';

    writeJsonFile(SETTINGS_PATH, existingSettings);

    return { configPath: ENV_PATH, backupPath };
  },

  async testApiKey(apiKey, baseUrl) {
    const url = baseUrl
      ? `${baseUrl}/v1beta/models?key=${apiKey}`
      : `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (res.status === 401) {
        return { ok: false, error: `认证失败 (HTTP 401)` };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },
};
