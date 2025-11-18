# element-legacy

## 0.1.1

### Patch Changes

- [`93c1022`](https://github.com/sonofmagic/element-legacy/commit/93c1022ab234a3ffe05683e359533aa5acb974e1) Thanks [@sonofmagic](https://github.com/sonofmagic)! - 修复 DatePicker v2 在紧凑四列布局下的最小宽度限制，范围选择器现在会按容器宽度收缩，不再出现重叠。

## 0.1.0

### Minor Changes

- [`2347486`](https://github.com/sonofmagic/element-legacy/commit/2347486c2d93a047945f2ef663f575406f3c246a) Thanks [@sonofmagic](https://github.com/sonofmagic)! - feat: 更改打包步骤，去除 @babel/cli 的打包，全部使用 vite

### Patch Changes

- [`cc01c7e`](https://github.com/sonofmagic/element-legacy/commit/cc01c7eb5d04fcf28f487fae0bc236a8a39f01a6) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Expose `UploadList`, `Scrollbar`, `ImageViewer`, and the internal `DateTable` view as standalone build entries (with typings) and include their Chalk styles so consumers can import them directly.

  新增 `UploadList`、`Scrollbar`、`ImageViewer` 以及内部使用的 `DateTable` 的独立构建入口（含类型声明），并补齐对应的 Chalk 样式，方便直接按需引用。

- [`9f9397d`](https://github.com/sonofmagic/element-legacy/commit/9f9397df21f47763f423c3feed6c804c15fd08e4) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Make popup manager a true singleton so multiple element-ui bundles share the same modal state.

## 0.0.5

### Patch Changes

- [`f9c1a2c`](https://github.com/sonofmagic/element-legacy/commit/f9c1a2ccbb3bffee654218ef71d5d9ddf3c575ba) Thanks [@sonofmagic](https://github.com/sonofmagic)! - chore: changeset release

## 0.0.1

### Patch Changes

- [#4](https://github.com/sonofmagic/element-legacy/pull/4) [`6dc1d78`](https://github.com/sonofmagic/element-legacy/commit/6dc1d780565089f054c06b26b87a434e523d531b) Thanks [@sonofmagic](https://github.com/sonofmagic)! - release
