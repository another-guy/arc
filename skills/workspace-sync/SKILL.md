---
name: arc:workspace-sync
description: Clone missing and pull existing repositories defined in repo-list.json. Creates product directories and CLAUDE.md stubs as needed. Skips repos with uncommitted changes.
---

Sync all repositories defined in `repo-list.json` into the workspace. Clones repos that don't exist locally; pulls repos that do (if clean). Never touches a repo with uncommitted changes.

## Before you start

1. Verify `repo-list.json` exists. If not, stop and tell the user: "Run `/arc:scaffold` first to initialize the workspace."
2. Verify `arc.config.json` exists and has `data_sources.code_hosting` configured. If not, stop and tell the user: "Run `/arc:configure` first to configure your code hosting source."
3. If `.env.arc` exists, load it into the environment before running any git or CLI commands.
4. Ensure `repos/` is listed in `.gitignore`. If not, add it. The cloned repositories are independent git repos and must not be tracked by the workspace.

## Step 1 — Read repo-list.json

Read `repo-list.json` and collect all entries into the sync queue.

`repo-list.json` schema reference:
```json
{
  "repos": [
    {
      "name": "repo-name",
      "product": "product-name",
      "url": "https://github.com/org/repo.git"
    }
  ]
}
```

If the sync queue is empty, tell the user: "No repositories found in repo-list.json. Add repos and re-run." Stop.

## Step 2 — Determine clone command

Read `arc.config.json` → `data_sources.code_hosting.cli_tool` to decide how to clone:

- `gh`: `gh repo clone <url> repos/<product>/<name>`
- Anything else / not set: `git clone <url> repos/<product>/<name>`

## Step 3 — Sync each repo

Process repos one at a time. For each repo in the sync queue:

### 3a — Prepare product directory

If `repos/<product>/` does not exist:
- Create it.
- Create `repos/<product>/CLAUDE.md` with this content:
  ```
  # Product Context

  > Add product-specific guidelines, architecture notes, and conventions here.
  > This file is loaded by Claude Code for all repos under this product directory.
  ```

If `repos/<product>/` exists but has no `CLAUDE.md`, create the stub above.

### 3b — Clone or pull

**Repo does not exist locally** (`repos/<product>/<name>/` is absent):
- Run the clone command from Step 2.
- On success: record **✅ Cloned**.
- On failure: record **❌ Failed** with the error message from the CLI tool.

**Repo exists locally** (`repos/<product>/<name>/` is present):
- Run `git -C repos/<product>/<name> status --porcelain`.
- If output is **non-empty** (dirty working tree): record **⚠️ Skipped**, reason "Uncommitted changes". Do not touch the repo.
- If output is **empty** (clean):
  - Run `git -C repos/<product>/<name> pull`.
  - On success: record **🔄 Synced**.
  - On failure: record **❌ Failed** with the error message.

## Step 4 — Report results

Print the results table. Sort rows in this fixed order: ✅ Cloned → 🔄 Synced → ⚠️ Skipped → ❌ Failed.

| Status | Repo | Reason |
|--------|------|--------|
| ✅ Cloned | `/repos/<product>/<name>` | |
| 🔄 Synced | `/repos/<product>/<name>` | |
| ⚠️ Skipped | `/repos/<product>/<name>` | Uncommitted changes |
| ❌ Failed | `/repos/<product>/<name>` | `<error summary>` |

After the table:

- If any **⚠️ Skipped** repos: "To sync skipped repos, commit or stash your changes and re-run `/arc:workspace-sync`."
- If any **❌ Failed** repos: "Check the errors above. Common causes: network issues, missing or expired auth, invalid URL."
- If all repos are ✅ or 🔄 with no warnings: "Workspace sync complete. Run `/arc:kb-generate` to build the knowledge base."
