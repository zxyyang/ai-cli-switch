# ai-cli-switch

> One command to configure all your AI CLI tools.
> Supports any Base URL — official APIs, third-party relay services, or self-hosted proxies.

[![npm version](https://img.shields.io/npm/v/ai-cli-switch)](https://www.npmjs.com/package/ai-cli-switch)
[![npm downloads](https://img.shields.io/npm/dm/ai-cli-switch)](https://www.npmjs.com/package/ai-cli-switch)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[中文文档](README.zh.md)

---

## Demo

![ai-cli-switch demo](assets/demo.png)

---

## Overview

`ai-cli-switch` is a universal AI CLI configuration assistant. No matter what you use:

- **Official APIs** — `api.anthropic.com` / `api.openai.com` / `generativelanguage.googleapis.com`
- **Third-party relay services** — e.g. 78code.cc, OpenRouter, etc.
- **Self-hosted proxies** — local or cloud

One command, interactive prompts — done. No manual file editing required.

---

## Supported Tools

| Tool | Description | Default Base URL |
|------|-------------|-----------------|
| **Claude Code** | Anthropic's official CLI | `https://api.anthropic.com` |
| **Codex** | OpenAI Codex CLI | `https://api.openai.com/v1` |
| **Gemini CLI** | Google Gemini CLI | `https://generativelanguage.googleapis.com` |
| **OpenCode** | Open-source AI coding assistant (Claude / OpenAI / Gemini) | depends on model |
| **OpenClaw** | Open-source AI coding assistant (Claude / OpenAI / Gemini) | depends on model |

---

## Quick Start

### Run without installing

```bash
npx ai-cli-switch
```

### Install globally

```bash
npm install -g ai-cli-switch
ai-cli-switch
```

---

## Usage Flow

```
ai-cli-switch
  │
  ├─ [Optional] Set network proxy
  │
  ├─ Auto-detect installed AI CLI tools
  │
  ├─ Select tool to configure
  │       Claude Code / Codex / Gemini CLI / OpenCode / OpenClaw
  │
  ├─ [OpenCode/OpenClaw] Select model provider
  │       Claude (Anthropic) / OpenAI (GPT) / Gemini (Google)
  │
  ├─ Enter Base URL
  │       Default = official API. Change to your relay/proxy address.
  │
  ├─ Enter API Key (masked input)
  │
  ├─ Auto-test API connection
  │
  ├─ Write config file (auto-backup existing config)
  │
  └─ Self-check to confirm config is active ✅
```

---

## Base URL Examples

| Scenario | Base URL |
|----------|----------|
| Anthropic official | `https://api.anthropic.com` |
| OpenAI official | `https://api.openai.com/v1` |
| Gemini official | `https://generativelanguage.googleapis.com` |
| 78code relay (Claude) | `https://www.78code.cc` |
| 78code relay (OpenAI) | `https://www.78code.cc/v1` |
| Local proxy | `http://127.0.0.1:8080` |
| Cloud proxy | `https://your-proxy.example.com` |

---

## Config File Locations

### Claude Code

`~/.claude/settings.json`:

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
- `~/.codex/config.toml` → custom provider block (ID derived from Base URL hostname)

### Gemini CLI

`~/.gemini/.env`:

```
GEMINI_API_KEY=<your-api-key>
GOOGLE_GEMINI_BASE_URL=<your-base-url>
```

### OpenCode

`~/.config/opencode/opencode.json` — provider ID format: `{hostname}-{model-type}`

### OpenClaw

`~/.openclaw/openclaw.json` — same format as OpenCode

---

## Auto Backup

Before every write, existing config is automatically backed up:

```
~/.claude/settings.json.bak.1709123456789
```

---

## Requirements

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org))
- At least one AI CLI tool installed

### Install Claude Code (example)

```bash
npm install -g @anthropic-ai/claude-code
```

---

## FAQ

**Q: "No installed AI CLI tools detected"?**

Install at least one tool first:

```bash
npm install -g @anthropic-ai/claude-code   # Claude Code
npm install -g @openai/codex               # Codex
npm install -g @google/gemini-cli          # Gemini CLI
```

**Q: API connection test failed?**

- Check that Base URL is correct (no trailing `/`)
- Check that your API Key is valid
- If you're in China, try setting a proxy when prompted

**Q: How to verify Claude Code config manually?**

```bash
cat ~/.claude/settings.json
```

---

## Fork for Your Own Service

If you run your own API relay, fork this repo and:

1. Set your service URL as the default in `src/index.js` → `DEFAULT_BASE_URLS`
2. Update the package `name` and `bin` in `package.json`
3. Update the banner and completion message branding
4. Publish to npm — your users can run `npx your-tool` to configure instantly

Example: [78code-ai](https://github.com/zxyyang/78code) — a branded edition of this tool for 78code.cc

---

## License

MIT
