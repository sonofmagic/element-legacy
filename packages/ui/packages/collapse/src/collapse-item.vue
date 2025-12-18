<script>
import Emitter from '../../../src/mixins/emitter'
import ElCollapseTransition from '../../../src/transitions/collapse-transition'
import { generateId } from '../../../src/utils/util'

export default {
  name: 'ElCollapseItem',

  componentName: 'ElCollapseItem',

  components: { ElCollapseTransition },

  mixins: [Emitter],

  inject: ['collapse'],

  props: {
    title: String,
    name: {
      type: [String, Number],
      default() {
        return this._uid
      },
    },
    disabled: Boolean,
  },

  data() {
    return {
      contentWrapStyle: {
        height: 'auto',
        display: 'block',
      },
      contentHeight: 0,
      focusing: false,
      isClick: false,
      id: generateId(),
    }
  },

  computed: {
    isActive() {
      return this.collapse.activeNames.includes(this.name)
    },
  },

  methods: {
    handleFocus() {
      setTimeout(() => {
        if (!this.isClick) {
          this.focusing = true
        }
        else {
          this.isClick = false
        }
      }, 50)
    },
    handleHeaderClick() {
      if (this.disabled) { return }
      this.dispatch('ElCollapse', 'item-click', this)
      this.focusing = false
      this.isClick = true
    },
    handleEnterClick() {
      this.dispatch('ElCollapse', 'item-click', this)
    },
  },
}
</script>

<template>
  <div
    class="el-collapse-item"
    :class="{ 'is-active': isActive, 'is-disabled': disabled }"
  >
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`el-collapse-content-${id}`"
      :aria-describedby="`el-collapse-content-${id}`"
    >
      <div
        :id="`el-collapse-head-${id}`"
        class="el-collapse-item__header"
        role="button"
        :tabindex="disabled ? undefined : 0"
        :class="{
          'focusing': focusing,
          'is-active': isActive,
        }"
        @click="handleHeaderClick"
        @keyup.space.enter.stop="handleEnterClick"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">
          {{ title }}
        </slot>
        <i
          class="el-collapse-item__arrow el-icon-arrow-right"
          :class="{ 'is-active': isActive }"
        />
      </div>
    </div>
    <ElCollapseTransition>
      <div
        v-show="isActive"
        :id="`el-collapse-content-${id}`"
        class="el-collapse-item__wrap"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`el-collapse-head-${id}`"
      >
        <div class="el-collapse-item__content">
          <slot />
        </div>
      </div>
    </ElCollapseTransition>
  </div>
</template>
