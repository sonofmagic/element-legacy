<script>
import ImgPlaceholder from './img-placeholder.vue'

export default {
  name: 'ElSkeletonItem',
  components: {
    [ImgPlaceholder.name]: ImgPlaceholder,
  },
  props: {
    variant: {
      type: String,
      default: 'text',
    },
  },
}
</script>

<template>
  <div class="el-skeleton__item" :class="[`el-skeleton__${variant}`]">
    <img-placeholder v-if="variant === 'image'" />
  </div>
</template>
