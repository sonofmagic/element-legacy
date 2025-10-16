<script>
import { getStyleDisplayName } from '../utils/utils.js'
import Input from './input.vue'
import Mixin from './mixin.vue'

export default {
  components: {
    ThemeInput: Input,
  },
  mixins: [Mixin],
  data() {
    return {
      options: [],
      value: '',
    }
  },
  computed: {
    isGlobalInputValue() {
      return this.config.value.startsWith('$')
    },
  },
  watch: {
    mergedValue: {
      immediate: true,
      handler(_value) {
        this.initSelectOption()
        this.value = this.mergedValue
      },
    },
  },
  methods: {
    onSelectChange(e) {
      this.onChange(e)
    },
    initSelectOption() {
      this.options = []
      const golbalV = this.golbalValue.border
      if (golbalV) {
        Object.keys(golbalV).forEach((font) => {
          if (font.includes('border-radius')) {
            const size = golbalV[font]
            this.options.push({
              value: size.key,
              label: getStyleDisplayName(size),
            })
          }
        })
      }
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
        v-if="isGlobal"
        :val="value"
        @change="onChange"
      />
      <el-select
        v-if="!isGlobal"
        v-model="value"
        size="medium"
        class="select"
        @change="onSelectChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </section>
</template>

<style>
.select {
  width: 100%;
}
</style>
