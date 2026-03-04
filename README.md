# ai-cli-switch

> 一条命令配置所有 AI CLI 工具 — Claude Code · Codex · Gemini CLI · OpenCode · OpenClaw
> Supports any Base URL: official APIs, self-hosted proxies, or third-party relay services.

[![npm version](https://img.shields.io/npm/v/ai-cli-switch)](https://www.npmjs.com/package/ai-cli-switch)
[![npm downloads](https://img.shields.io/npm/dm/ai-cli-switch)](https://www.npmjs.com/package/ai-cli-switch)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Demo

```
$ npx ai-cli-switch

  ─────────────────────────────────────────
    ___    ____   ________    ____
   /   |  /  _/  / ____/ /   / __/___ _
  / /| |  / /   / /   / /   / /_/ __ `/
 / ___ |_/ /   / /___/ /___/ __/ /_/ /
/_/  |_/___/   \____/_____/_/  \__, /
                               /____/

   AI CLI Config v1.0.0
   快速配置 Claude Code / Codex / Gemini / OpenCode / OpenClaw
   支持自定义 Base URL，兼容任意 API 中转服务
  ─────────────────────────────────────────

? 是否需要设置网络代理？  否
⠋ 正在检测环境...
✔ 环境检测完成

  平台        macOS (arm64)
  Node.js     v22.0.0
  Shell       /bin/zsh
  用户目录     /Users/yourname

  检测到 2 个已安装工具:

    ● Claude Code
    ● Gemini CLI

? 选择要配置的工具   Claude Code
? Base URL（留空使用官方地址，或填入你的中转地址）
  https://api.anthropic.com        ← 默认官方，直接改成中转地址即可

? API Key  ********

⠋ 正在测试 API 连接...
✔ API 连接测试通过
✔ 配置写入成功
    配置文件: /Users/yourname/.claude/settings.json
    备份文件: /Users/yourname/.claude/settings.json.bak.1709123456789
✔ 自检通过，一切正常
  └ 完成

? 是否继续配置其他工具？  否

  ─────────────────────────────────────────

   ✅ 全部配置完成！

   你的 AI CLI 工具已配置完毕，尽情享用吧！

  ─────────────────────────────────────────
```

---

## 简介

`ai-cli-switch` 是一个通用的 AI CLI 配置助手，支持：

- **官方 API** — `api.anthropic.com` / `api.openai.com` / `generativelanguage.googleapis.com`
- **第三方中转服务** — 如 78code.cc、openrouter 等
- **自建 API 代理** — 本地或云端任意地址

无需手动编辑配置文件，交互式填写 Base URL 和 API Key 即可完成。

---

## 支持的工具

| 工具 | 说明 | 默认 Base URL |
|------|------|---------------|
| **Claude Code** | Anthropic 官方 CLI | `https://api.anthropic.com` |
| **Codex** | OpenAI Codex CLI | `https://api.openai.com/v1` |
| **Gemini CLI** | Google Gemini 命令行 | `https://generativelanguage.googleapis.com` |
| **OpenCode** | 开源 AI 编程助手（Claude/OpenAI/Gemini） | 视模型而定 |
| **OpenClaw** | 开源 AI 编程助手（Claude/OpenAI/Gemini） | 视模型而定 |

---

## 快速开始

### 无需安装，直接运行

```bash
npx ai-cli-switch
```

### 全局安装

```bash
npm install -g ai-cli-switch
ai-cli-switch
```

---

## Base URL 填写示例

| 场景 | Base URL 示例 |
|------|---------------|
| Anthropic 官方 | `https://api.anthropic.com` |
| OpenAI 官方 | `https://api.openai.com/v1` |
| Gemini 官方 | `https://generativelanguage.googleapis.com` |
| 78code 中转（Claude） | `https://www.78code.cc` |
| 78code 中转（OpenAI） | `https://www.78code.cc/v1` |
| 自建代理（本地） | `http://127.0.0.1:8080` |
| 云端代理 | `https://your-proxy.example.com` |

---

## 各工具配置详情

### Claude Code

写入 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "<your-api-key>",
    "ANTHROPIC_BASE_URL": "<your-base-url>"
  }
}
```

### Codex (OpenAI)

- `~/.codex/auth.json` → `{ "OPENAI_API_KEY": "..." }`
- `~/.codex/config.toml` → 添加自定义 provider 段落（provider ID 根据 Base URL hostname 自动生成）

### Gemini CLI

写入 `~/.gemini/.env`：

```
GEMINI_API_KEY=<your-api-key>
GOOGLE_GEMINI_BASE_URL=<your-base-url>
```

### OpenCode

写入 `~/.config/opencode/opencode.json`，provider ID 格式为 `{hostname}-{model-type}`。

### OpenClaw

写入 `~/.openclaw/openclaw.json`，格式同 OpenCode。

---

## 配置备份

每次写入前自动备份原配置文件：

```
~/.claude/settings.json.bak.1709123456789
```

---

## 前置要求

- **Node.js** >= 18.0.0（[下载](https://nodejs.org)）
- 至少安装了一个上述 AI CLI 工具

### 安装 Claude Code（示例）

```bash
npm install -g @anthropic-ai/claude-code
```

---

## 常见问题

**Q: 提示"未检测到任何已安装的 AI CLI 工具"？**

请先安装对应工具：

```bash
npm install -g @anthropic-ai/claude-code   # Claude Code
npm install -g @openai/codex               # Codex
npm install -g @google/gemini-cli          # Gemini CLI
```

**Q: API 连接测试失败？**

- 检查 Base URL 是否正确（末尾不要加 `/`）
- 检查 API Key 是否有效
- 国内网络可在启动时选择设置代理

**Q: 如何手动验证 Claude Code 配置？**

```bash
cat ~/.claude/settings.json
```

---

## 项目结构

```
ai-cli-switch/
├── bin/
│   └── index.js          # CLI 入口
├── src/
│   ├── index.js          # 主流程（交互逻辑）
│   ├── utils.js          # 工具函数
│   └── config/
│       ├── claude.js     # Claude Code 配置模块
│       ├── codex.js      # Codex 配置模块
│       ├── gemini.js     # Gemini CLI 配置模块
│       ├── opencode.js   # OpenCode 配置模块
│       └── openclaw.js   # OpenClaw 配置模块
└── package.json
```

---

## Fork 为自己的专属版

如果你运营自己的 API 中转服务，可以 fork 本仓库：

1. 修改 `src/index.js` 中 `DEFAULT_BASE_URLS` 为你的服务地址
2. 修改 `package.json` 中的 `name` 和 `bin` 字段
3. 更新 banner 和完成页面中的品牌信息
4. 发布到 npm，用户即可一键使用你的专属配置工具

示例：[78code-ai](https://github.com/zxyyang/78code) — 基于本工具的 78code.cc 专属版

---

## License

MIT
