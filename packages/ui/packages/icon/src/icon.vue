<script>
export default {
  name: 'ElIcon',

  props: {
    name: String,
  },
}
</script>

<template>
  <i :class="`el-icon-${name}`" />
</template>
