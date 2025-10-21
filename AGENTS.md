# Repository Guidelines

## Project Structure & Module Organization

Element UI 2.x component library now lives under `packages/ui`. `packages/ui/src/` holds the plugin entry, global mixins, and shared utilities. Each UI component resides in `packages/ui/packages/<component>/` with component logic in `src` or `index.js`, aggregated via the scripts in `packages-private/build/src`. Shared theme assets reside in `packages/theme-chalk`. Demo and extension assets live under `apps/docs/`, including documentation content in `apps/docs/docs`. Tests split between `packages/ui/test/unit` for Vitest specs and `packages/ui/test/ssr` for server-render checks. Reusable tooling and automation scripts sit under `packages-private/build/` and `scripts/`.

## Build, Test, and Development Commands

Install dependencies with `pnpm bootstrap`. For the local docs playground run `pnpm dev` (full demo site) or `pnpm dev:play` (lightweight playground). Package builds use `pnpm build` for the Vite bundle and `pnpm build:theme` for Chalk CSS. Use `pnpm dist` to clean, lint, and build distribution artifacts. Regenerate component entry points with `pnpm build:file` after adding or renaming packages.

## Coding Style & Naming Conventions

The repo targets Vue 2 (`eslint.config.mjs` sets `vueVersion: 2`). JavaScript and TypeScript files use two-space indentation and prefer named exports for shared utilities. Component folders mirror kebab-case package names, while component constructors remain PascalCase (e.g., `packages/ui/packages/button` exports `ElButton`). Run `pnpm exec eslint "packages/ui/packages/**" "packages/ui/src/**"` and `pnpm exec stylelint "packages/theme-chalk/src/**/*.scss"` before pushing. Lint-staged auto-fixes JS/TS/Vue/Markdown on commit.

## Testing Guidelines

Vitest drives unit tests with a jsdom environment; specs live beside fixtures under `test/**/*.spec.ts`. Execute `pnpm test` for the full suite, and `pnpm test:dev` while iterating. Coverage is enabled via the config, so keep new code above existing coverage baselines and prefer targeted component tests. Snapshot updates should be justified in pull request descriptions.

## Commit & Pull Request Guidelines

Commitlint (`commitlint.config.ts`) enforces Conventional Commits (`type(scope): subject`). Scope should match the affected package (e.g., `feat(button): add loading size`). Use present-tense subjects and limit to 72 characters. Pull requests need a clear summary, reproduction steps when fixing bugs, and links to issues or discussions. Include screenshots or GIFs for visual changes and note any documentation updates under `apps/docs/docs`. Ensure CI passes before requesting review.

## Release Workflow

All versioning and publishing now flow through Changesets. Use `pnpm release` to author a changeset and describe the impact for each affected package, then commit the generated file alongside your changes. Inspect pending releases at any time with `pnpm release:plan`. Once the release PR merges, the `pnpm publish-packages` script (run locally or by CI) builds the workspace, applies version bumps via `pnpm run version-packages`, and publishes to npm using `changeset publish`. Avoid invoking `pnpm publish` from individual packages—`changesets` keeps `element-legacy` and `@element-legacy/theme-chalk` in sync automatically.
