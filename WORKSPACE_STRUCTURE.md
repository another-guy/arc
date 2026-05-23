# Workspace Structure

```sh
.claude
  ...
repos/
  product-one/
    CLAUDE.md
    repo-one/
    repo-two/
  product-two/
    CLAUDE.md
    repo-three/
    repo-four/
knowledge/
  CLAUDE.md
  CODING-STANDARDS.md
  ARCHITECTURE.md
  SECURITY.md
  ...
.claudeignore
CLAUDE.md
repo-list.json

```

- `.claude/` is the standard Claude Code configuration directory.
- `repos/` is the workspace root for all code. Each repo is a subdirectory under its product area. Generally, there should be no repeated repos across products.
- `repos/<product>/CLAUDE.md` is a recommended (optional) file for product-specific context and guidelines. It can be used to document things that are relevant to all repos in that product area, such as architectural patterns, common libraries, or team conventions.
- `knowledge/` holds knowledge files. The knowledge base files are expected to be in markdown format, with occasional exceptions of plain text, CSV, JSON, XML, etc. The files are expected to be usable by skills as well as human beings. The files should be short or moderate in length, but must not sacrifice the important details. When a knowledge file gets large, it should start with a human-friendly summary and slowly progress into details.
- `knowledge/CLAUDE.md` is the a file that explains where to look for further details based on the topic. It should work as a router or table of contents for the `knowledge/` directory. For example, it can say "For coding standards, see `@knowledge/CODING-STANDARDS.md`. For architecture guidelines, see `@knowledge/ARCHITECTURE.md`. For security best practices, see `@knowledge/SECURITY.md`."
- `.claudeignore` lists files or directories to exclude from Claude's view, using glob patterns. This is useful for excluding large binaries, logs, or other irrelevant files that would consume context without providing value.
- `repo-list.json` is the configuration file for the `arc:workspace-sync` skill, which defines the repositories that should be present in the workspace, their source URLs, and how they should be organized.
- `CLAUDE.md` file in the root directory can be used for general guidelines, conventions, or information that applies to the entire workspace. It can hold the information that describes the Workspace Structure itself.
