<script>
export default {
  name: 'ElDivider',
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        return ['horizontal', 'vertical'].includes(val)
      },
    },
    contentPosition: {
      type: String,
      default: 'center',
      validator(val) {
        return ['left', 'center', 'right'].includes(val)
      },
    },
  },
}
</script>

<template functional>
  <div
    v-bind="data.attrs"
    class="el-divider" :class="[data.staticClass, `el-divider--${props.direction}`]"
    v-on="listeners"
  >
    <div
      v-if="slots().default && props.direction !== 'vertical'"
      class="el-divider__text" :class="[`is-${props.contentPosition}`]"
    >
      <slot />
    </div>
  </div>
</template>
