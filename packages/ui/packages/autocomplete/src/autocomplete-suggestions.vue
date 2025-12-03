<script>
import ElScrollbar from 'element-ui/packages/scrollbar'
import Emitter from 'element-ui/src/mixins/emitter'
import Popper from 'element-ui/src/utils/vue-popper'

export default {
  components: { ElScrollbar },
  mixins: [Popper, Emitter],

  componentName: 'ElAutocompleteSuggestions',

  props: {
    options: {
      default() {
        return {
          gpuAcceleration: false,
        }
      },
    },
    id: String,
  },

  data() {
    return {
      parent: this.$parent,
      dropdownWidth: '',
    }
  },

  updated() {
    this.$nextTick((_) => {
      this.popperJS && this.updatePopper()
    })
  },

  mounted() {
    this.$parent.popperElm = this.popperElm = this.$el
    this.referenceElm = this.$parent.$refs.input.$refs.input || this.$parent.$refs.input.$refs.textarea
    this.referenceList = this.$el.querySelector('.el-autocomplete-suggestion__list')
    this.referenceList.setAttribute('role', 'listbox')
    this.referenceList.setAttribute('id', this.id)
  },

  created() {
    this.$on('visible', (val, inputWidth) => {
      this.dropdownWidth = `${inputWidth}px`
      this.showPopper = val
    })
  },

  methods: {
    select(item) {
      this.dispatch('ElAutocomplete', 'item-click', item)
    },
  },
}
</script>

<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="el-autocomplete-suggestion el-popper"
      :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
      :style="{ width: dropdownWidth }"
      role="region"
    >
      <ElScrollbar
        tag="ul"
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list"
      >
        <li v-if="!parent.hideLoading && parent.loading">
          <i class="el-icon-loading" />
        </li>
        <slot v-else />
      </ElScrollbar>
    </div>
  </transition>
</template>
