# Desktop Shell and Localization Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver the Windows desktop shell, first-run workspace selection, saved app preferences, and a UI translated into pt-BR and English.

**Architecture:** Tauri 2 hosts a Vue single-page frontend built with Vite and organized with Feature-Sliced Design (FSD). Frontend layers are `app`, `pages`, `widgets`, `features`, `entities`, and `shared`; imports flow only from higher layers to lower layers, and slices on the same layer do not import each other directly. Rust commands expose a narrow, typed interface for settings and workspace selection. Vue I18n handles UI strings; locale preferences persist through the Rust settings API. Course content keeps its own locale, independent of the app UI.

**Tech Stack:** Tauri 2, Rust, Vue 3, TypeScript, Vite, Pinia, Vue I18n, Vitest, and Vue Test Utils. Tauri documents Vue templates and recommends Vite for SPA frontends.

**Spec:** docs/superpowers/specs/2026-10-27-learningapp-design.md

**Dependency versions:** At implementation time, resolve the newest stable compatible releases for every direct dependency, excluding prereleases. Keep Tauri on stable 2.x while Tauri 3 remains prerelease; align `tauri`, `tauri-build`, `@tauri-apps/api`, CLI, and plugin versions. Record exact resolved versions in manifests and commit both lockfiles. See docs/superpowers/plans/README.md for the dated version check.

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

### Task 1: Create the Tauri and Vue application shell

**Files:**
- Create: package.json, pnpm-lock.yaml, vite.config.ts, tsconfig.json
- Create: index.html, src/main.ts, src/app/App.vue, src/app/App.spec.ts
- Create: src/app/providers/index.ts, src/entities/app-settings/model/store.ts, src/entities/app-settings/model/store.spec.ts
- Create: src-tauri/Cargo.toml, src-tauri/src/lib.rs, src-tauri/src/main.rs, src-tauri/tauri.conf.json
- Create: .gitignore, LICENSE, CONTENT-LICENSE, README.md

**Interfaces:**
- Produces: a Windows Tauri app with a Vue root, Pinia initialized by an app provider, typed settings entity store, test command, build command, MIT code license, and CC BY 4.0 content license.
- Consumes: none.

- [ ] Step 1: Write App.spec.ts asserting that the initial window renders the LearningApp shell and a visible main navigation region.
- [ ] Step 2: Run pnpm test --run src/app/App.spec.ts and confirm it fails because the application shell is missing.
- [ ] Step 3: Check the latest stable compatible versions, then scaffold Tauri 2 with Vue, TypeScript, and Vite; add Pinia, Vitest, and Vue Test Utils; initialize Pinia through the app provider and implement the smallest shell that passes the test.
- [ ] Step 4: Run pnpm test --run src/app/App.spec.ts and pnpm tauri dev; confirm the test passes and the desktop window opens.
- [ ] Step 5: Commit as feat: scaffold desktop shell.

### Task 2: Add pt-BR and English UI localization

**Files:**
- Create: src/i18n/index.ts, src/locales/pt-BR/common.json, src/locales/en/common.json
- Modify: src/main.ts, src/app/App.vue, src/entities/app-settings/model/store.ts
- Create: src/shared/i18n/i18n.spec.ts, src/app/App.locale.spec.ts

**Interfaces:**
- Produces: AppLocale = pt-BR | en; `shared/i18n` exports `initializeI18n(initialLocale: AppLocale)`; `pages` and `widgets` consume translation namespaces for shell copy.
- Consumes: Task 1 Vue and test setup.

- [ ] Step 1: Write tests named detectsSystemLocale, manualLocaleOverridesSystem, resolvesUnsupportedLocale, and changesAllShellLabels; assert en-US resolves to en, pt-BR remains pt-BR, unsupported locales fall back to pt-BR, a saved choice overrides system detection, and changing locale updates all shell labels.
- [ ] Step 2: Run pnpm test --run src/shared/i18n/i18n.spec.ts src/app/App.locale.spec.ts and confirm the tests fail.
- [ ] Step 3: Implement the bundled translation catalogs and Vue I18n setup with language codes pt-BR and en; keep the chosen locale in the Pinia settings store and persist it through the Rust settings API.
- [ ] Step 4: Run the localization tests and pnpm test --run; confirm all UI labels use keys and both catalogs cover the same required keys.
- [ ] Step 5: Commit as feat: localize desktop shell.

### Task 3: Persist locale and select a workspace folder

**Files:**
- Create: src-tauri/src/settings.rs, src-tauri/src/commands/settings.rs
- Create: src-tauri/src/commands/workspace.rs, src-tauri/src/error.rs
- Create: src/shared/api/settings.ts, src/shared/api/workspace.ts
- Create: src/pages/settings/ui/SettingsPage.vue, src/features/select-workspace/ui/WorkspacePicker.vue
- Create: matching Rust and Vue tests.

**Interfaces:**
- Rust types: AppLocale { PtBr, En } serialized as pt-BR or en; AppSettingsDto { locale: AppLocale, workspace_root: Option<String> }.
- FSD: settings route belongs to `pages/settings`; selecting a workspace is the `features/select-workspace` slice; typed IPC clients belong to `shared/api`; persisted settings belong to `entities/app-settings`.
- Rust commands: get_app_settings() -> Result<AppSettingsDto, AppError>; update_app_settings(settings: AppSettingsDto) -> Result<AppSettingsDto, AppError>; select_workspace_directory() -> Result<Option<String>, AppError>.
- Frontend wrappers: settingsApi.get(): Promise<AppSettingsDto>, settingsApi.update(settings: AppSettingsDto): Promise<AppSettingsDto>, workspaceApi.selectDirectory(): Promise<string | null>.
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

- [ ] Step 1: Configure the Tauri NSIS setup executable and document the local release command.
- [ ] Step 2: Run pnpm test --run, cargo test --manifest-path src-tauri/Cargo.toml, and pnpm tauri build on Windows; confirm a Windows setup executable is produced.
- [ ] Step 3: Commit as build: add Windows installer workflow.
