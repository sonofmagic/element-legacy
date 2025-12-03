<script>
export default {
  name: 'ElBreadcrumb',

  provide() {
    return {
      elBreadcrumb: this,
    }
  },

  props: {
    separator: {
      type: String,
      default: '/',
    },
    separatorClass: {
      type: String,
      default: '',
    },
  },

  mounted() {
    const items = this.$el.querySelectorAll('.el-breadcrumb__item')
    if (items.length) {
      items[items.length - 1].setAttribute('aria-current', 'page')
    }
  },
}
</script>

<template>
  <div class="el-breadcrumb" aria-label="Breadcrumb" role="navigation">
    <slot />
  </div>
</template>
