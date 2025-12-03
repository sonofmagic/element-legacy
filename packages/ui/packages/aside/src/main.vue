<script>
export default {
  name: 'ElAside',

  componentName: 'ElAside',

  props: {
    width: {
      type: String,
      default: '300px',
    },
  },
}
</script>

<template>
  <aside class="el-aside" :style="{ width }">
    <slot />
  </aside>
</template>
