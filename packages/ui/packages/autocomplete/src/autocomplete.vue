<script>
import ElInput from '../../input'
import Emitter from '../../../src/mixins/emitter'
import Focus from '../../../src/mixins/focus'
import Migrating from '../../../src/mixins/migrating'
import Clickoutside from '../../../src/utils/clickoutside'
import { generateId } from '../../../src/utils/util'
import { debounce } from 'throttle-debounce'
import ElAutocompleteSuggestions from './autocomplete-suggestions.vue'

export default {
  name: 'ElAutocomplete',

  mixins: [Emitter, Focus('input'), Migrating],

  inheritAttrs: false,

  componentName: 'ElAutocomplete',

  components: {
    ElInput,
    ElAutocompleteSuggestions,
  },

  directives: { Clickoutside },

  props: {
    valueKey: {
      type: String,
      default: 'value',
    },
    popperClass: String,
    popperOptions: Object,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true,
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false,
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300,
    },
    placement: {
      type: String,
      default: 'bottom-start',
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true,
    },
    highlightFirstItem: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      suggestionDisabled: false,
    }
  },
  computed: {
    suggestionVisible() {
      const suggestions = this.suggestions
      const isValidData = Array.isArray(suggestions) && suggestions.length > 0
      return (isValidData || this.loading) && this.activated
    },
    id() {
      return `el-autocomplete-${generateId()}`
    },
  },
  watch: {
    suggestionVisible(val) {
      const $input = this.getInput()
      if ($input) {
        this.broadcast('ElAutocompleteSuggestions', 'visible', [val, $input.offsetWidth])
      }
    },
  },
  mounted() {
    this.debouncedGetData = debounce(this.debounce, this.getData)
    this.$on('item-click', (item) => {
      this.select(item)
    })
    const $input = this.getInput()
    $input.setAttribute('role', 'textbox')
    $input.setAttribute('aria-autocomplete', 'list')
    $input.setAttribute('aria-controls', 'id')
    $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`)
  },
  beforeDestroy() {
    this.$refs.suggestions.$destroy()
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'custom-item': 'custom-item is removed, use scoped slot instead.',
          'props': 'props is removed, use value-key instead.',
        },
      }
    },
    getData(queryString) {
      if (this.suggestionDisabled) {
        return
      }
      this.loading = true
      this.fetchSuggestions(queryString, (suggestions) => {
        this.loading = false
        if (this.suggestionDisabled) {
          return
        }
        if (Array.isArray(suggestions)) {
          this.suggestions = suggestions
          this.highlightedIndex = this.highlightFirstItem ? 0 : -1
        }
        else {
          console.error('[Element Error][Autocomplete]autocomplete suggestions must be an array')
        }
      })
    },
    handleInput(value) {
      this.$emit('input', value)
      this.suggestionDisabled = false
      if (!this.triggerOnFocus && !value) {
        this.suggestionDisabled = true
        this.suggestions = []
        return
      }
      this.debouncedGetData(value)
    },
    handleChange(value) {
      this.$emit('change', value)
    },
    handleFocus(event) {
      this.activated = true
      this.$emit('focus', event)
      if (this.triggerOnFocus) {
        this.debouncedGetData(this.value)
      }
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleClear() {
      this.activated = false
      this.$emit('clear')
    },
    close(e) {
      this.activated = false
    },
    handleKeyEnter(e) {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        e.preventDefault()
        this.select(this.suggestions[this.highlightedIndex])
      }
      else if (this.selectWhenUnmatched) {
        this.$emit('select', { value: this.value })
        this.$nextTick((_) => {
          this.suggestions = []
          this.highlightedIndex = -1
        })
      }
    },
    select(item) {
      this.$emit('input', item[this.valueKey])
      this.$emit('select', item)
      this.$nextTick((_) => {
        this.suggestions = []
        this.highlightedIndex = -1
      })
    },
    highlight(index) {
      if (!this.suggestionVisible || this.loading) { return }
      if (index < 0) {
        this.highlightedIndex = -1
        return
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1
      }
      const suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap')
      const suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li')

      const highlightItem = suggestionList[index]
      const scrollTop = suggestion.scrollTop
      const offsetTop = highlightItem.offsetTop

      if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
        suggestion.scrollTop += highlightItem.scrollHeight
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight
      }
      this.highlightedIndex = index
      const $input = this.getInput()
      $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`)
    },
    getInput() {
      return this.$refs.input.getInput()
    },
  },
}
</script>

<template>
  <div
    v-clickoutside="close"
    class="el-autocomplete"
    aria-haspopup="listbox"
    role="combobox"
    :aria-expanded="suggestionVisible"
    :aria-owns="id"
  >
    <ElInput
      ref="input"
      v-bind="[$props, $attrs]"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.native="handleKeyEnter"
      @keydown.native.tab="close"
    >
      <template v-if="$slots.prepend" slot="prepend">
        <slot name="prepend" />
      </template>
      <template v-if="$slots.append" slot="append">
        <slot name="append" />
      </template>
      <template v-if="$slots.prefix" slot="prefix">
        <slot name="prefix" />
      </template>
      <template v-if="$slots.suffix" slot="suffix">
        <slot name="suffix" />
      </template>
    </ElInput>
    <ElAutocompleteSuggestions
      :id="id"
      ref="suggestions"
      visible-arrow
      :class="[popperClass ? popperClass : '']"
      :popper-options="popperOptions"
      :append-to-body="popperAppendToBody"
      :placement="placement"
    >
      <li
        v-for="(item, index) in suggestions"
        :id="`${id}-item-${index}`"
        :key="index"
        :class="{ highlighted: highlightedIndex === index }"
        role="option"
        :aria-selected="highlightedIndex === index"
        @click="select(item)"
      >
        <slot :item="item">
          {{ item[valueKey] }}
        </slot>
      </li>
    </ElAutocompleteSuggestions>
  </div>
</template>
