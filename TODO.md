# TODO List

## Add more skills that will be useful long-term

- [ ] `/arc:review-comprehensive`. Custom code review. Focus on thorough, multifaceted review.
- [ ] Lower priority — specialized review commands, some of which can be used in `/arc:review-comprehensive`.
  - [ ] `/arc:review-functionality-and-correctness`
  - [ ] `/arc:review-design-and-architecture`
  - [ ] `/arc:review-readability-and-maintainability`
  - [ ] `/arc:review-security`
  - [ ] `/arc:review-performance`
  - [ ] `/arc:review-compliance-and-best-practices`
  - [ ] `/arc:review-documentation`
  - [ ] `/arc:review-tests-and-coverage`
- [ ] `/arc:work-feature` Custom "implement feature". Focus on incremental implementation in very small pieces. Ensure the resulting change is contained and easy to review (manage reviewer's cognitive load).
- [ ] `/arc:work-plan` Potentially, a supporting skill to generate a work plan for `/arc:work-feature` — break a feature into small, incremental steps that can be implemented and reviewed one at a time. Maybe create subtasks in the task/ticket tracker.
- [ ] `/arc:kb-update-maintain` Update the knowledge base with new information from the repositories, documentation, and ticket tracker. Maybe also add a "source" field to each KB entry so we can track where the information came from and prioritize some sources over others when generating answers.
- [ ] `/arc:kb-query` Query the knowledge base with a natural language question. Retrieve relevant information from the KB and use it to answer the question. This could be used for things like "How do I set up my dev environment?" or "What's the process for requesting time off?" or "Who should I talk to about X?".
- [ ] `/arc:whats-new` Generate a summary of recent changes across the repositories, documentation, and ticket tracker. Useful for keeping up with what's happening in the company.
- [ ] `/arc:overview-product` Generate an overview of the current products, their status, and key information about them. Useful for new hires or anyone trying to understand what the company is working on.
- [ ] `/arc:overview-process` Generate an overview of key company processes (e.g. release process, incident response process, etc.) based on information from the KB and other sources. Useful for new hires or anyone trying to understand how things get done at the company.
- [ ] `/arc:overview-glossary` Generate a glossary of important terms, acronyms, and jargon used in the company. Useful for new hires or anyone trying to understand the language of the company.
- [ ] `/arc:docs-generate` Generate documentation for a repository or project based on the code, comments, and other information available. Useful for improving documentation and making it easier for people to understand the codebase.
- [ ] `/arc:tests-generate` Generate tests for a repository or project based on the code, comments, and other information available. Useful for improving test coverage and ensuring code quality.
- [ ] `/arc:tasks-generate` Generate tasks or tickets for a repository or project based on the code, comments, and other information available. Useful for identifying work that needs to be done and creating actionable items for the team.
- [ ] `/arc:code-explain` Explain a piece of code in natural language. Useful for understanding complex code or onboarding new team members.
- [ ] `/arc:code-summarize` Summarize a piece of code in natural language. Useful for getting a high-level understanding of what a piece of code does without having to read through all the details.
- [ ] `/arc:code-compare` Compare two pieces of code and explain the differences in natural language. Useful for understanding changes between two versions of code or comparing different implementations of the same functionality.
- [ ] `/arc:code-refactor` Refactor a piece of code to improve its structure, readability, or performance. Useful for maintaining code quality and ensuring the codebase remains healthy over time.
- [ ] `/arc:code-debug` Debug a piece of code by identifying potential issues and suggesting fixes. Useful for troubleshooting problems in the codebase and improving overall code quality.
- [ ] `/arc:code-optimize` Optimize a piece of code for better performance or efficiency. Useful for improving the performance of the codebase and ensuring it runs smoothly.
- [ ] `/arc:code-document` Generate documentation for a piece of code based on its structure, comments, and other information available. Useful for improving code documentation and making it easier for people to understand the codebase.
- [ ] `/arc:overview-team` Generate an overview of the team structure, roles, and responsibilities based on information from the KB and other sources. Useful for new hires or anyone trying to understand how the company is organized.

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
