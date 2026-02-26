# Rules

## Structure

Rules are organized into a **common** layer plus **language-specific** directories:

```
rules/
├── common/          # Language-agnostic principles (always install)
│   ├── agents.md
│   ├── coding-style.md
│   ├── development-workflow.md
│   ├── git-workflow.md
│   ├── hooks.md
│   ├── patterns.md
│   ├── performance.md
│   ├── security.md
│   └── testing.md
├── typescript/      # TypeScript/JavaScript specific
├── python/          # Python specific
├── golang/          # Go specific
└── swift/           # Swift specific
```

- **common/** contains universal principles -- no language-specific code examples.
- **Language directories** extend the common rules with framework-specific patterns, tools, and code examples. Each file references its common counterpart.

## Installation

Use the install script to append rules to your project's AGENTS.md:

```bash
# Install common + one or more language-specific rule sets
node install.js typescript
node install.js python
node install.js typescript python golang

# Or via npx (if installed as npm package)
npx edroid-install typescript
```

The script:
1. Reads `rules/common/` files (always included)
2. Reads `rules/<language>/` files for each requested language
3. Appends everything to `AGENTS.md` in the current working directory

## Rules vs Skills

- **Rules** define standards, conventions, and checklists that apply broadly (e.g., "80% test coverage", "no hardcoded secrets"). They are appended to AGENTS.md and are always active.
- **Skills** (`skills/` directory) provide deep, actionable reference material for specific tasks (e.g., `python-patterns`, `golang-testing`). They are invoked by the model when relevant.

## Adding a New Language

To add support for a new language (e.g., `rust/`):

1. Create a `rules/rust/` directory
2. Add files that extend the common rules:
   - `coding-style.md` -- formatting tools, idioms, error handling patterns
   - `testing.md` -- test framework, coverage tools, test organization
   - `patterns.md` -- language-specific design patterns
   - `hooks.md` -- PostToolUse hooks for formatters, linters, type checkers
   - `security.md` -- secret management, security scanning tools
3. Each file should start with:
   ```
   > This file extends [common/xxx.md](../common/xxx.md) with <Language> specific content.
   ```

## Rule Priority

When language-specific rules and common rules conflict, **language-specific rules take precedence**.
