import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

export const HOME = os.homedir();
export const IS_WIN = process.platform === 'win32';
export const IS_MAC = process.platform === 'darwin';
export const IS_LINUX = process.platform === 'linux';

/**
 * 获取友好的平台名称
 */
export function getPlatformName() {
  if (IS_MAC) return 'macOS';
  if (IS_WIN) return 'Windows';
  if (IS_LINUX) return 'Linux';
  return process.platform;
}

/**
 * 安全读取 JSON 文件，不存在则返回 null
 */
export function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * 原子写入文件（跨平台兼容）
 * macOS/Linux: rename 原子操作
 * Windows: 先删目标再 rename（Windows rename 不覆盖）
 */
function atomicWriteFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = filePath + '.tmp';
  fs.writeFileSync(tmpPath, content, 'utf-8');
  if (IS_WIN) {
    try { fs.unlinkSync(filePath); } catch {}
  }
  fs.renameSync(tmpPath, filePath);
}

/**
 * 原子写入 JSON 文件
 */
export function writeJsonFile(filePath, data) {
  atomicWriteFile(filePath, JSON.stringify(data, null, 2) + '\n');
}

/**
 * 安全读取文本文件
 */
export function readTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * 原子写入文本文件
 */
export function writeTextFile(filePath, content) {
  atomicWriteFile(filePath, content);
}

/**
 * 备份文件（如果存在）
 */
export function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = filePath + '.bak.' + Date.now();
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }
  return null;
}

/**
 * 检测命令是否存在（跨平台）
 * macOS/Linux: which
 * Windows: where
 */
export function commandExists(cmd) {
  try {
    const checkCmd = IS_WIN ? `where ${cmd}` : `which ${cmd}`;
    execSync(checkCmd, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * 测试 URL 连通性
 */
export async function testConnection(url, timeout = 10000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * 深度合并对象（只覆盖指定的 key，不删除已有的 key）
 */
export function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
