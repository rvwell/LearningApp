# LearningApp Implementation Plan Index

The approved product spec is split into three plans so each subsystem has a reviewable deliverable.

## Recommended order

1. [Desktop shell and localization](2026-10-27-desktop-shell-localization.md) — Tauri app shell, pt-BR/en UI, local settings, and workspace picker.
2. [Learning packs and Rust trail](2026-10-27-learning-packs-rust-trail.md) — language-neutral course packages, local pack import, independent projects, progress, and the initial Rust content.
3. [Local checks and AI review](2026-10-27-local-checks-ai-review.md) — declared checks, code selection and preview, OpenAI sign-in, and read-only review.

The approved spec and plans use Tauri 2 with a Vue 3 + TypeScript + Vite + Pinia frontend and Rust backend. The frontend follows Feature-Sliced Design (FSD): `app`, `pages`, `widgets`, `features`, `entities`, and `shared` layers, with imports flowing only from higher layers to lower layers. Slices expose public entry points for cross-slice imports. Rust stays organized by backend domain.

Use the newest stable, mutually compatible release of every direct dependency when implementation begins; exclude alpha, beta, and release-candidate versions. Keep Tauri on its current stable major (2.x) unless a later major is stable and compatible. Resolve the npm packages and Rust crates together, record exact versions in `package.json`/`Cargo.toml`, and commit `pnpm-lock.yaml` and `Cargo.lock`. Recheck the Tauri core, CLI, API, and plugins as one compatible set before scaffolding. This avoids freezing a “latest” list that becomes stale before implementation.

Version check on 2026-10-27: Tauri 2.12.5 is the latest stable Rust runtime; Tauri 3 is still alpha. The newest registry versions found for the planned dependencies were:

- Tauri: Rust `tauri` 2.12.5, `tauri-build` 2.7.4, npm `@tauri-apps/api` 2.12.4 and `@tauri-apps/cli` 2.12.4; dialog plugin 2.8.3 and SQL plugin 2.6.0.
- Frontend: Vue 3.5.44, Vite 8.3.5, TypeScript 7.0.2, Pinia 4.1.0, Vue I18n 11.4.16, Vitest 5.0.5, Vue Test Utils 2.5.1, and `@vitejs/plugin-vue` 6.0.10.
- Other planned Rust crates: serde 1.0.229, serde_json 1.0.154, reqwest 0.13.5, tokio 1.54.1, and jsonschema 0.60.2.

The Tauri 2.12.5 Rust crate requires at least Rust 1.90. This is a dated reference; recheck the latest stable versions and compatibility at implementation time, then record the selected versions and lockfiles.

The Tauri documentation recommends Vite for SPA frontends and documents Windows installers and scoped capabilities. Vue I18n provides UI localization; Pinia provides typed client-side stores, while local persistence remains in the backend. Sources:

- https://v2.tauri.app/start/frontend/
- https://v2.tauri.app/distribute/windows-installer/
- https://v2.tauri.app/plugin/shell/
- https://vue-i18n.intlify.dev/
- https://pinia.vuejs.org/introduction.html
- https://feature-sliced.design/docs/get-started/overview
- https://v2.tauri.app/release/
- https://crates.io/crates/tauri
- https://developers.openai.com/siwc/token-sharing-open-source
