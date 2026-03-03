import { select, password } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import os from 'os';
import { toolList } from './config/index.js';
import { IS_WIN, getPlatformName } from './utils.js';

// ==================== 配置变量 ====================
const MODEL_BASE_URLS = {
  claude: 'https://www.78code.cc',
  openai: 'https://www.78code.cc/v1',
  gemini: 'https://www.78code.cc',
};

const TOOL_BASE_URLS = {
  claude:  MODEL_BASE_URLS.claude,
  codex:   MODEL_BASE_URLS.openai,
  gemini:  MODEL_BASE_URLS.gemini,
};

const SITE_URL = 'https://www.78code.cc';
const QQ_GROUP = '1081535932';

// ==================== 是/否选择（上下箭头） ====================
async function confirmSelect(message, defaultYes = true) {
  const choices = defaultYes
    ? [
        { name: `${chalk.green('>')} 是`, value: true },
        { name: `  否`, value: false },
      ]
    : [
        { name: `${chalk.red('>')} 否`, value: false },
        { name: `  是`, value: true },
      ];
  return await select({ message, choices });
}

// ==================== Banner ====================
function showBanner() {
  const line = chalk.gray('  ─────────────────────────────────────────');
  console.log('');
  console.log(line);
  console.log(chalk.cyan.bold('    _________                 __           '));
  console.log(chalk.cyan.bold('   /__  ( __ )_________  ____/ /__         '));
  console.log(chalk.cyan.bold('     / / __  / ___/ __ \\/ __  / _ \\   '));
  console.log(chalk.cyan.bold('    / / /_/ / /__/ /_/ / /_/ /  __/       '));
  console.log(chalk.cyan.bold('   /_/\\____/\\___/\\____/\\__,_/\\___/  '));
  console.log('');
  console.log(chalk.bold.white('   AI CLI 一键配置工具') + chalk.gray(' v1.0.1'));
  console.log(chalk.gray('   快速配置 Claude Code / Codex / Gemini / OpenCode / OpenClaw'));
  console.log(line);
  console.log('');
}

// ==================== 环境检测 ====================
async function detectEnvironment() {
  const spinner = ora({ text: '正在检测环境...', spinner: 'dots12' }).start();

  const platform = getPlatformName();
  const arch = os.arch();
  const shell = IS_WIN
    ? (process.env.ComSpec || 'cmd.exe')
    : (process.env.SHELL || '/bin/sh');

  const installed = [];
  for (const tool of toolList) {
    if (tool.isInstalled()) installed.push(tool);
  }

  spinner.succeed(chalk.bold('环境检测完成'));
  console.log('');

  // 系统信息表格
  const info = [
    ['平台', `${platform} (${arch})`],
    ['Node.js', process.version],
    ['Shell', shell],
    ['用户目录', os.homedir()],
  ];
  for (const [label, value] of info) {
    console.log(`  ${chalk.gray(label.padEnd(10))} ${chalk.white(value)}`);
  }
  console.log('');

  // 已安装工具
  if (installed.length === 0) {
    console.log(chalk.red.bold('  未检测到任何已安装的 AI CLI 工具'));
  } else {
    console.log(chalk.bold(`  检测到 ${installed.length} 个已安装工具:`));
    console.log('');
    for (const tool of installed) {
      console.log(`    ${chalk.green('●')} ${chalk.white(tool.name)}`);
    }
  }
  console.log('');

  return installed;
}

// ==================== 选择工具 ====================
async function selectTool(installed) {
  return await select({
    message: '选择要配置的工具',
    choices: installed.map((tool) => ({
      name: `  ${tool.name}`,
      value: tool,
    })),
  });
}

// ==================== 去除末尾斜杠 ====================
function trimTrailingSlash(url) {
  return url ? url.replace(/\/+$/, '') : url;
}

// ==================== 获取 Base URL ====================
function getBaseUrl(tool, modelChoice) {
  if (tool.needsModelChoice && modelChoice) {
    return trimTrailingSlash(MODEL_BASE_URLS[modelChoice]);
  }
  return trimTrailingSlash(TOOL_BASE_URLS[tool.id]);
}

// ==================== 配置单个工具 ====================
async function configureOneTool(installed) {
  const tool = await selectTool(installed);

  // 如果需要选模型提供商（OpenCode / OpenClaw）
  let modelChoice = null;
  if (tool.needsModelChoice) {
    console.log('');
    modelChoice = await select({
      message: `${tool.name} 要使用哪个模型`,
      choices: tool.getModelChoices().map((c) => ({
        name: `  ${c.label}`,
        value: c.value,
      })),
    });
  }

  const baseUrl = getBaseUrl(tool, modelChoice);

  console.log('');
  console.log(chalk.bold(`  ┌ 配置 ${tool.name}`));
  if (baseUrl) {
    console.log(chalk.gray(`  │ Base URL: ${baseUrl}`));
  }
  console.log(chalk.gray('  │'));

  // 输入 API Key
  const apiKey = await password({
    message: 'API Key',
    mask: '*',
    validate: (v) => {
      if (!v) return 'API Key 不能为空';
      return true;
    },
  });

  if (!apiKey) {
    console.log(chalk.yellow('  └ 未输入 API Key，已取消'));
    return false;
  }

  // 连接测试
  console.log('');
  const spinner = ora({ text: '正在测试 API 连接...', spinner: 'dots12' }).start();
  const testResult = tool.testApiKey
    ? await tool.testApiKey(apiKey, baseUrl, modelChoice)
    : { ok: true };

  if (testResult.ok) {
    spinner.succeed(chalk.green('API 连接测试通过'));
  } else {
    spinner.fail(chalk.red(`API 连接测试失败: ${testResult.error}`));
    console.log('');
    const proceed = await confirmSelect('连接测试失败，是否仍然写入配置？', false);
    if (!proceed) {
      console.log(chalk.yellow('\n  └ 已取消配置\n'));
      return false;
    }
  }

  // 写入配置
  const writeSpinner = ora({ text: '正在写入配置...', spinner: 'dots12' }).start();
  try {
    const result = await tool.configure({ apiKey, baseUrl, modelChoice });
    writeSpinner.succeed(chalk.green('配置写入成功'));
    console.log(`    ${chalk.gray('配置文件:')} ${chalk.cyan(result.configPath)}`);
    if (result.backupPath) {
      console.log(`    ${chalk.gray('备份文件:')} ${chalk.gray(result.backupPath)}`);
    }
  } catch (err) {
    writeSpinner.fail(chalk.red(`配置写入失败: ${err.message}`));
    return false;
  }

  // 自检
  const checkSpinner = ora({ text: '正在进行自检...', spinner: 'dots12' }).start();
  try {
    const config = tool.readConfig();
    if (config) {
      checkSpinner.succeed(chalk.green('自检通过，一切正常'));
    } else {
      checkSpinner.warn(chalk.yellow('配置文件写入后读取为空，可能存在权限问题'));
    }
  } catch {
    checkSpinner.warn(chalk.yellow('配置文件读取失败'));
  }

  console.log(chalk.gray('  └ 完成'));
  return true;
}

// ==================== 完成展示 ====================
function showCompletion() {
  const line = chalk.gray('  ─────────────────────────────────────────');
  console.log('');
  console.log(line);
  console.log('');
  console.log(chalk.green.bold('   ✅ 全部配置完成！'));
  console.log('');
  console.log(`   🌐 官网  ${chalk.cyan.underline(SITE_URL)}`);
  console.log(`   💬 QQ群  ${chalk.cyan(QQ_GROUP)}`);
  console.log('');
  console.log(chalk.gray('   感谢使用 78code，祝你编程愉快！'));
  console.log('');
  console.log(line);
  console.log('');
}

// ==================== 主流程 ====================
export async function main() {
  showBanner();

  // 1. 环境检测
  const installed = await detectEnvironment();

  if (installed.length === 0) {
    console.log(chalk.red('  请先安装至少一个 AI CLI 工具后再运行本配置工具。'));
    console.log('');
    return;
  }

  // 2. 配置工具（循环，直到用户不想继续）
  await configureOneTool(installed);

  while (installed.length > 1) {
    console.log('');
    const more = await confirmSelect('是否继续配置其他工具？', false);
    if (!more) break;
    console.log('');
    await configureOneTool(installed);
  }

  // 3. 完成
  showCompletion();
}
