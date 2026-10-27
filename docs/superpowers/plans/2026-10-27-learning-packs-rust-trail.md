# Learning Packs and Rust Trail Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Load community trail packages, show the initial Rust course in pt-BR, create an independent Cargo project per exercise and mini project, and save local progress.

**Architecture:** Trail packages are data-only manifests, Markdown lessons, and starter files. A validated package declares its programming language, course-content locale, project template, allowed checks, and resource paths. The app core does not assume Cargo; v1 bundles a Rust project adapter and accepts future language packages through the same package boundary.

**Tech Stack:** Rust serde/serde_json for package manifests, JSON Schema for the public package format, Markdown rendering in React, Tauri 2 file and path APIs, SQLite through the Tauri SQL plugin for progress.

**Spec:** docs/superpowers/specs/2026-10-27-learningapp-design.md

## Global Constraints

- The app supports pt-BR and en UI; the initial complete Rust trail content is pt-BR.
- Each exercise and mini project is an independent Cargo project.
- Local package sources in v1 are a folder or ZIP; no remote catalog.
- A destination collision never overwrites existing files.
- App-owned code is MIT; authored lessons are CC BY 4.0.
- roadmap.sh content and graph structures are not copied, translated, scraped, or bundled without written permission.
- Community packages are untrusted data and cannot silently execute commands.

## Review Focus

- Malformed or oversized package manifests are rejected before import; test schema, file-count, and size limits.
- ZIP entries cannot escape the chosen import directory; test traversal, absolute paths, and duplicate normalized paths.
- A destination collision preserves all existing bytes; test create-project collision behavior.
- Unsupported UI locale does not hide a pt-BR-only lesson; test independent app locale and content locale.
- A course pack cannot request an undeclared or shell-interpreted check; test manifest validation of command argv and working-directory boundaries.

---

### Task 1: Define and validate the language-neutral trail package format

**Files:**
- Create: packages/schema/trail.schema.json
- Create: src-tauri/src/packs/model.rs, src-tauri/src/packs/validator.rs
- Create: src-tauri/tests/packs/valid_pack.rs, src-tauri/tests/packs/invalid_pack.rs
- Create: docs/packages/format.md

**Interfaces:**
- Types: TrailManifest { id, title, content_locale, programming_language, version, stages }; Stage { id, title, lessons, exercises, milestones }; Exercise { id, title, starter_files, checks, references }.
- Function: validate_pack(root: &Path) -> Result<ValidatedTrail, PackValidationError>.
- The manifest declares language and locale independently, plus project-template paths and checks as executable plus argv array; no shell string field exists.
- Consumes: Task 1 desktop shell's frontend/backend bridge.

- [ ] Step 1: Write valid_pack and invalid_pack tests for a pt-BR Rust fixture, missing required fields, unsupported schema version, duplicate IDs, and path escape references.
- [ ] Step 2: Run cargo test --manifest-path src-tauri/Cargo.toml packs and confirm invalid fixtures fail validation.
- [ ] Step 3: Implement serde models, JSON Schema, and validator with bounded manifest and starter-file sizes.
- [ ] Step 4: Run the pack tests and validate the committed schema against the same valid and invalid fixtures.
- [ ] Step 5: Commit as feat: define trail package format.

### Task 2: Import local trail packages

**Files:**
- Create: src-tauri/src/packs/import.rs, src-tauri/src/commands/packs.rs
- Create: src/features/trails/ImportTrailButton.tsx, src/features/trails/TrailImportDialog.tsx
- Create: src-tauri/tests/packs/import_folder.rs, src-tauri/tests/packs/import_zip.rs
- Modify: src-tauri/src/lib.rs, src-tauri/capabilities/default.json

**Interfaces:**
- Rust command: import_trail_pack(source: PathBuf) -> Result<TrailSummary, PackImportError>.
- Supported sources: a folder or .zip file selected by the user.
- Consumes: Task 1 ValidatedTrail and schema.

- [ ] Step 1: Write import tests for valid folder and ZIP, duplicate pack ID, traversal path, corrupt ZIP, and user cancellation.
- [ ] Step 2: Run cargo test --manifest-path src-tauri/Cargo.toml packs::import and confirm tests fail.
- [ ] Step 3: Implement import into app data only after full validation; reject executable hooks and shell scripts from packages.
- [ ] Step 4: Add UI to select a source and show validation errors before the pack is installed.
- [ ] Step 5: Run pack import tests and pnpm test --run src/features/trails; confirm invalid packages are never partially installed.
- [ ] Step 6: Commit as feat: import local learning packs.

### Task 3: Generate independent projects through language adapters

**Files:**
- Create: src-tauri/src/languages/mod.rs, src-tauri/src/languages/adapter.rs
- Create: src-tauri/src/languages/rust.rs, src-tauri/src/projects/generator.rs
- Create: src-tauri/src/commands/projects.rs
- Create: src-tauri/tests/projects/generate_rust.rs, src-tauri/tests/projects/collision.rs

**Interfaces:**
- Trait: LanguageAdapter { detect_toolchain() -> ToolchainStatus; create_project(template: &ProjectTemplate, destination: &Path) -> Result<PathBuf, ProjectError> }.
- V1 adapter: RustAdapter; requires rustup stable and Cargo; initializes a binary project with Cargo stable and copies validated lesson files.
- Command: create_exercise_project(pack_id: String, exercise_id: String, parent: PathBuf) -> Result<ProjectCreationResult, ProjectError>.
- On collision, return DestinationExists without modifying the target.

- [ ] Step 1: Write generation tests asserting each exercise produces a Cargo.toml and src/main.rs that cargo metadata can load.
- [ ] Step 2: Write collision test asserting an existing marker file retains identical bytes after a failed create request.
- [ ] Step 3: Run cargo test --manifest-path src-tauri/Cargo.toml projects and confirm tests fail.
- [ ] Step 4: Implement stable Cargo discovery, project initialization, template copy, and safe path containment.
- [ ] Step 5: Run cargo test --manifest-path src-tauri/Cargo.toml projects; also run cargo metadata for a generated fixture.
- [ ] Step 6: Commit as feat: create independent exercise projects.

### Task 4: Store local progress and expose lesson/project flow

**Files:**
- Create: src/features/learning/TrailView.tsx, StageView.tsx, LessonView.tsx, ExerciseCard.tsx
- Create: src-tauri/src/progress/model.rs, src-tauri/src/progress/repository.rs, src-tauri/src/commands/progress.rs
- Create: src-tauri/migrations/001_progress.sql
- Create: React and Rust tests for lesson-language display, stage completion, and progress persistence.

**Interfaces:**
- Rust commands: get_progress(pack_id: String) -> Result<TrailProgress, AppError>; set_exercise_status(pack_id: String, exercise_id: String, status: ExerciseStatus) -> Result<TrailProgress, AppError>.
- Consumes: Tasks 1–3 and shell settings/workspace APIs from the Desktop Shell plan.

- [ ] Step 1: Write tests that save and reload progress and render a pt-BR lesson while the app shell is set to English.
- [ ] Step 2: Run the new targeted Rust and React tests and confirm they fail.
- [ ] Step 3: Implement SQLite migrations and progress commands, then connect the course UI.
- [ ] Step 4: Run all relevant tests; confirm reopening the app preserves progress and changing the UI locale leaves lesson text unchanged.
- [ ] Step 5: Commit as feat: add learning flow and progress.

### Task 5: Author the initial Rust trail

**Files:**
- Create: content/trails/rust-pt-BR/trail.json
- Create: content/trails/rust-pt-BR/stages/01-start and stages/02-fundamentals through stages/05-serialization lesson and exercise files
- Create: content/trails/rust-pt-BR/LICENSE

**Interfaces:**
- Produces: five stages: Start; Fundamentals; Essential Rust; Building Larger Programs; Serialization.
- Each stage contains about three original logic exercises and a mini-project milestone.
- Every exercise includes a goal, learner-facing instructions, starter project, expected checks, and references.
- Consumes: Task 1 schema and Tasks 2–4 import/display/generator flow.

- [ ] Step 1: Add content review checklist asserting all 15+ exercises have unique IDs, a stated learning goal, and at least one checkable outcome.
- [ ] Step 2: Run the pack validator against the complete Rust pack and confirm any missing exercise field is reported.
- [ ] Step 3: Write original pt-BR explanations and exercise prompts using official Rust documentation as references; do not copy roadmap.sh wording or graph structures.
- [ ] Step 4: Validate all starter projects with stable cargo check and cargo test.
- [ ] Step 5: Commit as content: add initial Rust learning trail.
