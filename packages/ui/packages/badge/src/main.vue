<script>
export default {
  name: 'ElBadge',

  props: {
    value: [String, Number],
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      validator(val) {
        return ['primary', 'success', 'warning', 'info', 'danger'].includes(val)
      },
    },
  },

  computed: {
    content() {
      if (this.isDot) { return }

      const value = this.value
      const max = this.max

      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value
      }

      return value
    },
  },
}
</script>

<template>
  <div class="el-badge">
    <slot />
    <transition name="el-zoom-in-center">
      <sup
        v-show="!hidden && (content || content === 0 || isDot)"
        class="el-badge__content"
        :class="[
          type ? `el-badge__content--${type}` : null,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot,
          },
        ]"
        v-text="content"
      />
    </transition>
  </div>
</template>
