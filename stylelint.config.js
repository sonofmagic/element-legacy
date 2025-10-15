import { icebreaker } from '@icebreakers/stylelint-config'

export default icebreaker(
  {
    rules: {
      'selector-class-pattern': null,
      'nesting-selector-no-missing-scoping-root': null,
      'selector-no-vendor-prefix': null,
      'selector-pseudo-element-no-unknown': null,
      'selector-pseudo-class-no-unknown': null,
      'no-empty-source': null,
      'no-descending-specificity': null,
      'scss/selector-no-redundant-nesting-selector': null,
      'scss/at-function-pattern': null,
      'scss/dollar-variable-pattern': null,
    },
  },
)
