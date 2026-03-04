<div align="center">

<img src="assets/demo.png" alt="ai-cli-switch demo" width="720" />

<h1>⚡ ai-cli-switch</h1>

<p><strong>Configure all your AI CLI tools in one command</strong></p>
<p>Claude Code · Codex · Gemini CLI · OpenCode · OpenClaw — done in 30 seconds</p>
<p>Works with any Base URL: official APIs, relay services, or self-hosted proxies</p>

<br/>

[![npm version](https://img.shields.io/npm/v/ai-cli-switch?style=flat-square&color=ff6b6b&label=npm)](https://www.npmjs.com/package/ai-cli-switch)
[![npm downloads](https://img.shields.io/npm/dm/ai-cli-switch?style=flat-square&color=4ecdc4&label=downloads)](https://www.npmjs.com/package/ai-cli-switch)
[![npm total](https://img.shields.io/npm/dt/ai-cli-switch?style=flat-square&color=45b7d1&label=total%20installs)](https://www.npmjs.com/package/ai-cli-switch)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-success?style=flat-square)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/zxyyang/ai-cli-switch?style=flat-square&color=ffd93d)](https://github.com/zxyyang/ai-cli-switch)

<br/>

**🌐 Language / 语言 / 언어 / भाषा**

[🇨🇳 中文](README.md) · [🇺🇸 English](README.en.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md)

</div>

---

## ✨ Why ai-cli-switch?

Stop manually hunting for config file locations and formats. Stop re-configuring every tool when you switch API providers. Just run one command.

| Without ai-cli-switch | With ai-cli-switch |
|----------------------|-------------------|
| Google "where is Claude Code config file" | `npx ai-cli-switch` |
| Manually edit JSON / TOML / .env files | Interactive guided setup |
| Risk breaking existing config | Auto-backup before every write |
| Do it again for each tool | Configure all tools in one session |

---

## 🚀 Quick Start

```bash
npx ai-cli-switch
```

> Zero install required. Requires Node.js >= 18.

Or install globally:

```bash
npm install -g ai-cli-switch
ai-cli-switch
```

---

## 🛠️ Supported Tools

<table>
  <thead>
    <tr>
      <th>Tool</th>
      <th>Description</th>
      <th>Default Base URL</th>
      <th>Config File</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Claude Code</b></td>
      <td>Anthropic's official AI coding CLI</td>
      <td><code>https://api.anthropic.com</code></td>
      <td><code>~/.claude/settings.json</code></td>
    </tr>
    <tr>
      <td><b>Codex</b></td>
      <td>OpenAI's official CLI tool</td>
      <td><code>https://api.openai.com/v1</code></td>
      <td><code>~/.codex/auth.json</code></td>
    </tr>
    <tr>
      <td><b>Gemini CLI</b></td>
      <td>Google Gemini command-line tool</td>
      <td><code>https://generativelanguage.googleapis.com</code></td>
      <td><code>~/.gemini/.env</code></td>
    </tr>
    <tr>
      <td><b>OpenCode</b></td>
      <td>Open-source AI coding assistant (multi-model)</td>
      <td>depends on model</td>
      <td><code>~/.config/opencode/opencode.json</code></td>
    </tr>
    <tr>
      <td><b>OpenClaw</b></td>
      <td>Open-source AI coding assistant (multi-model)</td>
      <td>depends on model</td>
      <td><code>~/.openclaw/openclaw.json</code></td>
    </tr>
  </tbody>
</table>

---

## 🌐 Base URL Support

Works with any OpenAI-compatible or Anthropic-compatible endpoint:

| Scenario | Example Base URL |
|----------|-----------------|
| Anthropic official | `https://api.anthropic.com` |
| OpenAI official | `https://api.openai.com/v1` |
| Google Gemini official | `https://generativelanguage.googleapis.com` |
| 78code relay (Claude) | `https://www.78code.cc` |
| 78code relay (OpenAI) | `https://www.78code.cc/v1` |
| Local proxy | `http://127.0.0.1:8080` |
| Any OpenAI-compatible API | `https://your-api.example.com/v1` |

---

## 📋 How It Works

```
$ npx ai-cli-switch

  1. [Optional] Configure network proxy
  2. Auto-detect installed AI CLI tools
  3. Select the tool to configure
  4. Choose model provider (for OpenCode / OpenClaw)
  5. Enter Base URL (edit the pre-filled default)
  6. Enter API Key (masked input)
  7. Test API connectivity
  8. Write config file (auto-backup existing)
  9. Self-check verification ✅
```

---

## 🔒 Security

- **API Key never logged** — masked during input, never written to logs
- **Atomic writes** — config failures can't corrupt existing files
- **Auto-backup** — original config backed up as `*.bak.{timestamp}` before every change
- **Deep merge** — only updates key-related fields, preserves all your existing settings

---

## 📦 Config File Formats

<details>
<summary><b>Claude Code</b> — <code>~/.claude/settings.json</code></summary>

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-...",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com"
  }
}
```
</details>

<details>
<summary><b>Codex</b> — <code>~/.codex/auth.json</code> + <code>config.toml</code></summary>

```json
{ "OPENAI_API_KEY": "sk-..." }
```

```toml
model_provider = "api-openai-com"
disable_response_storage = true

[model_providers.api-openai-com]
name = "api-openai-com"
base_url = "https://api.openai.com/v1"
wire_api = "responses"
requires_openai_auth = true
```
</details>

<details>
<summary><b>Gemini CLI</b> — <code>~/.gemini/.env</code></summary>

```env
GEMINI_API_KEY=AIza...
GOOGLE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com
```
</details>

---

## 🧩 Fork for Your Own Service

Running an API relay or proxy service? Build your own branded version:

1. Fork this repo
2. Set your URL as default in `src/index.js` → `DEFAULT_BASE_URLS`
3. Update `name` and `bin` in `package.json`
4. Update the banner and completion screen branding
5. `npm publish`

Your users run `npx your-package` and get configured instantly. 🎉

**Example:** [78code-ai](https://github.com/zxyyang/78code) — a branded edition built for 78code.cc users

---

## ❓ FAQ

<details>
<summary>No AI CLI tools detected?</summary>

Install at least one tool first:

```bash
npm install -g @anthropic-ai/claude-code   # Claude Code
npm install -g @openai/codex               # Codex
npm install -g @google/gemini-cli          # Gemini CLI
```
</details>

<details>
<summary>API connection test failed?</summary>

- Ensure no trailing `/` in Base URL
- Verify API Key is correct and has credits
- Try setting a proxy at startup if you're behind a firewall
- You can still choose "write config anyway" after a failed test
</details>

<details>
<summary>How to verify the config was written?</summary>

```bash
cat ~/.claude/settings.json   # Claude Code
cat ~/.gemini/.env             # Gemini CLI
cat ~/.codex/auth.json         # Codex
```
</details>

---

## 🤝 Contributing

PRs and issues are welcome! If this tool saves you time, please give it a ⭐ — it helps others find it.

---

<div align="center">

**If this tool helped you, a ⭐ Star means the world!**

[![Star History](https://api.star-history.com/svg?repos=zxyyang/ai-cli-switch&type=Date)](https://star-history.com/#zxyyang/ai-cli-switch&Date)

Made with ❤️ · [npm](https://www.npmjs.com/package/ai-cli-switch) · [Issues](https://github.com/zxyyang/ai-cli-switch/issues)

</div>
