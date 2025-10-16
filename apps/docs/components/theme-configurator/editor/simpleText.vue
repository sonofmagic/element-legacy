<script>
import Input from './input.vue'
import Mixin from './mixin.vue'

export default {
  components: {
    ThemeInput: Input,
  },
  mixins: [Mixin],
  data() {
    return {
      value: '',
    }
  },
  watch: {
    mergedValue: {
      immediate: true,
      handler(_value) {
        this.value = this.mergedValue
      },
    },
  },
}
</script>

<template>
  <section :key="displayName" class="config">
    <div class="config-label">
      <el-tooltip :content="displayName" placement="top">
        <span>{{ displayKeyName }}</span>
      </el-tooltip>
    </div>
    <div class="config-content">
      <ThemeInput
        :val="value"
        size="medium"
        @change="onChange"
      />
    </div>
  </section>
</template>
