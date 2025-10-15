<script>
export default {
  name: 'DocAlert',
  props: {
    type: {
      type: String,
      default: 'tip',
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    blockClass() {
      return ['tip', 'warning'].includes(this.type) ? this.type : 'tip'
    },
  },
}
</script>

<template>
  <div class="doc-alert" :class="[blockClass]">
    <p
      v-if="title"
      class="doc-alert__title"
    >
      {{ title }}
    </p>
    <div class="doc-alert__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.doc-alert {
  margin: 20px 0;
}

.doc-alert__title {
  margin: 0 0 8px;
  font-weight: 500;
  color: #1f2f3d;
}

.doc-alert__body :first-child {
  margin-top: 0;
}

.doc-alert__body :last-child {
  margin-bottom: 0;
}
</style>
