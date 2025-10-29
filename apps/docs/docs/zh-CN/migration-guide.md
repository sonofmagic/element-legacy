## 迁移指南

本页总结了从 Element UI 升级到全新的 Element Legacy（以下简称 “Element”）时需要关注的核心差异，帮助你评估影响并规划迁移步骤。

### 依赖全面升级

- 依赖栈整体替换为最新稳定版本，包括 Vue 2.7、Vite 7、Vitest 3 等现代工具链。
- 若你的项目仍在使用旧版 Node 或 Babel 依赖，请先对齐项目运行时（推荐 Node 18+）再引入新版 Element。
- 推荐使用 `pnpm bootstrap` 安装依赖，并通过 `pnpm dist` 验证构建、测试、Lint 均能通过。

### Sass 升级与模块化写法

- 样式层完全迁移到 Dart Sass，当前仓库使用 `sass@1.93.x`。
- 所有样式文件不再兼容 `node-sass` 与传统的 `@import` 写法，覆盖样式时需改用 `@use` / `@forward`。
- 变量命名统一去掉前缀，如旧版 `$--color-primary` 现为 `$color-primary`。可通过模块配置覆写：

  ```scss
  /* element-variables.scss */
  @use '@element-legacy/theme-chalk/src/common/var' with (
    $color-primary: #3a8ee6,
    $font-size-base: 15px
  );

  @use '@element-legacy/theme-chalk/src/index' as *;
  ```

  在入口文件中仅需引入该 Sass 文件即可生效。

### 完整 ESM 输出

- 包产物改为纯 ESM，默认不再提供 CommonJS 或 UMD 构建。
- 若现有项目仍依赖 `require()`，需要升级打包器或通过动态 `import()` 适配。
- Rollup、Vite、Webpack 5（需开启 `experiments.outputModule`）等均可直接消费 ESM。

### 构建工具迁移至 Vite

- 新版开发、打包流程基于 Vite，Webpack 配置不再维护。
- 推荐使用 `pnpm dev` 或 `vite` CLI 进行调试；自定义配置通过 `vite.config.ts` 扩展。
- 若需要 SSR 或单测构建，请基于 Vite 插件生态重新配置，而非复用旧的 Webpack loader。

### 全量 TypeScript 实现

- 组件源代码、工具脚本与类型定义全部改写为 TypeScript。
- 原本的 `.js` 自定义扩展或覆盖脚本需迁移到 `.ts`，并补充对应的类型声明。
- 若项目仍以纯 JavaScript 编写，可使用 `pnpm exec vue-tsc --noEmit` 提前检查类型兼容性。

### 样式覆盖的新方式

- 因为采用 Sass 模块化与按需组件导入，直接修改编译后 CSS 已不再可控。
- 推荐以下方案覆盖样式：
  - 使用前述 `@use ... with (...)` 修改 Design Token；
  - 在组件局部通过 `:global` 或 CSS 变量调整细节；
  - 对于特定场景，可在 `packages/theme-chalk/src` 中新增扩展并在自定义构建中引入。
- 保留旧版的主题生成脚本仅作为参考，请尽量避免继续使用 `et` 或直接修改 `dist` 文件。
