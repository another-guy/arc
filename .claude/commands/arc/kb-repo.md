---
name: arc:kb-repo
description: Generate a detailed knowledge base article for a single repository. Intended for platform/core repos identified by arc:kb-generate. Output goes to knowledge/<product>/<repo>.md.
---

Generate a detailed knowledge base article for a single repository. Each invocation starts with a focused context — do not carry over analysis from previous repos.

## Usage

```
/arc:kb-repo repos/<product>/<repo-name>
```

`$ARGUMENTS` must be the path to the repo directory (e.g. `repos/platform/auth-service`).

## Before you start

1. Verify `$ARGUMENTS` is provided and the path exists. If not, stop: "Provide the repo path as an argument, e.g. `/arc:kb-repo repos/platform/auth-service`."
2. Parse `<product>` and `<repo-name>` from the path.
3. Determine the output path: `knowledge/<product>/<repo-name>.md`. Create `knowledge/<product>/` if it does not exist.
4. If the output file already exists and `$ARGUMENTS` does not end with `--force`, ask: "A KB article already exists for this repo. Regenerate it?"
5. If `.env.arc` exists, load it into the environment.

---

## Analysis

Read the following from the repo. Work through them in order — stop reading early if context is getting heavy, and note what was omitted.

**Tier 1 — Always read** (lightweight, high signal):
- `README.md` (or `README.rst`, `README.adoc`)
- `CONTRIBUTING.md`, `ARCHITECTURE.md`, `DESIGN.md`, `SECURITY.md` if present at repo root
- All markdown files in `docs/`, `architecture/`, `rfcs/`, `decisions/`, `adr/`, `design/`, `wiki/` directories — these are the highest-priority source; a human already synthesized them
- Dependency manifest (`package.json`, `go.mod`, `*.csproj`, `pom.xml`, etc.)
- Top-level directory listing (names only, not contents)

**Tier 2 — Read if context allows** (moderate weight):
- Entry point file(s): `main.*`, `index.*`, `Program.*`, `app.*`, `server.*`
- Public interface definitions: `*.interface.*`, `*contract*`, `*api*`, `*schema*`, `*proto`, `*types.*`
- Configuration files: `*.config.*`, `appsettings*.json`, `.env.example`
- CI/CD definition: `.github/workflows/*.yml`, `azure-pipelines.yml`, `Jenkinsfile`

**Tier 3 — Sample only** (heavy, use sparingly):
- Test files: read 2–3 test files to understand tested behaviors and usage patterns
- Source files in key subdirectories: read 1–2 files per subdirectory that looks architecturally significant

Do not read: build output, lock files (`package-lock.json`, `yarn.lock`, `go.sum`), generated code, binary assets.

---

## Article structure

Write `knowledge/<product>/<repo-name>.md` with the following sections. Omit any section where no meaningful information was found — do not write placeholder stubs.

```markdown
# <repo-name>

> One-sentence description of what this repo does and why it exists.

## Role in the System

What problem this repo solves. Who depends on it. Where it sits in the dependency graph relative to other platform repos (cross-reference `knowledge/PLATFORM-REPOS.md` if applicable).

## Public Interface

Key APIs, events, contracts, or exports this repo exposes to consumers. Focus on what a developer using this repo needs to know, not implementation details.

## Architecture

Internal design: significant patterns, layers, or subsystems. Why the structure is the way it is (where knowable from code or docs).

## How to Work With This Repo

Setup, configuration, and the most common development tasks (build, test, run locally). Extracted from README and CI config.

## Key Conventions

Patterns specific to this repo that differ from workspace-wide standards — naming, error handling, testing approach, config management.

## Dependencies

What this repo depends on (notable external or internal dependencies).
What depends on this repo (cross-reference `knowledge/PLATFORM-REPOS.md`).

## Known Constraints and Gotchas

Anything non-obvious that would surprise a developer working with this repo: known limitations, historical decisions, fragile areas, or things that look wrong but are intentional.

## Sources

| Source | Type | Notes |
|--------|------|-------|
| `repos/<product>/<repo>/docs/ARCHITECTURE.md` | Local doc | |
| https://... | Confluence | |
| `repos/<product>/<repo>/src/example.ts:42` | Code | ⚠️ Contradicts design doc above |
```

**Rules for the Sources table**:
- List every source consulted, in the order it was read.
- Include a code file reference **only** when it is the sole source for a claim, or when it **contradicts** a design document — mark contradictions with ⚠️.
- Do not cite code for things already covered by a doc.

---

## After writing

Tell the user:
- Path of the generated article
- What was omitted (if any Tier 2 or Tier 3 content was skipped due to context)
- If more platform repos are queued in `knowledge/PLATFORM-REPOS.md`: "Next: `/arc:kb-repo repos/<product>/<next-repo>`"

Recommend running `/compact` before invoking `arc:kb-repo` for the next repo, to start each repo analysis with a clean context.
