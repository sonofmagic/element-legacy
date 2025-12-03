<script>
export default {
  name: 'ElFooter',

  componentName: 'ElFooter',

  props: {
    height: {
      type: String,
      default: '60px',
    },
  },
}
</script>

<template>
  <footer class="el-footer" :style="{ height }">
    <slot />
  </footer>
</template>
