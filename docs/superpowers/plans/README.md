# LearningApp Implementation Plan Index

The approved product spec is split into three plans so each subsystem has a reviewable deliverable.

## Recommended order

1. [Desktop shell and localization](2026-10-27-desktop-shell-localization.md) — Tauri app shell, pt-BR/en UI, local settings, and workspace picker.
2. [Learning packs and Rust trail](2026-10-27-learning-packs-rust-trail.md) — language-neutral course packages, local pack import, independent projects, progress, and the initial Rust content.
3. [Local checks and AI review](2026-10-27-local-checks-ai-review.md) — declared checks, code selection and preview, OpenAI sign-in, and read-only review.

The plans use Tauri 2 with a React + TypeScript + Vite frontend and Rust backend. This is a proposed implementation stack; it does not change the approved product spec. The Tauri documentation recommends Vite for SPA frontends and documents Windows installers and scoped capabilities. react-i18next supports React and language fallback. Sources:

- https://v2.tauri.app/start/frontend/
- https://v2.tauri.app/distribute/windows-installer/
- https://v2.tauri.app/plugin/shell/
- https://react.i18next.com/
- https://developers.openai.com/siwc/token-sharing-open-source
