<script>
export default {
  name: 'ElCard',
  props: {
    header: {},
    bodyStyle: {},
    shadow: {
      type: String,
    },
  },
}
</script>

<template>
  <div class="el-card" :class="shadow ? `is-${shadow}-shadow` : 'is-always-shadow'">
    <div v-if="$slots.header || header" class="el-card__header">
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <div class="el-card__body" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>
