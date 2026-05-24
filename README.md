# ARC — AI-Powered Workspace Bootstrap for Engineers

Arc is a [Claude Code](https://claude.ai/code) plugin that turns a blank directory into a fully-scaffolded engineering workspace in minutes. It clones your repositories, builds a knowledge base from your docs, wikis, and codebase, and maintains that context as your understanding of the system grows.

Designed to work at any company — from an AI-friendly startup to a government agency with strict compliance requirements. No globally installed tools assumed beyond Claude Code itself.

---

## Installation

Inside the workspace directory where you want arc available, run:

```
/plugin install https://github.com/<your-username>/arc
```

This installs arc's skills as `/arc:*` commands in the current workspace. The plugin files live in `.claude/commands/arc/` and travel with the workspace (commit or share that directory to distribute arc to teammates).

---

## Updating

To pull the latest version of arc into your workspace:

```
/plugin update arc
```

---

## Workflow

Run these skills in order the first time you set up a workspace at a new company.

### Step 1 — Scaffold the workspace

```
/arc:scaffold
```

Creates the directory structure, stub files, and configuration files arc needs. Safe to re-run — skips files that already exist.

### Step 2 — Add your repositories

Edit `repo-list.json` to list the repositories you want in the workspace:

```json
{
  "repos": [
    { "name": "auth-service", "product": "platform", "url": "https://github.com/org/auth-service.git" },
    { "name": "web-app",      "product": "frontend",  "url": "https://github.com/org/web-app.git" }
  ]
}
```

### Step 3 — Configure data sources

```
/arc:configure
```

Interactively sets up your documentation source (Confluence, Notion, etc.), ticket tracker (Jira, Linear, etc.), and code hosting (GitHub, GitLab, etc.). Offers MCP integration where available; falls back to CLI + access token for everything else.

### Step 4 — Clone your repositories

```
/arc:workspace-sync
```

Clones all repos from `repo-list.json` that aren't already present. Pulls existing repos if clean; skips any with uncommitted changes.

### Step 5 — Build the knowledge base

```
/arc:kb-generate
```

Analyzes your repos, reads your docs and wikis, and writes a structured knowledge base into `knowledge/`. Identifies platform/core repos and asks which ones to document in depth. Designed to be run in phases — safe to resume after `/compact`.

### Step 6 — Deep-document platform repos

For each platform repo selected in the previous step:

```
/arc:kb-repo repos/<product>/<name>
```

Generates a detailed knowledge article for a single repo. Run `/compact` before each invocation to give it a clean context window.

---

## Getting help

For a description of every skill — what it does, what it creates, and what it requires — read `SKILLS.md` in this repository:

```
@SKILLS.md
```

Each skill is also self-guiding: when invoked, it explains what it is doing and prompts you when a decision is needed.
