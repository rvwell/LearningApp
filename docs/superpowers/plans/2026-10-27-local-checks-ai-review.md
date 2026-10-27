# Local Checks and AI Review Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Let learners run approved local checks and request an OpenAI review of selected files, receiving streamed explanations and suggestions without the agent modifying files.

**Architecture:** The Tauri Rust backend owns process execution, OAuth credentials, safe file reading, and the Responses API client. The frontend requests analysis only from the explicit Analyze Exercise action, previews the exact context, and renders a streamed review. The first provider uses the official Sign in with ChatGPT flow for eligible open-source apps; alternate hosted and local providers are future work.

**Tech Stack:** Tauri 2 Rust commands, std::process::Command with argv and no shell, reqwest, serde, official Sign in with ChatGPT OAuth flow, Windows Credential Manager, React and TypeScript.

**Spec:** docs/superpowers/specs/2026-10-27-learningapp-design.md

## Global Constraints

- The agent only explains and suggests; it never edits files or executes commands.
- Review begins only after the learner explicitly selects Analyze Exercise.
- The learner sees and approves files and check output before any external request.
- The first provider is OpenAI Sign in with ChatGPT; no API-key fallback in v1.
- If the plan is ineligible, exhausted, or unavailable, AI help stops and the learner can continue offline.
- The initial request uses eligible Responses API text input with store disabled and streaming enabled, subject to current documented limitations.
- Community checks are data declarations; no shell scripts or AI-authored commands are accepted.
- Credential material is stored using Windows secure storage and is never logged.
- Other providers and truly local models are future opt-in adapters; no silent provider switch sends code elsewhere.

## Review Focus

- A canceled review sends no files and consumes no request; test cancel before submission.
- Secret/generated files remain excluded even if adjacent to selected code; test .env, .git, target, and explicit selection handling.
- A malicious or out-of-root path in a package cannot be read or run; test canonical path containment.
- OAuth denial, expired tokens, quota exhaustion, and service errors produce clear offline-usable states; test each provider outcome.
- Partial streaming, malformed response events, and network interruption do not show a false completed review; test stream state transitions.

---

### Task 1: Implement declared local checks with restricted process execution

**Files:**
- Create: src-tauri/src/checks/model.rs, src-tauri/src/checks/runner.rs
- Create: src-tauri/src/commands/checks.rs
- Create: src-tauri/tests/checks/runner.rs, src-tauri/tests/checks/path_safety.rs

**Interfaces:**
- Types: CheckSpec { id, executable, args, working_directory }; CheckResult { id, exit_code, stdout, stderr, duration_ms }.
- Function: run_declared_checks(pack: &ValidatedTrail, exercise_id: &str, project_root: &Path, approval: CheckApproval) -> Result<Vec<CheckResult>, CheckError>.
- Run executable plus argv directly with std::process::Command; never invoke cmd.exe, PowerShell, bash, or a shell string.
- Project path must resolve under the selected workspace; the user confirms checks from community packs before first execution.

- [ ] Step 1: Write runner tests for cargo check success/failure, output capture, cancellation, unknown check, and project path outside workspace.
- [ ] Step 2: Run cargo test --manifest-path src-tauri/Cargo.toml checks and confirm the tests fail.
- [ ] Step 3: Implement the allowlisted process runner with timeout, output-size limit, and bounded execution directory.
- [ ] Step 4: Run cargo test --manifest-path src-tauri/Cargo.toml checks; confirm commands execute only the declared executable and argv.
- [ ] Step 5: Commit as feat: run declared local checks.

### Task 2: Build explicit review context selection and preview

**Files:**
- Create: src-tauri/src/review/context.rs, src-tauri/src/commands/review_context.rs
- Create: src/features/review/ReviewContextDialog.tsx, src/features/review/ReviewContextDialog.test.tsx
- Create: src-tauri/tests/review/context.rs

**Interfaces:**
- Types: ReviewContext { files: Vec<ReviewFile>, checks: Vec<CheckResult> }; ReviewFile { relative_path, content }.
- Function: build_review_context(project_root: &Path, selected_paths: &[PathBuf], checks: &[CheckResult]) -> Result<ReviewContext, ContextError>.
- Exclusions: target, .git, .env variants, binary files, files outside project root, and files above the documented per-file/total size caps.

- [ ] Step 1: Write context tests for explicit included files, default sensitive-file exclusions, binary/oversize rejection, symlink escape, and root path checks.
- [ ] Step 2: Run cargo test --manifest-path src-tauri/Cargo.toml review::context and confirm tests fail.
- [ ] Step 3: Implement context construction and a frontend preview with file names and check output.
- [ ] Step 4: Add cancel test asserting no provider call occurs when the learner closes the preview.
- [ ] Step 5: Run targeted Rust and React tests; confirm the exact preview selection is the submitted context.
- [ ] Step 6: Commit as feat: preview code before AI review.

### Task 3: Add ChatGPT sign-in and secure token storage

**Files:**
- Create: src-tauri/src/providers/openai/oauth.rs, token_store.rs, auth_commands.rs
- Create: src/features/settings/ProviderSettings.tsx
- Create: src-tauri/tests/providers/openai/oauth.rs, token_store.rs
- Modify: src-tauri/Cargo.toml, src-tauri/src/lib.rs

**Interfaces:**
- Provider status: NotConnected | Connected { account_label } | NeedsReauthorization | UsageUnavailable.
- Commands: begin_chatgpt_sign_in() -> Result<AuthStart, AuthError>; get_provider_status() -> Result<ProviderStatus, AuthError>; disconnect_chatgpt() -> Result<(), AuthError>.
- OAuth uses system browser, PKCE, state validation, registered client flow for open-source local apps, and secure Windows token storage.

- [ ] Step 1: Write tests for OAuth state mismatch, denied consent, expired token, token refresh, secure-store round-trip, and disconnect clearing credentials.
- [ ] Step 2: Run cargo test --manifest-path src-tauri/Cargo.toml providers::openai::oauth and confirm the tests fail.
- [ ] Step 3: Implement the official OAuth flow from current OpenAI developer docs; keep endpoints, scopes, host identifiers, and supported fields isolated behind OpenAiProvider.
- [ ] Step 4: Run OAuth tests with a local HTTP test server; confirm no credential values enter logs or frontend diagnostics.
- [ ] Step 5: Commit as feat: connect ChatGPT account.

### Task 4: Send Responses API requests and handle streaming/errors

**Files:**
- Create: src-tauri/src/providers/openai/client.rs, stream.rs, errors.rs
- Create: src-tauri/tests/providers/openai/responses.rs, stream.rs
- Modify: src-tauri/src/providers/openai/mod.rs

**Interfaces:**
- Trait: AiProvider { analyze(context: ReviewContext) -> ReviewStream }.
- Review events: Started, TextDelta(String), Completed(ReviewSummary), Failed(ReviewFailure).
- The OpenAI request sends the complete approved context in input, sets store false and stream true, and uses only fields/tools permitted by current plan-usage docs.

- [ ] Step 1: Write mock-server tests for request body privacy flags, selected file payload, streaming deltas, normal completion, quota exhaustion, provider ineligibility, and malformed streams.
- [ ] Step 2: Run cargo test --manifest-path src-tauri/Cargo.toml providers::openai::responses and confirm tests fail.
- [ ] Step 3: Implement the streaming Responses API client behind AiProvider; do not use conversation persistence or unsupported hosted tools.
- [ ] Step 4: Run provider tests against the mock server and a manual authorized smoke request; do not treat partial output as completion.
- [ ] Step 5: Commit as feat: stream OpenAI exercise reviews.

### Task 5: Render review results without write capabilities

**Files:**
- Create: src/features/review/AnalyzeExerciseButton.tsx, ReviewProgress.tsx, ReviewResult.tsx
- Create: src/features/review/ReviewFlow.test.tsx
- Modify: src/features/learning/ExerciseCard.tsx, src-tauri/capabilities/default.json

**Interfaces:**
- Frontend flow: select check set, run checks, preview approved context, confirm send, render stream, show completed result or recoverable error.
- No file-write IPC command is exposed to the review feature.

- [ ] Step 1: Write UI tests for button-triggered review, user cancel, streaming states, completed suggestions, quota exhaustion, and no-AI offline continuation.
- [ ] Step 2: Run pnpm test --run src/features/review/ReviewFlow.test.tsx and confirm tests fail.
- [ ] Step 3: Connect UI to the checks, context, OAuth, and provider APIs.
- [ ] Step 4: Run all Rust and frontend tests; manually verify the review path never changes exercise files.
- [ ] Step 5: Commit as feat: add safe exercise review flow.
