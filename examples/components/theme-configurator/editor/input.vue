<script>
export default {
  props: ['val', 'onChange'],
  data() {
    return {
      value: '',
      oldValue: '',
    }
  },
  watch: {
    val: {
      immediate: true,
      handler(value) {
        this.value = value
        if (!this.oldValue) {
          this.oldValue = value
        }
      },
    },
  },
  methods: {
    onUpdate(e) {
      const { value } = e.target
      if (value !== this.oldValue) {
        this.oldValue = value
        this.$emit('change', value)
      }
    },
  },
}
</script>

<template>
  <el-input
    v-model="value"
    v-bind="$attrs"
    @keyup.enter.native="onUpdate"
    @blur="onUpdate"
  >
    <template slot="suffix">
      <slot name="suffix" />
    </template>
  </el-input>
</template>
