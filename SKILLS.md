# Arc Skills Catalog

Arc provides five core skills for bootstrapping and maintaining an engineering workspace. Run them in the order listed below when onboarding to a new company.

---

## arc:scaffold

**Usage**: `/arc:scaffold`

Creates the workspace skeleton in the current directory. Safe to re-run — skips any file that already exists.

**Creates**:
- `repos/` — root directory for all cloned repositories
- `knowledge/` with stubs: `CLAUDE.md`, `ARCHITECTURE.md`, `CODING-STANDARDS.md`, `SECURITY.md`
- `arc.config.json` — workspace configuration (version-controlled)
- `repo-list.json` — repository list for `arc:workspace-sync`
- `CLAUDE.md` — workspace root context for Claude Code
- `.claude/settings.local.json` — stub for MCP server configuration
- `.claudeignore` — excludes build outputs, `node_modules/`, etc. from CC's view
- `.gitignore` — starter ignore file

**Prerequisites**: none — this is always the first skill to run.

---

## arc:configure

**Usage**: `/arc:configure`

Interactive setup for three data source categories: **docs** (Confluence, Notion, etc.), **tickets** (Jira, Linear, etc.), and **code_hosting** (GitHub, GitLab, etc.). For each, offers an MCP server integration or CLI fallback with optional PAT setup.

**Modifies**:
- `arc.config.json` — records tool choices and integration method
- `.env.arc` — stores access tokens (gitignored; created if absent)
- `.env.arc.example` — committed empty-values template kept in sync
- `.claude/settings.local.json` — adds `mcpServers` entries when MCP is chosen

Re-runnable: reads existing config and offers to skip already-configured categories.

**Prerequisites**: `arc:scaffold` (so `arc.config.json` exists).

---

## arc:workspace-sync

**Usage**: `/arc:workspace-sync`

Clones all repos in `repo-list.json` that don't exist locally, and pulls repos that do exist and are clean. Never touches repos with uncommitted changes — those are skipped with a warning.

**Creates / modifies**:
- `repos/<product>/<name>/` for each repo
- `repos/<product>/CLAUDE.md` stub when a product directory is first created
- Adds `repos/` to `.gitignore`

**Report** (printed after sync):

| Status | Meaning |
|--------|---------|
| ✅ Cloned | Repo did not exist; was cloned successfully |
| 🔄 Synced | Repo existed and was clean; pulled latest |
| ⚠️ Skipped | Repo had uncommitted changes; left untouched |
| ❌ Failed | Clone or pull encountered an error |

**Prerequisites**: `arc:configure` with `code_hosting` configured; repos added to `repo-list.json`.

---

## arc:kb-generate

**Usage**: `/arc:kb-generate [--force]`

Multi-phase knowledge base generation. Reads manifests, local docs, and external sources; writes KB files incrementally. Designed to be resumable after `/compact` — skips existing files unless `--force` is passed.

**Phases**:

| Phase | Output |
|-------|--------|
| 1 — Dependency graph | `knowledge/PLATFORM-REPOS.md` (platform repos in topological order) |
| 2 — Workspace KB | `knowledge/ARCHITECTURE.md`, `knowledge/CODING-STANDARDS.md`, `knowledge/SECURITY.md` |
| 3 — Product context | `repos/<product>/CLAUDE.md` (one per product directory) |
| 4 — Tickets enrichment | Appends `## Recent Changes` to relevant KB files (if tickets source is configured) |

Each KB file ends with a `## Sources` table listing every source consulted.

**Final step**: updates `knowledge/CLAUDE.md` to route to all generated files.

**Prerequisites**: `arc:workspace-sync` complete (repos must be cloned locally).

---

## arc:kb-repo

**Usage**: `/arc:kb-repo repos/<product>/<name> [--force]`

Deep-documents a single repository. Intended for platform/core repos identified by `arc:kb-generate`. Each invocation should start with a fresh context — run `/compact` before invoking for each repo.

**Creates**: `knowledge/<product>/<name>.md`

**Reading tiers**:
- **Tier 1** (always): README, design docs, manifests, top-level directory listing
- **Tier 2** (if context allows): entry points, public interfaces, config files, CI definitions
- **Tier 3** (sample only): test files (2–3), key source files (1–2 per significant directory)

**Article sections**: Role in the System, Public Interface, Architecture, How to Work With This Repo, Key Conventions, Dependencies, Known Constraints and Gotchas, Sources.

**Prerequisites**: repo exists at the given path; `knowledge/PLATFORM-REPOS.md` exists to cross-reference dependency order.
