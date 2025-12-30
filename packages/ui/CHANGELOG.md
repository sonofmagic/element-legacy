# element-legacy

## 1.1.6

### Patch Changes

- [`b89e09f`](https://github.com/sonofmagic/element-legacy/commit/b89e09fd424c113ff48f273d3b9cedc00ab537f5) Thanks [@sonofmagic](https://github.com/sonofmagic)! - fix(select): prevent dropdown auto-opening on tab refocus by suppressing focus-triggered open until user interaction

## 1.1.5

### Patch Changes

- [`f3b49d0`](https://github.com/sonofmagic/element-legacy/commit/f3b49d03bf07aace9be2d650549d08ca29eef87c) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Adjust date range split picker highlight to stay centered on the active input while keeping 12px breathing room from borders and the separator, with 2px outward padding.

## 1.1.4

### Patch Changes

- [`bb6dd34`](https://github.com/sonofmagic/element-legacy/commit/bb6dd341145392626039228067ef4e8554923f92) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Add programmatic open/close APIs to DatePicker v2 with docs and tests, including split range support.

## 1.1.3

### Patch Changes

- [`fc0090a`](https://github.com/sonofmagic/element-legacy/commit/fc0090a24bdb39e9da2d7c61881be8d4cfa96590) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Fix date-picker-v2 `default-time` handling for `daterange` so end values keep the configured time, and refresh docs examples with generic wording.

## 1.1.2

### Patch Changes

- [`15b6666`](https://github.com/sonofmagic/element-legacy/commit/15b6666018ab54bc47bf4790060dfb4c24936707) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Fix date-picker-v2 footer confirm button to use i18n text and add a test to guard the localization.

## 1.1.1

### Patch Changes

- [`b2a6432`](https://github.com/sonofmagic/element-legacy/commit/b2a64322a65a82e8e998089d10adb34cd60aa675) Thanks [@sonofmagic](https://github.com/sonofmagic)! - fix deep import resolutions so builds work when the package is installed via an npm alias (e.g. `element-ui@npm:element-legacy`)

## 1.1.0

### Minor Changes

- [`01faa15`](https://github.com/sonofmagic/element-legacy/commit/01faa1506915b1c77cece7fd102d5de3aa1e2f4b) Thanks [@sonofmagic](https://github.com/sonofmagic)! - feat: upgrade async-validator-next to version 0.2.0

### Patch Changes

- [`c3e42aa`](https://github.com/sonofmagic/element-legacy/commit/c3e42aae1939f44a96d548435d4913405a46eb5a) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Fix date-picker-v2 range clear behavior so the clear icon resets the bound value to null and add coverage for partial and full clears.

## 1.0.1

### Patch Changes

- [`0a9a1bf`](https://github.com/sonofmagic/element-legacy/commit/0a9a1bffe99227f96cf2d7ee8114769afdf34e8a) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Align date-picker-v2 sizing with container width instead of max-width limits, keeping form usage full-width and documenting the form layout scenario.

## 1.0.0

### Major Changes

- [`2853c44`](https://github.com/sonofmagic/element-legacy/commit/2853c44947e095e66c89f7d183f4af154259baad) Thanks [@sonofmagic](https://github.com/sonofmagic)! - feat: replace $ELEMENT usage with injected config + composable, add deprecation warning on Vue.prototype.$ELEMENT; raise peer vue to >=2.7 <3

### Minor Changes

- [`cd364df`](https://github.com/sonofmagic/element-legacy/commit/cd364df56d9b9a4e4db4c8350f6caf227d07d415) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Expose `async-validator-next` utilities (validator instance, validation config helpers, `zodRule`) from the main entry, and allow form validation to forward async-validator options via the new `validateOptions` prop.

## 0.2.0

### Minor Changes

- [`f68b936`](https://github.com/sonofmagic/element-legacy/commit/f68b936da6f93576913416f5f08ced06b8c7f6ed) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Add a `singleClear` prop to DatePicker v2 that defaults to a single clear button clearing the full range, with an opt-out to keep two clear buttons.

## 0.1.1

### Patch Changes

- [`93c1022`](https://github.com/sonofmagic/element-legacy/commit/93c1022ab234a3ffe05683e359533aa5acb974e1) Thanks [@sonofmagic](https://github.com/sonofmagic)! - 修复 DatePicker v2 在紧凑四列布局下的最小宽度限制，范围选择器现在会按容器宽度收缩，不再出现重叠。

## 0.1.0

### Minor Changes

- [`2347486`](https://github.com/sonofmagic/element-legacy/commit/2347486c2d93a047945f2ef663f575406f3c246a) Thanks [@sonofmagic](https://github.com/sonofmagic)! - feat: 更改打包步骤，去除 @babel/cli 的打包，全部使用 vite

### Patch Changes

- [`cc01c7e`](https://github.com/sonofmagic/element-legacy/commit/cc01c7eb5d04fcf28f487fae0bc236a8a39f01a6) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Expose `UploadList`, `Scrollbar`, `ImageViewer`, and the internal `DateTable` view as standalone build entries (with typings) and include their Chalk styles so consumers can import them directly.

  新增 `UploadList`、`Scrollbar`、`ImageViewer` 以及内部使用的 `DateTable` 的独立构建入口（含类型声明），并补齐对应的 Chalk 样式，方便直接按需引用。

- [`9f9397d`](https://github.com/sonofmagic/element-legacy/commit/9f9397df21f47763f423c3feed6c804c15fd08e4) Thanks [@sonofmagic](https://github.com/sonofmagic)! - Make popup manager a true singleton so multiple element-legacy bundles share the same modal state.

## 0.0.5

### Patch Changes

- [`f9c1a2c`](https://github.com/sonofmagic/element-legacy/commit/f9c1a2ccbb3bffee654218ef71d5d9ddf3c575ba) Thanks [@sonofmagic](https://github.com/sonofmagic)! - chore: changeset release

## 0.0.1

### Patch Changes

- [#4](https://github.com/sonofmagic/element-legacy/pull/4) [`6dc1d78`](https://github.com/sonofmagic/element-legacy/commit/6dc1d780565089f054c06b26b87a434e523d531b) Thanks [@sonofmagic](https://github.com/sonofmagic)! - release
