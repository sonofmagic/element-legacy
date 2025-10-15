<script>
import { parse as parseShaodw, stringify as stringifyShaodw } from '../utils/boxShadow.js'
import ColorPicker from './color-picker'
import Input from './input.vue'
import Mixin from './mixin.vue'

export default {
  components: {
    ColorPicker,
    ThemeInput: Input,
  },
  mixins: [Mixin],
  data() {
    return {
      valueArr: [],
    }
  },
  watch: {
    mergedValue: {
      immediate: true,
      handler(value) {
        this.valueArr = parseShaodw(value)
      },
    },
  },
  methods: {
    onAddShadow() {
      this.valueArr.push({
        offsetX: 0,
        offsetY: 0,
        spreadRadius: 0,
        blurRadius: 0,
        color: 'rgba(0,0,0,0)',
        inset: false,
      })
    },
    onMinusShadow(index) {
      this.valueArr.splice(index, 1)
      this.onShadowChange()
    },
    onInputChange(e, index, key) {
      const arr = this.valueArr[index]
      arr[key] = e
      this.valueArr.splice(index, 1, arr)
      this.onShadowChange()
    },
    onShadowChange() {
      this.onChange(
        stringifyShaodw(this.valueArr),
      )
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
      <el-button
        class="plus-button"
        size="mini"
        round
        icon="el-icon-plus"
        @click.stop="onAddShadow"
      />
    </div>
    <div v-for="(each, key) in valueArr" :key="key" class="config-content">
      <div class="content-10">
        <ColorPicker
          v-model="each.color"
          size="mini"
          class="colorPicker"
          show-alpha
          @change="val => onInputChange(val, key, 'color')"
        />
        <span class="content-tip">Color</span>
      </div>
      <div class="content-20">
        <ThemeInput
          size="mini"
          :val="each.offsetX"
          @change="val => onInputChange(Number(val), key, 'offsetX')"
        />
        <span class="content-tip">X-px</span>
      </div>
      <div class="content-20">
        <ThemeInput
          size="mini"
          :val="each.offsetY"
          @change="val => onInputChange(Number(val), key, 'offsetY')"
        />
        <span class="content-tip">Y-px</span>
      </div>
      <div class="content-20">
        <ThemeInput
          size="mini"
          :val="each.spreadRadius"
          @change="val => onInputChange(Number(val), key, 'spreadRadius')"
        />
        <span class="content-tip">Spread</span>
      </div>
      <div class="content-20">
        <ThemeInput
          size="mini"
          :val="each.blurRadius"
          @change="val => onInputChange(Number(val), key, 'blurRadius')"
        />
        <span class="content-tip">Blur</span>
      </div>
      <div class="content-10">
        <el-button
          size="mini"
          round
          icon="el-icon-minus"
          @click.stop="val => onMinusShadow(key)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.plus-button {
  position: absolute;
  left: 90%;
  margin-top: 4px;
}
.colorPicker {
  margin-left: 0;
}
.content-20 .el-input__suffix-inner span{
  line-height: 28px;
}
.content-20 {
  padding: 0 3px;
}
.content-10 {
  vertical-align: top;
}
.content-tip {
  color: #909399;
  font-size: 12px;
}
.config-content {
  padding: 5px 0;
}
/* Element buton style override */
.el-button--mini.is-round {
  padding: 3px 3px;
}
</style>
