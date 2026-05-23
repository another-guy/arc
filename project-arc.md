# Project ARC: becoming a 10x engineer with AI/LLMs and Claude Code

## Summary

I want to build a Claude Code plugin that will boost my productivity to a "10x engineer".
This plugin will be used in all companies I work for that allow the use of AI and LLMs in general and Claude Code (CC) in particular.

## Goals and Objectives

The productivity boost will be achieved by AI-enabling the workspace.
1. Automating initial multi-product and multi-repository workspace scaffolding and configuration.
2. Automating knowledge base (KB) creation and maintenance over time for each product and making the KB usable by both CC and me.
3. Automation or assistance in setting up the development environment for local development.
4. Automating or assisting routine software engineer tasks whenever possible, such as:
   - Requirements gathering and analysis
   - System design and architecture
   - Work planning and task management
   - Code reviews
   - Pull request (PR) creation and review
   - Code documentation
   - Code refactoring
   - Code debugging
   - Code testing

## Work Environment and Constraints

### Organizational Context

The end solution (Claude Code plugin) should support various work environments, including but not limited to:
- Government agencies, cautious about AI, security, and compliance.
- Large (enterprise) private sector companies, which may have strict policies and legacy systems.
- More AI-friendly companies, such as startups or tech companies, which may be more open to adopting new tools and practices, but still very careful about security and compliance, especially PHI handling when it comes to healthcare sector.

### Role Diversity

The end solution should also support performing tasks typical to various roles, including but not limited to:
- **Often** Full-stack software engineer ("generalist" SWE/SDE).
- **Often** Software development engineer in test (SDET).
- **Periodically** Software and Solution architect.
- **Periodically** Site reliability engineer (SRE) and DevOps software engineer.
- **Seldom** data engineer or data scientist.
- **Seldom** product, project, or software engineer manager.

### Technical and Other Differences

The solution should be flexible enough to easily adapt to differences between companies', while still providing significant productivity benefits.
The differences may include, but are not limited to:
- Technical differences:
  - Tech stacks (mainly Node.js, Python, React, Vue.js, .NET, C#, TypeScript, and others).
  - Architectural patterns and styles (DDD, microservices, event-driven, serverless, monolith, layered, etc.)
  - Platforms (mainly AWS, Azure, on-premises).
  - CI/CD tools and pipelines (mainly GitHub Actions, Azure DevOps, and others).
  - Codebase structure and organization (multirepo vs monorepo).
  - Development processes and workflows and tools around them (mainly, Jira, Azure DevOps)
- Policy differences.
- Team and organizational differences.
- Organizational culture differences.

## Workspace Structure

The desired workspace structure is described in the @WORKSPACE_STRUCTURE.md document in THIS project.
