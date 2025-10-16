# Element Legacy Monorepo

This repository is organised as a pnpm workspace. The Element Legacy component library now lives in `packages/ui`, with build tooling in `packages-private/build` and the documentation site in `apps/docs`.

Most day-to-day commands can still be run from the repository root via the scripts defined in `package.json`, which forward to the `element-legacy` package. Alternatively, you can cd into `packages/ui` and run the same scripts locally.
