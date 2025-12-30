<script type="text/babel">
import { debounce } from 'throttle-debounce'

import Emitter from '../../../src/mixins/emitter'
import Focus from '../../../src/mixins/focus'
import Locale from '../../../src/mixins/locale'
import Clickoutside from '../../../src/utils/clickoutside'
import { addResizeListener, removeResizeListener } from '../../../src/utils/resize-event'
import scrollIntoView from '../../../src/utils/scroll-into-view'
import { isKorean } from '../../../src/utils/shared'
import { getValueByPath, isEdge, isIE, valueEquals } from '../../../src/utils/util'
import ElInput from '../../input'
import ElScrollbar from '../../scrollbar'
import ElTag from '../../tag'
import NavigationMixin from './navigation-mixin'
import ElOption from './option.vue'
import ElSelectMenu from './select-dropdown.vue'

const SELECT_FOCUS_DEBUG_STORAGE_KEY = 'ELEMENT_SELECT_FOCUS_DEBUG'

function isSelectFocusDebugEnabled() {
  if (process.env.NODE_ENV === 'production') {
    return false
  }
  if (typeof window === 'undefined') {
    return false
  }
  try {
    const win = /** @type {any} */ (window)
    return Boolean(win.__ELEMENT_SELECT_FOCUS_DEBUG__)
      || win.localStorage.getItem(SELECT_FOCUS_DEBUG_STORAGE_KEY) === '1'
  }
  catch (_error) {
    return false
  }
}

function getActiveElementSafely() {
  if (typeof document === 'undefined') {
    return null
  }
  try {
    return document.activeElement
  }
  catch (_error) {
    return null
  }
}

function selectDebugLog(...args) {
  if (!isSelectFocusDebugEnabled()) {
    return
  }
  // eslint-disable-next-line no-console
  console.log(...args)
}

function selectDebugTrace(label) {
  if (!isSelectFocusDebugEnabled()) {
    return
  }
  // eslint-disable-next-line no-console
  console.trace(label)
}

let selectFocusDebugListenersBound = false
function ensureSelectFocusDebugListeners() {
  if (selectFocusDebugListenersBound) {
    return
  }
  if (!isSelectFocusDebugEnabled()) {
    return
  }
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  selectFocusDebugListenersBound = true

  window.addEventListener('focus', () => {
    selectDebugLog('[window focus] active=', getActiveElementSafely())
  })
  document.addEventListener('focusin', (e) => {
    selectDebugLog('[focusin]', e.target, 'active=', getActiveElementSafely())
  })
  document.addEventListener('visibilitychange', () => {
    selectDebugLog('[visibilitychange]', document.visibilityState, 'active=', getActiveElementSafely())
  })
}

let suppressSelectOpenOnFocusUntilUserInteraction = false
let selectFocusOpenSuppressionListenersBound = false
function ensureSelectFocusOpenSuppressionListeners() {
  if (selectFocusOpenSuppressionListenersBound) {
    return
  }
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  selectFocusOpenSuppressionListenersBound = true

  const suppress = () => {
    suppressSelectOpenOnFocusUntilUserInteraction = true
    selectDebugLog('[ElSelect] suppress open-on-focus (reason: tab/window focus change)')
  }
  const clear = () => {
    if (!suppressSelectOpenOnFocusUntilUserInteraction) {
      return
    }
    suppressSelectOpenOnFocusUntilUserInteraction = false
    selectDebugLog('[ElSelect] clear open-on-focus suppression (reason: user interaction)')
  }

  window.addEventListener('focus', suppress)
  window.addEventListener('blur', suppress)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' || document.visibilityState === 'visible') {
      suppress()
    }
  })

  // Use capture so we clear before focus handlers run.
  document.addEventListener('mousedown', clear, true)
  document.addEventListener('touchstart', clear, true)
  document.addEventListener('keydown', clear, true)
}

export default {
  name: 'ElSelect',

  componentName: 'ElSelect',

  components: {
    ElInput,
    ElSelectMenu,
    ElOption,
    ElTag,
    ElScrollbar,
  },

  directives: { Clickoutside },

  mixins: [Emitter, Locale, Focus('reference'), NavigationMixin],

  inject: {
    elForm: {
      default: '',
    },

    elFormItem: {
      default: '',
    },
  },

  provide() {
    return {
      select: this,
    }
  },

  props: {
    name: String,
    id: String,
    value: {
      required: true,
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    /** @Deprecated in next major version */
    autoComplete: {
      type: String,
      validator(_val) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[Element Warn][Select]\'auto-complete\' property will be deprecated in next major version. please use \'autocomplete\' instead.')
        }
        return true
      },
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    loading: Boolean,
    popperClass: String,
    remote: Boolean,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    remoteMethod: Function,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      required: false,
    },
    defaultFirstOption: Boolean,
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value',
    },
    collapseTags: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      options: [],
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      cachedPlaceHolder: '',
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      softFocus: false,
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      previousQuery: null,
      inputHovering: false,
      currentPlaceholder: '',
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false,
    }
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },

    readonly() {
      return !this.filterable || this.multiple || (!isIE() && !isEdge() && !this.visible)
    },

    showClose() {
      const hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : this.value !== undefined && this.value !== null && this.value !== ''
      const criteria = this.clearable
        && !this.selectDisabled
        && this.inputHovering
        && hasValue
      return criteria
    },

    iconClass() {
      return this.remote && this.filterable ? '' : (this.visible ? 'arrow-up is-reverse' : 'arrow-up')
    },

    debounce() {
      return this.remote ? 300 : 0
    },

    emptyText() {
      if (this.loading) {
        return this.loadingText || this.t('el.select.loading')
      }
      else {
        if (this.remote && this.query === '' && this.options.length === 0) {
          return false
        }
        if (this.filterable && this.query && this.options.length > 0 && this.filteredOptionsCount === 0) {
          return this.noMatchText || this.t('el.select.noMatch')
        }
        if (this.options.length === 0) {
          return this.noDataText || this.t('el.select.noData')
        }
      }
      return null
    },

    showNewOption() {
      const hasExistingOption = this.options.filter(option => !option.created)
        .some(option => option.currentLabel === this.query)
      return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption
    },

    selectSize() {
      const configSize = (this.$elementConfig || {}).size
      return this.size || this._elFormItemSize || configSize
    },

    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },

    collapseTagSize() {
      return ['small', 'mini'].includes(this.selectSize)
        ? 'mini'
        : 'small'
    },
    propPlaceholder() {
      return typeof this.placeholder !== 'undefined' ? this.placeholder : this.t('el.select.placeholder')
    },
  },

  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },

    propPlaceholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val
    },

    value(val, oldVal) {
      if (this.multiple) {
        this.resetInputHeight()
        if ((val && val.length > 0) || (this.$refs.input && this.query !== '')) {
          this.currentPlaceholder = ''
        }
        else {
          this.currentPlaceholder = this.cachedPlaceHolder
        }
        if (this.filterable && !this.reserveKeyword) {
          this.query = ''
          this.handleQueryChange(this.query)
        }
      }
      this.setSelected()
      if (this.filterable && !this.multiple) {
        this.inputLength = 20
      }
      if (!valueEquals(val, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },

    visible(val) {
      if (!val) {
        this.broadcast('ElSelectDropdown', 'destroyPopper')
        if (this.$refs.input) {
          this.$refs.input.blur()
        }
        this.query = ''
        this.previousQuery = null
        this.selectedLabel = ''
        this.inputLength = 20
        this.menuVisibleOnFocus = false
        this.resetHoverIndex()
        this.$nextTick(() => {
          if (this.$refs.input
            && this.$refs.input.value === ''
            && this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder
          }
        })
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.allowCreate
              && this.createdSelected && this.createdLabel) {
              this.selectedLabel = this.createdLabel
            }
            else {
              this.selectedLabel = this.selected.currentLabel
            }
            if (this.filterable) {
              this.query = this.selectedLabel
            }
          }

          if (this.filterable) {
            this.currentPlaceholder = this.cachedPlaceHolder
          }
        }
      }
      else {
        this.broadcast('ElSelectDropdown', 'updatePopper')
        if (this.filterable) {
          this.query = this.remote ? '' : this.selectedLabel
          this.handleQueryChange(this.query)
          if (this.multiple) {
            this.$refs.input.focus()
          }
          else {
            if (!this.remote) {
              this.broadcast('ElOption', 'queryChange', '')
              this.broadcast('ElOptionGroup', 'queryChange')
            }

            if (this.selectedLabel) {
              this.currentPlaceholder = this.selectedLabel
              this.selectedLabel = ''
            }
          }
        }
      }
      this.$emit('visible-change', val)
    },

    options() {
      if (this.$isServer) {
        return
      }
      this.$nextTick(() => {
        this.broadcast('ElSelectDropdown', 'updatePopper')
      })
      if (this.multiple) {
        this.resetInputHeight()
      }
      const inputs = this.$el.querySelectorAll('input')
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected()
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption()
      }
    },
  },

  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.propPlaceholder
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', [])
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '')
    }

    this.debouncedOnInputChange = debounce(this.debounce, () => {
      this.onInputChange()
    })

    this.debouncedQueryChange = debounce(this.debounce, (e) => {
      this.handleQueryChange(e.target.value)
    })

    this.$on('handleOptionClick', this.handleOptionSelect)
    this.$on('setSelected', this.setSelected)
  },

  mounted() {
    ensureSelectFocusDebugListeners()
    ensureSelectFocusOpenSuppressionListeners()
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = ''
    }
    addResizeListener(this.$el, this.handleResize)

    const reference = this.$refs.reference
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28,
      }
      const input = reference.$el.querySelector('input')
      this.initialInputHeight = input.getBoundingClientRect().height || sizeMap[this.selectSize]
    }
    if (this.remote && this.multiple) {
      this.resetInputHeight()
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width
      }
    })
    this.setSelected()
  },

  beforeDestroy() {
    if (this.$el && this.handleResize) {
      removeResizeListener(this.$el, this.handleResize)
    }
  },

  methods: {
    handleNavigate(direction) {
      if (this.isOnComposition) {
        return
      }

      this.navigateOptions(direction)
    },
    handleComposition(event) {
      const text = event.target.value
      if (event.type === 'compositionend') {
        this.isOnComposition = false
        this.$nextTick(_ => this.handleQueryChange(text))
      }
      else {
        const lastCharacter = text[text.length - 1] || ''
        this.isOnComposition = !isKorean(lastCharacter)
      }
    },
    handleQueryChange(val) {
      if (this.previousQuery === val || this.isOnComposition) {
        return
      }
      if (
        this.previousQuery === null
        && (typeof this.filterMethod === 'function' || typeof this.remoteMethod === 'function')
      ) {
        this.previousQuery = val
        return
      }
      this.previousQuery = val
      this.$nextTick(() => {
        if (this.visible) {
          this.broadcast('ElSelectDropdown', 'updatePopper')
        }
      })
      this.hoverIndex = -1
      if (this.multiple && this.filterable) {
        this.$nextTick(() => {
          const length = this.$refs.input.value.length * 15 + 20
          this.inputLength = this.collapseTags ? Math.min(50, length) : length
          this.managePlaceholder()
          this.resetInputHeight()
        })
      }
      if (this.remote && typeof this.remoteMethod === 'function') {
        this.hoverIndex = -1
        this.remoteMethod(val)
      }
      else if (typeof this.filterMethod === 'function') {
        this.filterMethod(val)
        this.broadcast('ElOptionGroup', 'queryChange')
      }
      else {
        this.filteredOptionsCount = this.optionsCount
        this.broadcast('ElOption', 'queryChange', val)
        this.broadcast('ElOptionGroup', 'queryChange')
      }
      if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption()
      }
    },

    scrollToOption(option) {
      const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el
      if (this.$refs.popper && target) {
        const menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap')
        scrollIntoView(menu, target)
      }
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll()
    },

    handleMenuEnter() {
      this.$nextTick(() => this.scrollToOption(this.selected))
    },

    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit('change', val)
      }
    },

    getOption(value) {
      let option
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]'
      const isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]'
      const isUndefined = Object.prototype.toString.call(value).toLowerCase() === '[object undefined]'

      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i]
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
          : cachedOption.value === value
        if (isEqual) {
          option = cachedOption
          break
        }
      }
      if (option) {
        return option
      }
      const label = (!isObject && !isNull && !isUndefined)
        ? String(value)
        : ''
      const newOption = {
        value,
        currentLabel: label,
      }
      if (this.multiple) {
        newOption.hitState = false
      }
      return newOption
    },

    setSelected() {
      if (!this.multiple) {
        const option = this.getOption(this.value)
        if (option.created) {
          this.createdLabel = option.currentLabel
          this.createdSelected = true
        }
        else {
          this.createdSelected = false
        }
        this.selectedLabel = option.currentLabel
        this.selected = option
        if (this.filterable) {
          this.query = this.selectedLabel
        }
        return
      }
      const result = []
      if (Array.isArray(this.value)) {
        this.value.forEach((value) => {
          result.push(this.getOption(value))
        })
      }
      this.selected = result
      this.$nextTick(() => {
        this.resetInputHeight()
      })
    },

    handleFocus(event) {
      if (!this.softFocus) {
        selectDebugLog('[ElSelect focus]', this.$el, 'active=', getActiveElementSafely())
        if (this.automaticDropdown || this.filterable) {
          if (suppressSelectOpenOnFocusUntilUserInteraction) {
            selectDebugLog('[ElSelect] suppressed open on focus', { automaticDropdown: this.automaticDropdown, filterable: this.filterable })
          }
          else {
            if (this.filterable && !this.visible) {
              this.menuVisibleOnFocus = true
            }
            selectDebugTrace('[ElSelect open on focus]')
            this.visible = true
          }
        }
        this.$emit('focus', event)
      }
      else {
        this.softFocus = false
      }
    },

    blur() {
      selectDebugTrace('[ElSelect blur()]')
      this.visible = false
      this.$refs.reference.blur()
    },

    handleBlur(event) {
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false
        }
        else {
          this.$emit('blur', event)
        }
      }, 50)
      this.softFocus = false
    },

    handleClearClick(event) {
      this.deleteSelected(event)
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },

    handleClose() {
      selectDebugTrace('[ElSelect handleClose()]')
      this.visible = false
    },

    toggleLastOptionHitState(hit) {
      if (!Array.isArray(this.selected)) {
        return
      }
      const option = this.selected[this.selected.length - 1]
      if (!option) {
        return
      }

      if (hit === true || hit === false) {
        option.hitState = hit
        return hit
      }

      option.hitState = !option.hitState
      return option.hitState
    },

    deletePrevTag(e) {
      if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
        const value = this.value.slice()
        value.pop()
        this.$emit('input', value)
        this.emitChange(value)
      }
    },

    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder
      }
    },

    resetInputState(e) {
      if (e.keyCode !== 8) {
        this.toggleLastOptionHitState(false)
      }
      this.inputLength = this.$refs.input.value.length * 15 + 20
      this.resetInputHeight()
    },

    resetInputHeight() {
      if (this.collapseTags && !this.filterable) {
        return
      }
      this.$nextTick(() => {
        if (!this.$refs.reference) {
          return
        }
        const inputChildNodes = this.$refs.reference.$el.childNodes
        const input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0]
        const tags = this.$refs.tags
        const tagsHeight = tags ? Math.round(tags.getBoundingClientRect().height) : 0
        const sizeInMap = this.initialInputHeight || 40
        input.style.height = this.selected.length === 0
          ? `${sizeInMap}px`
          : `${Math.max(
            tags ? (tagsHeight + (tagsHeight > sizeInMap ? 6 : 0)) : 0,
            sizeInMap,
          )}px`
        if (this.visible && this.emptyText !== false) {
          this.broadcast('ElSelectDropdown', 'updatePopper')
        }
      })
    },

    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected)
        }
        else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)))
          }
          else {
            this.hoverIndex = -1
          }
        }
      }, 300)
    },

    handleOptionSelect(option, byClick) {
      if (this.multiple) {
        const value = (this.value || []).slice()
        const optionIndex = this.getValueIndex(value, option.value)
        if (optionIndex > -1) {
          value.splice(optionIndex, 1)
        }
        else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
          value.push(option.value)
        }
        this.$emit('input', value)
        this.emitChange(value)
        if (option.created) {
          this.query = ''
          this.handleQueryChange('')
          this.inputLength = 20
        }
        if (this.filterable) {
          this.$refs.input.focus()
        }
      }
      else {
        this.$emit('input', option.value)
        this.emitChange(option.value)
        this.visible = false
      }
      this.isSilentBlur = byClick
      this.setSoftFocus()
      if (this.visible) {
        return
      }
      this.$nextTick(() => {
        this.scrollToOption(option)
      })
    },

    setSoftFocus() {
      this.softFocus = true
      const input = this.$refs.input || this.$refs.reference
      if (input) {
        input.focus()
      }
    },

    getValueIndex(arr = [], value) {
      const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]'
      if (!isObject) {
        return arr.indexOf(value)
      }
      else {
        const valueKey = this.valueKey
        let index = -1
        arr.some((item, i) => {
          if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
            index = i
            return true
          }
          return false
        })
        return index
      }
    },

    toggleMenu() {
      if (!this.selectDisabled) {
        selectDebugLog('[ElSelect toggleMenu before]', { visible: this.visible, active: getActiveElementSafely() })
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false
        }
        else {
          this.visible = !this.visible
        }
        if (this.visible) {
          (this.$refs.input || this.$refs.reference).focus()
        }
        selectDebugLog('[ElSelect toggleMenu after]', { visible: this.visible, active: getActiveElementSafely() })
      }
    },

    selectOption() {
      if (!this.visible) {
        this.toggleMenu()
      }
      else {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex])
        }
      }
    },

    deleteSelected(event) {
      event.stopPropagation()
      const value = this.multiple ? [] : ''
      this.$emit('input', value)
      this.emitChange(value)
      this.visible = false
      this.$emit('clear')
    },

    deleteTag(event, tag) {
      const index = this.selected.indexOf(tag)
      if (index > -1 && !this.selectDisabled) {
        const value = this.value.slice()
        value.splice(index, 1)
        this.$emit('input', value)
        this.emitChange(value)
        this.$emit('remove-tag', tag.value)
      }
      event.stopPropagation()
    },

    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel
        this.handleQueryChange(this.query)
      }
    },

    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--
        this.filteredOptionsCount--
        this.options.splice(index, 1)
      }
    },

    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
    },

    handleResize() {
      this.resetInputWidth()
      if (this.multiple) {
        this.resetInputHeight()
      }
    },

    checkDefaultFirstOption() {
      this.hoverIndex = -1
      // highlight the created option
      let hasCreated = false
      for (let i = this.options.length - 1; i >= 0; i--) {
        if (this.options[i].created) {
          hasCreated = true
          this.hoverIndex = i
          break
        }
      }
      if (hasCreated) {
        return
      }
      for (let i = 0; i !== this.options.length; ++i) {
        const option = this.options[i]
        if (this.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            this.hoverIndex = i
            break
          }
        }
        else {
          // highlight currently selected option
          if (option.itemSelected) {
            this.hoverIndex = i
            break
          }
        }
      }
    },

    getValueKey(item) {
      if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
        return item.value
      }
      else {
        return getValueByPath(item.value, this.valueKey)
      }
    },
  },
}
</script>

<template>
  <div
    v-clickoutside="handleClose"
    class="el-select"
    :class="[selectSize ? `el-select--${selectSize}` : '']"
    @click.stop="toggleMenu"
  >
    <div
      v-if="multiple"
      ref="tags"
      class="el-select__tags"
      :style="{ 'max-width': `${inputWidth - 32}px`, 'width': '100%' }"
    >
      <span v-if="collapseTags && selected.length">
        <ElTag
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="selected[0].hitState"
          type="info"
          disable-transitions
          @close="deleteTag($event, selected[0])"
        >
          <span class="el-select__tags-text">{{ selected[0].currentLabel }}</span>
        </ElTag>
        <ElTag
          v-if="selected.length > 1"
          :closable="false"
          :size="collapseTagSize"
          type="info"
          disable-transitions
        >
          <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
        </ElTag>
      </span>
      <transition-group v-if="!collapseTags" @after-leave="resetInputHeight">
        <ElTag
          v-for="item in selected"
          :key="getValueKey(item)"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="item.hitState"
          type="info"
          disable-transitions
          @close="deleteTag($event, item)"
        >
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </ElTag>
      </transition-group>

      <input
        v-if="filterable"
        ref="input"
        v-model="query"
        type="text"
        class="el-select__input"
        :class="[selectSize ? `is-${selectSize}` : '']"
        :disabled="selectDisabled"
        :autocomplete="autoComplete || autocomplete"
        :style="{ 'flex-grow': '1', 'width': `${inputLength / (inputWidth - 32)}%`, 'max-width': `${inputWidth - 42}px` }"
        @focus="handleFocus"
        @blur="softFocus = false"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="handleNavigate('next')"
        @keydown.up.prevent="handleNavigate('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        @keydown.tab="visible = false"
        @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition"
        @input="debouncedQueryChange"
      >
    </div>
    <ElInput
      :id="id"
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :autocomplete="autoComplete || autocomplete"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="readonly"
      :validate-event="false"
      :class="{ 'is-focus': visible }"
      :tabindex="(multiple && filterable) ? '-1' : null"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="debouncedOnInputChange"
      @keydown.native.down.stop.prevent="handleNavigate('next')"
      @keydown.native.up.stop.prevent="handleNavigate('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template v-if="$slots.prefix" slot="prefix">
        <slot name="prefix" />
      </template>
      <template slot="suffix">
        <i v-show="!showClose" class="el-select__caret el-input__icon" :class="[`el-icon-${iconClass}`]" />
        <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close" @click="handleClearClick" />
      </template>
    </ElInput>
    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy"
    >
      <ElSelectMenu
        v-show="visible && emptyText !== false"
        ref="popper"
        :append-to-body="popperAppendToBody"
      >
        <ElScrollbar
          v-show="options.length > 0 && !loading"
          ref="scrollbar"
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && query && filteredOptionsCount === 0 }"
        >
          <ElOption
            v-if="showNewOption"
            :value="query"
            created
          />
          <slot />
        </ElScrollbar>
        <template v-if="emptyText && (!allowCreate || loading || (allowCreate && options.length === 0))">
          <slot v-if="$slots.empty" name="empty" />
          <p v-else class="el-select-dropdown__empty">
            {{ emptyText }}
          </p>
        </template>
      </ElSelectMenu>
    </transition>
  </div>
</template>
