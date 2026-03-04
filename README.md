# AI CLI Config

> One-command tool to configure Claude Code, Codex, Gemini CLI, OpenCode, and OpenClaw
> 支持任意 Base URL — 官方 API 或自建中转服务均可

[![npm version](https://img.shields.io/npm/v/ai-cli-config)](https://www.npmjs.com/package/ai-cli-config)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 简介 / Overview

`ai-cli-config` 是一个通用的 AI CLI 配置助手。无论你使用的是：

- **官方 API**（api.anthropic.com / api.openai.com）
- **第三方中转服务**（如 78code.cc 等）
- **自建 API 代理**（本地或云端）

只需运行一条命令，交互式填写 Base URL 和 API Key，即可自动完成配置。

---

## 支持的工具 / Supported Tools

| 工具 | 说明 | 默认 Base URL |
|------|------|---------------|
| **Claude Code** | Anthropic 官方 CLI | `https://api.anthropic.com` |
| **Codex** | OpenAI Codex CLI | `https://api.openai.com/v1` |
| **Gemini CLI** | Google Gemini 命令行 | `https://generativelanguage.googleapis.com` |
| **OpenCode** | 开源 AI 编程助手（Claude/OpenAI/Gemini） | 视模型而定 |
| **OpenClaw** | 开源 AI 编程助手（Claude/OpenAI/Gemini） | 视模型而定 |

---

## 快速开始 / Quick Start

### 无需安装，直接运行

```bash
npx ai-cli-config
```

### 全局安装

```bash
npm install -g ai-cli-config
aicfg
```

---

## 使用流程 / Usage Flow

```
aicfg
  │
  ├─ [可选] 设置网络代理
  │
  ├─ 自动检测已安装的 AI CLI 工具
  │
  ├─ 选择要配置的工具
  │       Claude Code / Codex / Gemini CLI / OpenCode / OpenClaw
  │
  ├─ [OpenCode/OpenClaw] 选择模型类型
  │       Claude (Anthropic) / OpenAI (GPT) / Gemini (Google)
  │
  ├─ 输入 Base URL
  │       默认为官方地址，可直接修改为你的中转服务地址
  │
  ├─ 输入 API Key（密码模式，不显示明文）
  │
  ├─ 自动测试 API 连接
  │
  ├─ 写入配置文件（自动备份原配置）
  │
  └─ 自检确认配置生效 ✅
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
| 自建代理（示例） | `http://127.0.0.1:8080` |
| 云端代理（示例） | `https://your-proxy.example.com` |

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
- `~/.codex/config.toml` → 添加自定义 provider 段落（provider ID 根据 Base URL 自动生成）

### Gemini CLI

写入 `~/.gemini/.env`：

```
GEMINI_API_KEY=<your-api-key>
GOOGLE_GEMINI_BASE_URL=<your-base-url>
```

### OpenCode

写入 `~/.config/opencode/opencode.json`，provider ID 格式为 `{hostname}-{model-type}`（如 `api-openai-com-claude`）。

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

请先安装对应工具，例如：

```bash
npm install -g @anthropic-ai/claude-code   # Claude Code
npm install -g @openai/codex               # Codex
npm install -g @google/gemini-cli          # Gemini CLI
```

---

**Q: API 连接测试失败？**

- 检查 Base URL 是否正确（末尾不要加 `/`）
- 检查 API Key 是否有效
- 如在国内，可能需要设置代理（工具启动时会询问）

---

**Q: 如何手动验证 Claude Code 配置？**

```bash
cat ~/.claude/settings.json
```

---

## 项目结构

```
ai-cli-config/
├── bin/
│   └── index.js          # CLI 入口
├── src/
│   ├── index.js          # 主流程（交互逻辑）
│   ├── utils.js          # 工具函数（文件读写、连接测试等）
│   └── config/
│       ├── claude.js     # Claude Code 配置模块
│       ├── codex.js      # Codex 配置模块
│       ├── gemini.js     # Gemini CLI 配置模块
│       ├── opencode.js   # OpenCode 配置模块
│       └── openclaw.js   # OpenClaw 配置模块
└── package.json
```

---

## 二次开发 / Fork for Your Own Proxy

如果你运营自己的 API 中转服务，可以 fork 本仓库并：

1. 在 `src/index.js` 中修改 `DEFAULT_BASE_URLS` 为你自己的服务地址
2. 修改 `package.json` 中的 `name` 和 `bin` 字段
3. 更新 banner 和完成页面中的品牌信息
4. 发布到 npm，用户即可一键使用你的专属配置工具

---

## 分支说明

| 分支 | 说明 |
|------|------|
| `main` | 通用版本，支持手动输入任意 Base URL |
| `78code-edition` | 78code.cc 专属版，Base URL 已预设，开箱即用 |

---

## License

MIT
