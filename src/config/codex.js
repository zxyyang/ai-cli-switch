import path from 'path';
import { HOME, readJsonFile, writeJsonFile, readTextFile, writeTextFile, backupFile, commandExists } from '../utils.js';

const CONFIG_DIR = path.join(HOME, '.codex');
const AUTH_PATH = path.join(CONFIG_DIR, 'auth.json');
const CONFIG_TOML_PATH = path.join(CONFIG_DIR, 'config.toml');

/**
 * 从 Base URL 提取可用作 provider ID 的短名称
 * 例：https://api.openai.com/v1 → openai-com
 *     http://127.0.0.1:8080    → localhost
 */
function providerIdFromUrl(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/\./g, '-').replace(/^www-/, '');
  } catch {
    return 'custom';
  }
}

/**
 * 在 TOML 内容中设置或替换顶层 key = "value"
 */
function setTomlTopLevelKey(content, key, value) {
  const lines = content.split('\n');
  const regex = new RegExp(`^${key}\\s*=`);
  // 布尔值和数字不加引号
  const formatted = (value === 'true' || value === 'false' || !isNaN(value)) ? value : `"${value}"`;
  const newLine = `${key} = ${formatted}`;

  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      lines[i] = newLine;
      return lines.join('\n');
    }
  }

  // 没找到，在第一个 [section] 之前插入
  let insertIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('[')) {
      insertIdx = i;
      break;
    }
    insertIdx = i + 1;
  }
  lines.splice(insertIdx, 0, newLine);
  return lines.join('\n');
}

/**
 * 删除 TOML 中的某个 [section] 块（包含其下所有键值对）
 */
function removeTomlSection(content, sectionName) {
  const lines = content.split('\n');
  const result = [];
  let inTargetSection = false;

  for (const line of lines) {
    // 检测 section 开始
    if (line.match(/^\[.+\]/)) {
      inTargetSection = line.trim() === `[${sectionName}]`;
      if (inTargetSection) continue; // 跳过目标 section header
    }
    if (!inTargetSection) {
      result.push(line);
    }
  }
  return result.join('\n');
}

export const codex = {
  id: 'codex',
  name: 'Codex (OpenAI)',
  command: 'codex',

  isInstalled() {
    return commandExists('codex');
  },

  getConfigPath() {
    return AUTH_PATH;
  },

  readConfig() {
    return readJsonFile(AUTH_PATH);
  },

  async configure({ apiKey, baseUrl }) {
    // 1. 写入 auth.json（只写 OPENAI_API_KEY）
    const backupPath = backupFile(AUTH_PATH);
    writeJsonFile(AUTH_PATH, {
      OPENAI_API_KEY: apiKey,
    });

    // 2. 更新 config.toml（保留用户的 mcp_servers、projects 等）
    if (baseUrl) {
      const providerId = providerIdFromUrl(baseUrl);
      backupFile(CONFIG_TOML_PATH);
      let toml = readTextFile(CONFIG_TOML_PATH) || '';

      // 设置顶层 key
      toml = setTomlTopLevelKey(toml, 'model_provider', providerId);
      toml = setTomlTopLevelKey(toml, 'disable_response_storage', 'true');

      // 移除旧的同名 section（如果存在）
      toml = removeTomlSection(toml, `model_providers.${providerId}`);

      // 追加新的 provider section
      const providerSection = `
[model_providers.${providerId}]
name = "${providerId}"
base_url = "${baseUrl}"
wire_api = "responses"
requires_openai_auth = true
`;
      toml = toml.trimEnd() + '\n' + providerSection;

      writeTextFile(CONFIG_TOML_PATH, toml);
    }

    return { configPath: AUTH_PATH, backupPath };
  },

  async testApiKey(apiKey, baseUrl) {
    const url = baseUrl || 'https://api.openai.com';
    try {
      const res = await fetch(`${url}/models`, {
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
  },
};
