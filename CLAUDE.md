# ARC

Arc is a portable Claude Code plugin that bootstraps and maintains engineering workspaces for any employer. Install it once into a workspace via `/plugin install`; the five core skills handle the rest.

## Project structure

```
.claude/commands/arc/   ← all arc skills (slash commands)
project-arc.md          ← original design document
WORKSPACE_STRUCTURE.md  ← structure arc creates in a workspace
SKILLS.md               ← user-facing skills catalog
```

## Skills overview

| Skill | Usage | Purpose |
|-------|-------|---------|
| `arc:scaffold` | `/arc:scaffold` | Create workspace skeleton |
| `arc:configure` | `/arc:configure` | Set up data sources and auth |
| `arc:workspace-sync` | `/arc:workspace-sync` | Clone/pull repos from `repo-list.json` |
| `arc:kb-generate` | `/arc:kb-generate [--force]` | Build workspace knowledge base |
| `arc:kb-repo` | `/arc:kb-repo repos/<product>/<name> [--force]` | Deep-document a single repo |

Run them in this order when onboarding to a new company. See `SKILLS.md` for full documentation.

## Adding a new skill

1. Create `.claude/commands/arc/<skill-name>.md`.
2. Open with YAML frontmatter — CC requires it for discovery:
   ```yaml
   ---
   name: arc:<skill-name>
   description: One sentence describing what this skill does.
   ---
   ```
3. Write the skill body as a prompt: step-by-step instructions Claude follows when the skill is invoked.
4. Reference user input via `$ARGUMENTS` (everything the user types after the command).
5. Add a row to `SKILLS.md`.

## Conventions

- **Frontmatter is required** on every skill file. Missing frontmatter means CC cannot discover the skill.
- **Minimum schema** — don't add config fields or prompts for things not immediately needed.
- **No redundant prompts** — don't ask for information already implicit in workspace context (company name, repo descriptions, etc.).
- **Write to disk immediately** after each phase — skills that generate files write as they go, not at the end.
- **Recommend `/compact`** at natural phase boundaries in long-running skills.
- **Skip existing files** by default — prefer idempotent behavior with `--force` to opt into regeneration.
