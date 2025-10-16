<script>
import ElButton from 'element-ui/packages/button'
import ElInput from 'element-ui/packages/input'
import Locale from 'element-ui/src/mixins/locale'
import Popper from 'element-ui/src/utils/vue-popper'
import AlphaSlider from './alpha-slider.vue'
import ColorList from './color-list.vue'
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
    ColorList,
  },

  mixins: [Popper, Locale],

  props: {
    color: {
      required: true,
    },
    showAlpha: Boolean,
    predefine: Array,
    colorList: Array,
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

    onColorListSelect(e) {
      this.$emit('pick', e)
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
        <!-- <el-button
          size="mini"
          type="text"
          class="el-color-dropdown__link-btn"
          @click="$emit('clear')">
          {{ t('el.colorpicker.clear') }}
        </el-button> -->
        <ElButton
          plain
          size="mini"
          type="primary"
          class="el-color-dropdown__btn"
          @click="confirmValue"
        >
          {{ t('el.colorpicker.confirm') }}
        </ElButton>
      </div>
      <ColorList
        v-if="colorList && colorList.length > 0"
        :color="color"
        :colors="colorList"
        @select="onColorListSelect"
      />
    </div>
  </transition>
</template>
