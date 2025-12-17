<script>
import ElButton from 'element-legacy/packages/button'
import ElInput from 'element-legacy/packages/input'
import Locale from 'element-legacy/src/mixins/locale'
import Popper from 'element-legacy/src/utils/vue-popper'
import AlphaSlider from './alpha-slider.vue'
import HueSlider from './hue-slider.vue'
import Predefine from './predefine.vue'
import SvPanel from './sv-panel.vue'

export default {
  name: 'ElColorPickerDropdown',

  components: {
    SvPanel,
    HueSlider,
    AlphaSlider,
    ElInput,
    ElButton,
    Predefine,
  },

  mixins: [Popper, Locale],

  props: {
    color: {
      required: true,
    },
    showAlpha: Boolean,
    predefine: Array,
  },

  data() {
    return {
      customInput: '',
    }
  },

  computed: {
    currentColor() {
      const parent = this.$parent
      return !parent.value && !parent.showPanelColor ? '' : parent.color.value
    },
  },

  watch: {
    showPopper(val) {
      if (val === true) {
        this.$nextTick(() => {
          const { sl, hue, alpha } = this.$refs
          sl && sl.update()
          hue && hue.update()
          alpha && alpha.update()
        })
      }
    },

    currentColor: {
      immediate: true,
      handler(val) {
        this.customInput = val
      },
    },
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$el
  },

  methods: {
    confirmValue() {
      this.$emit('pick')
    },

    handleConfirm() {
      this.color.fromString(this.customInput)
    },
  },
}
</script>

<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="el-color-dropdown"
    >
      <div class="el-color-dropdown__main-wrapper">
        <HueSlider ref="hue" :color="color" vertical style="float: right;" />
        <SvPanel ref="sl" :color="color" />
      </div>
      <AlphaSlider v-if="showAlpha" ref="alpha" :color="color" />
      <Predefine v-if="predefine" :color="color" :colors="predefine" />
      <div class="el-color-dropdown__btns">
        <span class="el-color-dropdown__value">
          <ElInput
            v-model="customInput"
            :validate-event="false"
            size="mini"
            @keyup.native.enter="handleConfirm"
            @blur="handleConfirm"
          />
        </span>
        <ElButton
          size="mini"
          type="text"
          class="el-color-dropdown__link-btn"
          @click="$emit('clear')"
        >
          {{ t('el.colorpicker.clear') }}
        </ElButton>
        <ElButton
          plain
          size="mini"
          class="el-color-dropdown__btn"
          @click="confirmValue"
        >
          {{ t('el.colorpicker.confirm') }}
        </ElButton>
      </div>
    </div>
  </transition>
</template>
