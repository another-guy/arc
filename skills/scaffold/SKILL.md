---
name: arc:scaffold
description: Initialize a new ARC workspace skeleton in the current directory (creates repos/, knowledge/, CLAUDE.md, arc.config.json, repo-list.json, and ignore files)
---

Initialize a new ARC workspace in the current directory.

## What you will do

Create the standard ARC workspace skeleton: knowledge base stubs, root CLAUDE.md, arc configuration, repo list, and CC/git ignore files. No product directories are created — those are managed by `arc:workspace-sync` via `repo-list.json`.

Ask no questions. Create everything immediately.

## Step 1 — Check for existing files

Before creating anything, check which of these paths already exist:
- `repos/`
- `knowledge/CLAUDE.md`
- `knowledge/ARCHITECTURE.md`
- `knowledge/CODING-STANDARDS.md`
- `knowledge/SECURITY.md`
- `.claude/settings.local.json`
- `.claudeignore`
- `.gitignore`
- `CLAUDE.md`
- `arc.config.json`
- `repo-list.json`

Skip any that already exist. Do not overwrite them.

## Step 2 — Create missing files

Create each missing file with the exact content below.

---

**`repos/`** — create empty directory.

---

**`knowledge/CLAUDE.md`**
```
# Knowledge Base

- Coding standards and conventions → `@knowledge/CODING-STANDARDS.md`
- Architecture decisions and patterns → `@knowledge/ARCHITECTURE.md`
- Security guidelines and requirements → `@knowledge/SECURITY.md`

> Run `/arc:kb-generate` to populate or refresh these files.
```

---

**`knowledge/ARCHITECTURE.md`**
```
# Architecture

> Not yet populated. Run `/arc:kb-generate` to generate this file.
```

---

**`knowledge/CODING-STANDARDS.md`**
```
# Coding Standards

> Not yet populated. Run `/arc:kb-generate` to generate this file.
```

---

**`knowledge/SECURITY.md`**
```
# Security

> Not yet populated. Run `/arc:kb-generate` to generate this file.
```

---

**`.claude/settings.local.json`** — create `.claude/` directory if it does not exist.
```json
{
  "permissions": {
    "allow": [],
    "deny": []
  }
}
```

---

**`.claudeignore`**
```
repos/**/node_modules/
repos/**/.git/
repos/**/dist/
repos/**/build/
repos/**/bin/
repos/**/obj/
repos/**/__pycache__/
repos/**/*.pyc
repos/**/*.log
```

---

**`.gitignore`**
```
# Add workspace-specific ignores here
```

---

**`CLAUDE.md`**
```
# Workspace

## Structure
- `repos/` — all repos, organized as `repos/<product>/<repo>/`
- `knowledge/` — knowledge base; see `@knowledge/CLAUDE.md` for navigation
- `repo-list.json` — source of truth for all repos in this workspace
- `arc.config.json` — arc configuration for this workspace

## Guidelines
- Check `repo-list.json` to understand what repos exist and how they're organized.
- Consult the knowledge base before making architectural or design decisions.
- Product-specific guidelines live in `repos/<product>/CLAUDE.md` when present.
```

---

**`arc.config.json`**
```json
{
  "arc_version": "1.0.0",
  "data_sources": {}
}
```

---

**`repo-list.json`**
```json
{
  "repos": []
}
```

---

## Step 3 — Report results

Print a concise summary listing:
- Each file created (with path)
- Each file skipped because it already existed (with path)

End with: "Workspace scaffold complete. Run `/arc:configure` to set up data sources and tool integrations."
