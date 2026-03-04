<div align="center">

<img src="assets/demo.png" alt="ai-cli-switch 데모" width="720" />

<h1>⚡ ai-cli-switch</h1>

<p><strong>모든 AI CLI 도구를 한 번에 설정하세요</strong></p>
<p>Claude Code · Codex · Gemini CLI · OpenCode · OpenClaw — 30초면 완료</p>
<p>공식 API, 릴레이 서비스, 자체 프록시 — 모든 Base URL 지원</p>

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

## ✨ 왜 ai-cli-switch인가?

- 😩 Claude Code, Codex, Gemini 설정 파일 위치를 매번 검색하시나요?
- 🔑 API 키를 입력했는데 형식이 틀려서 동작이 안 되나요?
- 🌏 해외 API에 접근하기 위해 프록시를 사용해야 하나요?

**ai-cli-switch로 이 모든 문제를 해결하세요.** 대화형 안내로 30초 만에 설정 완료.

---

## 🚀 빠른 시작

```bash
npx ai-cli-switch
```

> 설치 불필요. Node.js >= 18만 있으면 됩니다.

전역 설치:

```bash
npm install -g ai-cli-switch
ai-cli-switch
```

---

## 🛠️ 지원 도구

| 도구 | 설명 | 기본 Base URL | 설정 파일 |
|------|------|---------------|-----------|
| **Claude Code** | Anthropic 공식 AI 코딩 CLI | `https://api.anthropic.com` | `~/.claude/settings.json` |
| **Codex** | OpenAI 공식 CLI | `https://api.openai.com/v1` | `~/.codex/auth.json` |
| **Gemini CLI** | Google Gemini 터미널 도구 | `https://generativelanguage.googleapis.com` | `~/.gemini/.env` |
| **OpenCode** | 오픈소스 AI 코딩 어시스턴트 | 모델에 따라 다름 | `~/.config/opencode/opencode.json` |
| **OpenClaw** | 오픈소스 AI 코딩 어시스턴트 | 모델에 따라 다름 | `~/.openclaw/openclaw.json` |

---

## 🌐 Base URL 예시

| 시나리오 | Base URL 예시 |
|----------|---------------|
| Anthropic 공식 | `https://api.anthropic.com` |
| OpenAI 공식 | `https://api.openai.com/v1` |
| Google Gemini 공식 | `https://generativelanguage.googleapis.com` |
| 로컬 프록시 | `http://127.0.0.1:8080` |
| 커스텀 API 서버 | `https://your-api.example.com/v1` |

---

## 📋 사용 흐름

```
$ npx ai-cli-switch

  1. [선택] 네트워크 프록시 설정
  2. 설치된 AI CLI 도구 자동 감지
  3. 설정할 도구 선택
  4. 모델 제공자 선택 (OpenCode/OpenClaw용)
  5. Base URL 입력 (기본값 수정 가능)
  6. API Key 입력 (마스킹 처리)
  7. API 연결 테스트 자동 실행
  8. 설정 파일 저장 (기존 파일 자동 백업)
  9. 자체 검증 ✅
```

---

## 🔒 보안

- **API Key 비노출** — 입력 시 완전히 마스킹, 로그 기록 없음
- **원자 쓰기** — 실패 시 기존 설정 파일 손상 없음
- **자동 백업** — 매 저장 전 `*.bak.{timestamp}` 형식으로 백업
- **딥 머지** — 기존 설정을 유지하고 키 관련 필드만 업데이트

---

## ❓ 자주 묻는 질문

<details>
<summary>"설치된 AI CLI 도구가 없습니다" 오류</summary>

도구를 먼저 설치하세요:

```bash
npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex
npm install -g @google/gemini-cli
```
</details>

<details>
<summary>API 연결 테스트 실패 시</summary>

- Base URL 끝에 `/` 없는지 확인
- API Key 유효성 및 잔액 확인
- 방화벽 환경이라면 프록시 설정 필요
- 테스트 실패 후에도 "설정 저장" 선택 가능
</details>

---

## 🤝 기여하기

PR과 Issue 환영합니다! 유용하셨다면 ⭐ Star를 눌러주세요.

---

<div align="center">

**유용하게 사용하셨다면 ⭐ Star로 응원해주세요!**

Made with ❤️ · [npm](https://www.npmjs.com/package/ai-cli-switch) · [Issues](https://github.com/zxyyang/ai-cli-switch/issues)

</div>
