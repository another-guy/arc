# Release Checklist

Steps to prepare and publish a new version of ARC.

## 1. Decide the version number

Follow [semver](https://semver.org/): `MAJOR.MINOR.PATCH`.

- **PATCH** — bug fixes and clarifications to existing skills
- **MINOR** — new skills or backward-compatible behavior changes
- **MAJOR** — breaking changes to workspace structure, config schema, or skill interfaces

## 2. Bump the version

The version string must be consistent in three places:

- [ ] `"version"` in `.claude-plugin/plugin.json`
- [ ] `"arc_version"` in the `arc.config.json` template inside `skills/scaffold/SKILL.md`
- [ ] `"arc_version"` in the `arc.config.json` example inside `skills/configure/SKILL.md`

## 3. Review documentation

Check each file for accuracy against the new version:

- [ ] **`SKILLS.md`** — update skill descriptions, options, prerequisites, or output tables for any skill that changed
- [ ] **`README.md`** — update workflow steps or examples if user-facing behavior changed
- [ ] **`WORKSPACE_STRUCTURE.md`** — update if `arc:scaffold` or `arc:workspace-sync` output changed
- [ ] **`CLAUDE.md`** — update project structure section or conventions if anything changed
- [ ] **`PRIVACY.md`** — update if data handling, external connections, or file access changed
- [ ] **`LICENSE`** — update the copyright year if needed

## 4. Validate the plugin

- [ ] Run `claude plugin validate .` and resolve all errors; warnings that don't affect function are acceptable

## 5. Commit

- [ ] Stage all changes: `git add .claude-plugin/plugin.json skills/ SKILLS.md README.md CLAUDE.md WORKSPACE_STRUCTURE.md PRIVACY.md LICENSE` (add any other changed files)
- [ ] Commit: `git commit -m "chore: release vX.Y.Z"`
- [ ] Push commits: `git push`

## 6. Tag the release

- [ ] Create the tag: `git tag vX.Y.Z` (where `X.Y.Z` matches the version in `.claude-plugin/plugin.json`)
- [ ] Push the tag: `git push origin vX.Y.Z`

## 7. Marketplace

- [ ] Verify whether the community marketplace listing auto-picks up the new tag or requires re-submission
- [ ] Re-submit at the marketplace submission form if required, or if the plugin description/metadata changed significantly

## 8. Smoke test

- [ ] In a fresh workspace directory, install the plugin: `/plugin install https://github.com/another-guy/arc`
- [ ] Confirm the correct version is installed
- [ ] Run `/arc:scaffold` to verify skills load and execute correctly
