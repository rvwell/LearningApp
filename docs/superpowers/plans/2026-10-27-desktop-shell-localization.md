# Desktop Shell and Localization Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver the Windows desktop shell, first-run workspace selection, saved app preferences, and a UI translated into pt-BR and English.

**Architecture:** Tauri 2 hosts a React single-page frontend built with Vite. Rust commands expose a narrow, typed interface for settings and workspace selection. The UI strings use react-i18next; the selected app locale is saved locally. Course content keeps its own locale, independent of the app UI.

**Tech Stack:** Tauri 2, Rust, React, TypeScript, Vite, react-i18next. Tauri recommends Vite for SPA frontends; react-i18next is the maintained React integration for i18next.

**Spec:** docs/superpowers/specs/2026-10-27-learningapp-design.md

## Global Constraints

- First platform: Windows 10/11 x64, distributed by installer.
- The interface supports pt-BR and en from v1.
- The first complete Rust trail is pt-BR; changing the UI locale does not translate lessons.
- The app is not an IDE and does not provide an editor for solving exercises.
- Workspace selection is explicit; app settings and progress remain local.
- The project is open source under MIT; authored lessons use CC BY 4.0.

## Review Focus

- Missing or invalid saved locale resolves to a supported default; test settings-load fallback.
- Changing locale updates all visible shell copy without restarting; test navigation, buttons, errors, and settings.
- Course language remains pt-BR while the app UI is English; test locale independence.
- Workspace paths containing spaces and non-ASCII characters round-trip; test folder selection and persistence.
- Missing or unreadable app settings do not prevent first launch; test recovery to defaults.

---

### Task 1: Create the Tauri and React application shell

**Files:**
- Create: package.json, pnpm-lock.yaml, vite.config.ts, tsconfig.json
- Create: index.html, src/main.tsx, src/app/App.tsx, src/app/App.test.tsx
- Create: src-tauri/Cargo.toml, src-tauri/src/lib.rs, src-tauri/src/main.rs, src-tauri/tauri.conf.json
- Create: .gitignore, LICENSE, CONTENT-LICENSE, README.md

**Interfaces:**
- Produces: a Windows Tauri app with a React root, test command, build command, MIT code license, and CC BY 4.0 content license.
- Consumes: none.

- [ ] Step 1: Write App.test.tsx asserting that the initial window renders the LearningApp shell and a visible main navigation region.
- [ ] Step 2: Run pnpm test --run src/app/App.test.tsx and confirm it fails because the application shell is missing.
- [ ] Step 3: Scaffold Tauri 2 with React, TypeScript, and Vite; add Vitest and Testing Library; implement the smallest shell that passes the test.
- [ ] Step 4: Run pnpm test --run src/app/App.test.tsx and pnpm tauri dev; confirm the test passes and the desktop window opens.
- [ ] Step 5: Commit as feat: scaffold desktop shell.

### Task 2: Add pt-BR and English UI localization

**Files:**
- Create: src/i18n/index.ts, src/locales/pt-BR/common.json, src/locales/en/common.json
- Modify: src/main.tsx, src/app/App.tsx
- Create: src/i18n/i18n.test.ts, src/app/App.locale.test.tsx

**Interfaces:**
- Produces: AppLocale = pt-BR | en; initializeI18n(initialLocale: AppLocale); translation namespaces for common shell copy.
- Consumes: Task 1 React and test setup.

- [ ] Step 1: Write tests named resolvesSupportedLocale and changesAllShellLabels; assert unsupported locale falls back to pt-BR and changing locale updates all shell labels.
- [ ] Step 2: Run pnpm test --run src/i18n/i18n.test.ts src/app/App.locale.test.tsx and confirm the tests fail.
- [ ] Step 3: Implement the bundled translation catalogs and react-i18next setup with language codes pt-BR and en.
- [ ] Step 4: Run the two localization tests and pnpm test --run; confirm all UI labels use keys and both catalogs cover the same required keys.
- [ ] Step 5: Commit as feat: localize desktop shell.

### Task 3: Persist locale and select a workspace folder

**Files:**
- Create: src-tauri/src/settings.rs, src-tauri/src/commands/settings.rs
- Create: src-tauri/src/commands/workspace.rs, src-tauri/src/error.rs
- Create: src/api/settings.ts, src/api/workspace.ts
- Create: src/features/settings/SettingsView.tsx, src/features/onboarding/WorkspacePicker.tsx
- Create: matching Rust and React tests.

**Interfaces:**
- Rust types: AppLocale { PtBr, En }; AppSettings { locale: AppLocale, workspace_root: Option<PathBuf> }.
- Rust commands: get_app_settings() -> Result<AppSettings, AppError>; update_app_settings(settings: AppSettings) -> Result<AppSettings, AppError>; select_workspace_directory() -> Result<Option<PathBuf>, AppError>.
- Frontend wrappers: settingsApi.get(), settingsApi.update(settings), workspaceApi.selectDirectory().
- Consumes: Task 2 localization and Task 1 Tauri commands.

- [ ] Step 1: Write settings tests for defaults, persistence round-trip, corrupt-file recovery, and non-ASCII workspace paths.
- [ ] Step 2: Run cargo test --manifest-path src-tauri/Cargo.toml settings and confirm the tests fail.
- [ ] Step 3: Implement a small local settings store under the Tauri app-config directory and a native directory picker; never create course projects at this step.
- [ ] Step 4: Write frontend tests that choosing a directory updates the displayed path and that changing locale persists after reload.
- [ ] Step 5: Run cargo test --manifest-path src-tauri/Cargo.toml and pnpm test --run; confirm all cases pass.
- [ ] Step 6: Commit as feat: persist app settings and workspace selection.

### Task 4: Prepare the Windows installer and release checks

**Files:**
- Modify: src-tauri/tauri.conf.json, README.md
- Create: .github/workflows/windows.yml

**Interfaces:**
- Produces: a release workflow that builds the Windows installer and verifies the frontend and Rust test suites.
- Consumes: Tasks 1–3.

- [ ] Step 1: Add workflow configuration and a documented local release command.
- [ ] Step 2: Run pnpm test --run, cargo test --manifest-path src-tauri/Cargo.toml, and pnpm tauri build on Windows; confirm a Windows installer artifact is produced.
- [ ] Step 3: Commit as build: add Windows installer workflow.
