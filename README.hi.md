<div align="center">

<img src="assets/demo.png" alt="ai-cli-switch डेमो" width="720" />

<h1>⚡ ai-cli-switch</h1>

<p><strong>एक कमांड से सभी AI CLI टूल्स को कॉन्फ़िगर करें</strong></p>
<p>Claude Code · Codex · Gemini CLI · OpenCode · OpenClaw — 30 सेकंड में</p>
<p>किसी भी Base URL के साथ काम करता है — ऑफिशियल API, प्रॉक्सी, या सेल्फ-होस्टेड</p>

<br/>

[![npm version](https://img.shields.io/npm/v/ai-cli-switch?style=flat-square&color=ff6b6b&label=npm)](https://www.npmjs.com/package/ai-cli-switch)
[![npm downloads](https://img.shields.io/npm/dm/ai-cli-switch?style=flat-square&color=4ecdc4&label=downloads)](https://www.npmjs.com/package/ai-cli-switch)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-success?style=flat-square)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

<br/>

**🌐 Language / 语言 / 언어 / भाषा**

[🇨🇳 中文](README.md) · [🇺🇸 English](README.en.md) · [🇰🇷 한국어](README.ko.md) · [🇮🇳 हिन्दी](README.hi.md)

</div>

---

## ✨ ai-cli-switch क्यों?

- 😩 Claude Code, Codex, Gemini की config फाइल कहाँ है? हर बार Google करना पड़ता है?
- 🔑 API Key का format गलत होने से टूल काम नहीं करता?
- 🌏 API access के लिए proxy की जरूरत है लेकिन कॉन्फ़िगर कैसे करें?

**ai-cli-switch इन सभी समस्याओं को हल करता है।** Interactive guidance के साथ 30 सेकंड में setup।

---

## 🚀 Quick Start

```bash
npx ai-cli-switch
```

> Install की जरूरत नहीं। बस Node.js >= 18 चाहिए।

Global install के लिए:

```bash
npm install -g ai-cli-switch
ai-cli-switch
```

---

## 🛠️ Supported Tools

| Tool | विवरण | Default Base URL | Config File |
|------|-------|-----------------|-------------|
| **Claude Code** | Anthropic का ऑफिशियल AI coding CLI | `https://api.anthropic.com` | `~/.claude/settings.json` |
| **Codex** | OpenAI का ऑफिशियल CLI | `https://api.openai.com/v1` | `~/.codex/auth.json` |
| **Gemini CLI** | Google Gemini terminal tool | `https://generativelanguage.googleapis.com` | `~/.gemini/.env` |
| **OpenCode** | Open-source AI coding assistant | model के अनुसार | `~/.config/opencode/opencode.json` |
| **OpenClaw** | Open-source AI coding assistant | model के अनुसार | `~/.openclaw/openclaw.json` |

---

## 🌐 Base URL Examples

| Scenario | Base URL |
|----------|----------|
| Anthropic Official | `https://api.anthropic.com` |
| OpenAI Official | `https://api.openai.com/v1` |
| Google Gemini Official | `https://generativelanguage.googleapis.com` |
| Local Proxy | `http://127.0.0.1:8080` |
| Custom API Server | `https://your-api.example.com/v1` |

---

## 📋 Usage Flow

```
$ npx ai-cli-switch

  1. [Optional] Network proxy सेट करें
  2. Installed AI CLI tools auto-detect
  3. Configure करने का tool चुनें
  4. Model provider चुनें (OpenCode/OpenClaw के लिए)
  5. Base URL दर्ज करें (default बदल सकते हैं)
  6. API Key दर्ज करें (masked input)
  7. API connection test
  8. Config file लिखें (existing का auto-backup)
  9. Self-check verification ✅
```

---

## 🔒 Security

- **API Key कभी log नहीं होता** — input masked, कोई log नहीं
- **Atomic writes** — failure पर existing config सुरक्षित रहती है
- **Auto-backup** — हर save से पहले `*.bak.{timestamp}` backup
- **Deep merge** — सिर्फ key fields update होते हैं, बाकी settings safe

---

## ❓ FAQ

<details>
<summary>"कोई AI CLI tool नहीं मिला" error?</summary>

पहले tool install करें:

```bash
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
npm install -g @google/gemini-cli
```
</details>

<details>
<summary>API connection test fail हो रहा है?</summary>

- Base URL के अंत में `/` न हो
- API Key सही और valid हो
- Firewall के पीछे हैं तो proxy set करें
- Test fail के बाद भी "config save करें" option मिलेगा
</details>

---

## 🤝 Contributing

PRs और Issues का स्वागत है! अगर helpful लगा तो ⭐ Star जरूर दें।

---

<div align="center">

**अगर यह tool काम आया तो ⭐ Star से support करें!**

Made with ❤️ · [npm](https://www.npmjs.com/package/ai-cli-switch) · [Issues](https://github.com/zxyyang/ai-cli-switch/issues)

</div>
