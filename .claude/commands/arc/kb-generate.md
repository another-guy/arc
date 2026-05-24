---
name: arc:kb-generate
description: Generate workspace-level and product-level knowledge base files from docs, codebase, and tickets. Identifies platform/core repos and saves them in topological order for deep documentation via arc:kb-repo.
---

Generate the knowledge base for this workspace. Works in focused phases, writing each output file to disk immediately to preserve progress. Designed to be resumed after `/compact` — re-running skips files that already exist unless `$ARGUMENTS` is `--force`.

## Before you start

1. Verify `repos/` contains at least one cloned repository. If empty, stop: "Run `/arc:workspace-sync` first."
2. Read `arc.config.json` to know which sources are configured (`data_sources.docs`, `data_sources.tickets`, `data_sources.code_hosting`).
3. If `.env.arc` exists, load it into the environment.
4. Check which knowledge base files already exist. Unless `--force` was passed, skip regenerating existing files and tell the user which phases will be skipped.

---

## Phase 1 — Dependency graph analysis

**Goal**: identify which repos are platform/core repos (dependencies of others) vs. leaf/product repos.

For each repo under `repos/`, read only its dependency manifest file(s). Do not read source code in this phase.

Manifest files to look for (read whichever exist):
- `package.json` (Node.js) → `dependencies`, `devDependencies`
- `go.mod` (Go)
- `*.csproj` or `*.sln` (C#/.NET) → `<PackageReference>` and `<ProjectReference>`
- `pom.xml` (Java/Maven)
- `build.gradle` (Java/Kotlin/Gradle)
- `requirements.txt` or `pyproject.toml` (Python)
- `Cargo.toml` (Rust)

From the manifests, extract cross-repo dependencies (references from one repo in `repos/` to another). Build a dependency graph.

**Identify platform repos** using these signals:
- Referenced as a dependency by 3 or more other repos in the workspace
- Named with patterns suggesting shared infrastructure: `*-common`, `*-core`, `*-shared`, `*-utils`, `*-sdk`, `*-client`, `*-lib`
- Located in a product directory whose name suggests shared ownership: `platform`, `shared`, `core`, `common`, `infrastructure`, `libs`

**Topological sort**: order platform repos so that a repo's dependencies always appear before it in the list. If repo B depends on repo A, repo A comes first. This is the order in which the repos should be understood (like learning addition before multiplication, and multiplication before exponentiation).

**Write `knowledge/PLATFORM-REPOS.md`**:
```
# Platform Repositories

Repositories listed in dependency order. Each repo can be understood without knowledge of the repos that follow it.

| # | Repo | Product | Path | Dependents |
|---|------|---------|------|------------|
| 1 | common-utils | shared | `repos/shared/common-utils` | 47 repos |
| 2 | auth-core | platform | `repos/platform/auth-core` | 38 repos |

## Deep Documentation

The following repos have been selected for detailed documentation via `/arc:kb-repo`:

- [ ] (none yet — see instructions below)

---
To document a repo in depth, run: `/arc:kb-repo repos/<product>/<name>`
```

**Ask the user**: "I identified [N] platform repos. Which would you like to document in detail with `arc:kb-repo`? List the numbers or names, or say 'none' to skip."

Update the `## Deep Documentation` checklist in `knowledge/PLATFORM-REPOS.md` based on their answer.

**Context check**: after writing `PLATFORM-REPOS.md`, evaluate whether context is getting heavy. If the dependency manifest reading consumed significant context, say: "Context may be accumulating. Consider running `/compact` before I continue, then re-run `/arc:kb-generate` to resume from the next phase."

---

## Phase 2 — Workspace-level knowledge base

Generate each of the three workspace KB files. Write each file to disk immediately before moving to the next. Skip any file that already exists (unless `--force`).

**Context discipline**: do not read full source files in this phase. Read README.md files, top-level directory listings, and manifest files only. Full source reading is reserved for `arc:kb-repo`.

### 2a — ARCHITECTURE.md

Primary source: `data_sources.docs` (Confluence or configured wiki).

If docs source is configured via MCP: query for architecture decision records, system design documents, and high-level diagrams. Summarize the key architectural patterns, boundaries, and decisions.

If docs source is configured via CLI: run the CLI tool to fetch the same content.

If no docs source configured: derive architecture from README files across repos and the dependency graph from Phase 1.

Enrich with codebase signals: note where the actual repo structure confirms or contradicts the documented architecture.

Write `knowledge/ARCHITECTURE.md`.

### 2b — CODING-STANDARDS.md

Primary source: codebase (observed patterns).

Read from each product's repos: README, any `CONTRIBUTING.md` or `docs/` directory, linter config files (`.eslintrc`, `.editorconfig`, `pylintrc`, `StyleCop.json`, etc.).

Synthesize the actual coding conventions in use: naming, structure, test patterns, error handling style, dependency injection approach, etc.

If docs source has written standards: cross-reference and note any divergence.

Write `knowledge/CODING-STANDARDS.md`.

### 2c — SECURITY.md

Primary source: docs source (security policies, compliance requirements) + codebase (auth patterns, secret handling, input validation patterns observed).

If tickets source is configured: query for security-related tickets or known vulnerabilities to include as context.

Write `knowledge/SECURITY.md`.

**Context check**: after writing all three workspace KB files, evaluate context. Recommend `/compact` if needed before continuing.

---

## Phase 3 — Product-level CLAUDE.md files

For each product directory under `repos/<product>/`:

Read: README files of all repos in that product, their manifests, and any product-level docs.

Generate or update `repos/<product>/CLAUDE.md` with:
- What this product area does and its role in the overall system
- Key repos and what each is responsible for
- Product-specific conventions that differ from workspace-wide standards
- Which repos are platform repos (cross-reference `PLATFORM-REPOS.md`)

Write each `repos/<product>/CLAUDE.md` immediately after generating it.

**Context check**: after each product CLAUDE.md, evaluate context. If heavy, recommend `/compact` and note which product was just completed so the user knows where to resume.

---

## Phase 4 — Tickets enrichment (if configured)

If `data_sources.tickets` is configured:

Query for recently closed tickets, epics, or ADRs (architecture decision records). Look for:
- Decisions that changed architecture (enrich `ARCHITECTURE.md`)
- Drift between documented and implemented behavior
- Business rule changes not reflected in docs

Append an `## Recent Changes` section to relevant KB files noting significant drift or decisions. Do not rewrite existing content — append only.

---

## Final report

Print a summary of what was generated:

| File | Status |
|------|--------|
| `knowledge/PLATFORM-REPOS.md` | ✅ Generated |
| `knowledge/ARCHITECTURE.md` | ✅ Generated |
| `knowledge/CODING-STANDARDS.md` | ✅ Generated |
| `knowledge/SECURITY.md` | ✅ Generated |
| `repos/<product>/CLAUDE.md` | ✅ Generated (one row per product) |

If platform repos were selected for deep documentation:
"Run `/arc:kb-repo repos/<product>/<name>` for each selected platform repo. Recommended order matches `knowledge/PLATFORM-REPOS.md`."

If no platform repos were selected:
"Knowledge base generation complete."
