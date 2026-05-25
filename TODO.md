# TODO List

## Rename existing skills

Apply the `<entity>-<action>` naming convention to existing commands:

- [ ] `/arc:scaffold` → `/arc:workspace-scaffold`
- [ ] `/arc:configure` → `/arc:workspace-configure`
- [ ] `/arc:kb-repo` → `/arc:kb-repo-generate`

(`/arc:workspace-sync` and `/arc:kb-generate` already follow the convention — no change needed.)

## Add more skills that will be useful long-term

### Naming convention

All skills follow `/arc:<entity>-<action>`. Namespaces come in mutating/read-only pairs where applicable:

| Mutating | Read-only |
|----------|-----------|
| `kb-*` | `overview-*` |
| `code-*` | `analyze-*` |
| — | `review-*` |

Full namespace reference:

| Namespace     | Intent                                                             |
| ------------- | ------------------------------------------------------------------ |
| `workspace-*` | Workspace-level setup and discovery                                |
| `kb-*`        | Knowledge base generation and mutation                             |
| `overview-*`  | Read-only navigation of the existing KB                            |
| `code-*`      | Mutating operations on code                                        |
| `analyze-*`   | Read-only factual analysis of code (structure, behavior, meaning)  |
| `review-*`    | Read-only code review — quality judgment (no open PR assumed)      |
| `workplan-*`  | Work planning artifacts and actions                                |
| `pr-*`        | Reserved — future remote PR-specific skills (GitHub, ADO)          |

---

### workspace-*

- [ ] `/arc:workspace-whats-new` — Summarize recent activity across all repos (commits, tickets, doc changes) without consulting the KB. General discovery.

### kb-*

- [ ] `/arc:kb-update` — Update the knowledge base with new information from repos, docs, and ticket tracker. May add a `sources` field to each KB entry to track provenance and priority.
- [ ] `/arc:kb-whats-new` — Summarize what changed in the KB since the last `/arc:kb-update` run.
- [ ] `/arc:kb-query` — Answer a natural language question by querying the knowledge base (e.g. "How do I set up my dev environment?", "Who owns the auth service?").

### overview-*

- [ ] `/arc:overview-products` — Overview of current products, their status, and key information. Useful for new hires.
- [ ] `/arc:overview-process` — Overview of key company processes (release, incident response, etc.) from the KB.
- [ ] `/arc:overview-glossary` — Glossary of important terms, acronyms, and jargon from the KB.
- [ ] `/arc:overview-team` — Overview of team structure, roles, and responsibilities from the KB.

### code-*

- [ ] `/arc:code-implement` — Implement a feature in small, incremental pieces. Keeps each change contained and easy to review (manages reviewer's cognitive load).
- [ ] `/arc:code-refactor` — Refactor code for improved structure, readability, or performance.
- [ ] `/arc:code-debug` — Identify potential issues in code and suggest fixes.
- [ ] `/arc:code-optimize` — Optimize code for performance or efficiency.
- [ ] `/arc:code-document` — Generate or update inline documentation for a piece of code.

### analyze-*

- [ ] `/arc:analyze-explain` — Explain what a piece of code does in natural language.
- [ ] `/arc:analyze-summarize` — Produce a high-level summary of what a piece of code does.

### review-*

- [ ] `/arc:review-comprehensive` — Thorough, multifaceted code review. Orchestrates the specialized reviews below.
- [ ] Lower priority — specialized review sub-skills (can feed into `/arc:review-comprehensive`):
  - [ ] `/arc:review-functionality-and-correctness`
  - [ ] `/arc:review-design-and-architecture`
  - [ ] `/arc:review-readability-and-maintainability`
  - [ ] `/arc:review-security`
  - [ ] `/arc:review-performance`
  - [ ] `/arc:review-accessibility`
  - [ ] `/arc:review-compliance-and-best-practices`
  - [ ] `/arc:review-documentation`
  - [ ] `/arc:review-tests-and-coverage`

### workplan-*

- [ ] `/arc:workplan-generate` — Break a feature into small, incremental implementation steps. Optionally creates subtasks in the configured ticket tracker.

### Artifact generation (no namespace conflict)

- [ ] `/arc:docs-generate` — Generate documentation for a repo or project from code, comments, and available context.
- [ ] `/arc:tests-generate` — Generate tests for a repo or project from code and available context.
- [ ] `/arc:tasks-generate` — Generate tasks or tickets from code and context. Useful for surfacing work that needs to be done.

## ✅ Ensure plugin structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json     ← manifest (required)
├── skills/
├── hooks/
│   └── hooks.json
├── .mcp.json
└── README.md
```

...or

```
arc/
├── .claude-plugin/
│   └── plugin.json     ← manifest with name, version, description, author, repository
├── skills/
│   ├── scaffold.md
│   ├── configure.md
│   ├── workspace-sync.md
│   ├── kb-generate.md
│   └── kb-repo.md
├── README.md
├── CLAUDE.md
├── SKILLS.md
├── project-arc.md
└── WORKSPACE_STRUCTURE.md
```

## ✅ Fix /arc:configure errors

Look into /arc:configure, but ask Claude Code to check other places too.

```
❯ During /arc:configure command run previously, there were two errors. Why did they happen?

  The errors:

    Which tool do you use for documentation?
    ⎿  Invalid tool parameters

  ● User answered Claude's questions:
    ⎿  · Do you want to add a GitHub Personal Access Token to .env.arc now? → Yes, add PAT now
    ⎿  Invalid tool parameters

● Both errors were InputValidationError from the AskUserQuestion tool — I violated its schema constraints in two different
  directions:

  Error 1 — Too many options (docs question)

  The arc:configure skill lists 6 options for the docs category (Confluence, Notion, SharePoint, Local markdown, Other, Skip). I
  passed all of them, but AskUserQuestion enforces a maximum of 4 options. The schema validation rejected it immediately.

  Error 2 — Too few options (PAT entry question)

  When asking for the token value, I tried to make a free-text-only question with a single option ("Enter via Other field"), but
  AskUserQuestion requires a minimum of 2 options. Same schema violation, opposite direction.

  Both are mismatches between the skill's UX intent and the tool's hard constraints. The skill was designed without those limits in
   mind — it assumes a UI that can handle arbitrary option counts and single-option prompts. The workaround I used both times was
  to restructure the question to fit within the 2–4 option window, which worked but meant silently dropping some of the skill's
  intended options.
```
