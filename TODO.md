# TODO List

## Ensure plugin structure

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

## Fix /arc:configure errors

Look into /arc:configure, but ask Claude Code to check other places too.

```
❯ During /arc:configure command run previously, there were two errors. Why did they happen?

  The errors:

    Which tool do you use for documentation?
    ⎿  Invalid tool parameters

  ● User answered Claude's questions:
    ⎿  · Do you want to add a GitHub Personal Access Token to .env.arc now? → Yes, add PAT now
    ⎿  Invalid tool parameters

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
