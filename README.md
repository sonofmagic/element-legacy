# Element Legacy Monorepo

This repository is organised as a pnpm workspace. The Element Legacy component library now lives in `packages/ui`, with build tooling in `packages-private/build` and the documentation site in `apps/docs`.

Most day-to-day commands can still be run from the repository root via the scripts defined in `package.json`, which forward to the `element-legacy` package. Alternatively, you can cd into `packages/ui` and run the same scripts locally.

## Releases

We rely on [Changesets](https://github.com/changesets/changesets) to manage versions and npm publishes. Generate a release entry with `pnpm release`, review the pending plan via `pnpm release:plan`, and let the automated release PR update versions and changelogs. Publishing is handled by running `pnpm publish-packages` (locally or through CI), which builds the workspace, applies version bumps with `pnpm run version-packages`, and calls `changeset publish`. Direct `pnpm publish` calls from packages are no longer needed.
