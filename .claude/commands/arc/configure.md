---
name: arc:configure
description: Interactively configure data sources (docs, tickets, code hosting) for this ARC workspace. Updates arc.config.json, .env.arc, .env.arc.example, and .claude/settings.local.json (for MCP).
---

Configure data sources for this ARC workspace. Works through three categories — **docs**, **tickets**, **code_hosting** — and sets up either an MCP server or CLI tool for each. Updates `arc.config.json`, `.env.arc`, and `.claude/settings.local.json` as needed.

## Before you start

1. Read `arc.config.json`. If `data_sources` already has entries, tell the user which categories are already configured and ask whether to skip or reconfigure each one.
2. Read `.env.arc` if it exists — preserve existing entries when updating.

## For each category

Work through the three categories in this order: **docs**, **tickets**, **code_hosting**. For each, follow the steps below.

---

### Step 1 — Choose tool

Ask the user which tool they use for this category. Present the options below. Accept free-text input for "Other".

**docs:**
1. Confluence
2. Notion
3. SharePoint
4. Local markdown files (no auth needed)
5. Other
6. Skip (no documentation source)

**tickets:**
1. Jira
2. Azure DevOps
3. GitHub Issues
4. Linear
5. Other
6. Skip (no ticket source)

**code_hosting:**
1. GitHub
2. GitLab
3. Azure DevOps Repos
4. Bitbucket
5. Other
6. Skip

If the user chooses **Skip**: record `{ "type": "none" }` for this category in `arc.config.json` and move to the next category.

If the user chooses **Local markdown files**: record `{ "type": "local" }` and move to the next category — no auth or integration needed.

---

### Step 2 — Choose integration method

Consult the table below. If an MCP server is known for the chosen tool, ask:

> "Would you like to configure an MCP server for [TOOL]? MCP gives arc richer, structured access to [TOOL]. Alternatively, we can use the [TOOL] CLI."

If no MCP server is listed for the tool, skip this question and proceed directly to CLI setup.

**Known MCP servers:**

| Tool | MCP server package | Notes |
|------|-------------------|-------|
| GitHub | `@modelcontextprotocol/server-github` | Official |
| Jira | `mcp-atlassian` | Community; also covers Confluence |
| Confluence | `mcp-atlassian` | Community; also covers Jira |
| GitLab | `@modelcontextprotocol/server-gitlab` | Community |

---

### MCP setup

1. Ask for any tool-specific configuration values (base URL, organization, email — see below).
2. Update `.claude/settings.local.json`: add the MCP server entry under `mcpServers`. Merge with existing entries — do not overwrite.
3. For MCP servers that reference env vars, offer to add those tokens to `.env.arc` (same PAT prompt as CLI setup below).
4. Record in `arc.config.json` for this category.

**MCP server configurations to write into `.claude/settings.local.json`:**

**GitHub:**
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
}
```
Ask for: organization name (optional, for context).

**Jira and/or Confluence (mcp-atlassian):**
```json
"atlassian": {
  "command": "uvx",
  "args": ["mcp-atlassian"],
  "env": {
    "CONFLUENCE_URL": "[base_url]/wiki",
    "CONFLUENCE_USERNAME": "[user_email]",
    "CONFLUENCE_API_TOKEN": "${CONFLUENCE_API_TOKEN}",
    "JIRA_URL": "[base_url]",
    "JIRA_USERNAME": "[user_email]",
    "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"
  }
}
```
Ask for: base URL (e.g. `https://company.atlassian.net`), user email.
Note: if both Jira and Confluence are configured in the same run, write a single `atlassian` entry covering both.

**GitLab:**
```json
"gitlab": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-gitlab"],
  "env": {
    "GITLAB_PERSONAL_ACCESS_TOKEN": "${GITLAB_TOKEN}",
    "GITLAB_API_URL": "[base_url or https://gitlab.com/api/v4]"
  }
}
```
Ask for: base URL (leave default `https://gitlab.com/api/v4` for cloud).

---

### CLI setup

1. Ask for any required tool-specific configuration:
   - **base_url**: for self-hosted tools (Confluence, Jira, GitLab, Azure DevOps)
   - **organization**: for GitHub, Azure DevOps
   - **project**: for Azure DevOps

2. Offer PAT setup with this tool-specific prompt (fill in TOOL, CLI_TOOL, and AUTH_COMMAND from the table below):
   > "If you don't have native auth configured for `[CLI_TOOL]` (e.g. `[AUTH_COMMAND]`), you'll need a PAT. Want to add one now?"

   If user says **yes**: ask for the token value and add it to `.env.arc` using the env var name from the table.
   If user says **no**: continue — note in the final summary that native auth must be configured before running `arc:workspace-sync` or `arc:kb-generate`.

**CLI tool reference:**

| Tool | CLI | Auth command | PAT env var |
|------|-----|-------------|-------------|
| GitHub | `gh` | `gh auth login` | `GITHUB_TOKEN` |
| GitLab | `glab` | `glab auth login` | `GITLAB_TOKEN` |
| Azure DevOps | `az` | `az login` | `AZURE_DEVOPS_EXT_PAT` |
| Jira | `jira` | `jira init` | `JIRA_API_TOKEN` |
| Confluence | `jira` | `jira init` | `CONFLUENCE_API_TOKEN` |
| Linear | (no CLI) | N/A | `LINEAR_API_KEY` |
| Bitbucket | (no CLI) | N/A | `BITBUCKET_TOKEN` |
| Notion | (no CLI) | N/A | `NOTION_TOKEN` |
| SharePoint | (no CLI) | N/A | `SHAREPOINT_TOKEN` |

3. Record in `arc.config.json` for this category.

---

## arc.config.json schema

After all categories, merge the collected configuration into `arc.config.json`. Preserve `arc_version` and any other existing fields.

Each configured category follows this shape:
```json
{
  "type": "<tool_name>",
  "integration": "mcp | cli",
  "cli_tool": "<cli_binary>",        // CLI only
  "mcp_server": "<package_name>",    // MCP only
  "base_url": "<url>",               // if applicable
  "organization": "<org>",           // if applicable
  "project": "<project>"             // if applicable
}
```

Example result:
```json
{
  "arc_version": "1.0",
  "data_sources": {
    "docs": {
      "type": "confluence",
      "integration": "mcp",
      "mcp_server": "mcp-atlassian",
      "base_url": "https://company.atlassian.net"
    },
    "tickets": {
      "type": "jira",
      "integration": "cli",
      "cli_tool": "jira",
      "base_url": "https://company.atlassian.net"
    },
    "code_hosting": {
      "type": "github",
      "integration": "cli",
      "cli_tool": "gh",
      "organization": "my-org"
    }
  }
}
```

---

## .env.arc and .env.arc.example

After all categories, write or update two files:

**`.env.arc`** — write all tokens collected during this run. Preserve existing entries not touched in this run. One var per line, format: `VAR_NAME=value`. Add a comment line above each group identifying the tool.

**`.env.arc.example`** — same structure as `.env.arc` but with empty values (`VAR_NAME=`). Always safe to commit. Overwrite fully each time `arc:configure` runs so it stays in sync.

Example `.env.arc.example`:
```
# GitHub (gh)
GITHUB_TOKEN=

# Jira / Confluence (jira)
JIRA_API_TOKEN=
CONFLUENCE_API_TOKEN=
```

Ensure `.env.arc` is listed in `.gitignore`. Do not add `.env.arc.example` to `.gitignore`.

---

## Report results

Print a summary table:

| Category | Tool | Integration | Auth |
|----------|------|-------------|------|
| docs | Confluence | MCP | Token added to .env.arc |
| tickets | Jira | CLI | ⚠ No PAT — native auth required |
| code_hosting | GitHub | CLI | Token added to .env.arc |

Then list files updated: `arc.config.json`, `.env.arc`, `.env.arc.example`, `.claude/settings.local.json` (if MCP was configured).

End with: "Configuration complete. Run `/arc:workspace-sync` to clone your repositories."
