<script>
export default {
  name: 'ElBreadcrumbItem',

  inject: ['elBreadcrumb'],
  props: {
    to: {},
    replace: Boolean,
  },
  data() {
    return {
      separator: '',
      separatorClass: '',
    }
  },

  mounted() {
    this.separator = this.elBreadcrumb.separator
    this.separatorClass = this.elBreadcrumb.separatorClass
    const link = this.$refs.link
    link.setAttribute('role', 'link')
    link.addEventListener('click', (_) => {
      const { to, $router } = this
      if (!to || !$router) { return }
      this.replace ? $router.replace(to) : $router.push(to)
    })
  },
}
</script>

<template>
  <span class="el-breadcrumb__item">
    <span
      ref="link" class="el-breadcrumb__inner"
      :class="[to ? 'is-link' : '']"
      role="link"
    >
      <slot />
    </span>
    <i v-if="separatorClass" class="el-breadcrumb__separator" :class="separatorClass" />
    <span v-else class="el-breadcrumb__separator" role="presentation">{{ separator }}</span>
  </span>
</template>
