<script>
import objectAssign from 'element-ui/src/utils/merge'

export default {
  name: 'ElForm',

  componentName: 'ElForm',

  provide() {
    return {
      elForm: this,
    }
  },

  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidth: String,
    labelSuffix: {
      type: String,
      default: '',
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: String,
    disabled: Boolean,
    validateOnRuleChange: {
      type: Boolean,
      default: true,
    },
    validateOptions: {
      type: Object,
      default: () => ({}),
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fields: [],
      potentialLabelWidthArr: [], // use this array to calculate auto width
    }
  },
  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) {
        return 0
      }
      const max = Math.max(...this.potentialLabelWidthArr)
      return max ? `${max}px` : ''
    },
  },
  watch: {
    rules() {
      // remove then add event listeners on form-item after form rules change
      this.fields.forEach((field) => {
        field.removeValidateEvents()
        field.addValidateEvents()
      })

      if (this.validateOnRuleChange) {
        this.validate(() => {})
      }
    },
  },
  created() {
    this.$on('el.form.addField', (field) => {
      if (field) {
        this.fields.push(field)
      }
    })
    /* istanbul ignore next */
    this.$on('el.form.removeField', (field) => {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1)
      }
    })
  },
  methods: {
    resetFields() {
      if (!this.model) {
        // eslint-disable-next-line no-console
        console.warn('[Element Warn][Form]model is required for resetFields to work.')
        return
      }
      this.fields.forEach((field) => {
        field.resetField()
      })
    },
    clearValidate(props = []) {
      const fields = props.length
        ? (typeof props === 'string'
            ? this.fields.filter(field => props === field.prop)
            : this.fields.filter(field => props.includes(field.prop))
          )
        : this.fields
      fields.forEach((field) => {
        field.clearValidate()
      })
    },
    validate(callback, options) {
      if (!this.model) {
        // eslint-disable-next-line no-console
        console.warn('[Element Warn][Form]model is required for validate to work!')
        return
      }

      if (callback && typeof callback === 'object') {
        options = callback
        callback = undefined
      }

      let promise
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function (valid, invalidFields) {
            valid ? resolve(valid) : reject(invalidFields)
          }
        })
      }

      let valid = true
      let count = 0
      // 如果需要验证的fields为空，调用验证时立刻返回callback
      if (this.fields.length === 0 && callback) {
        callback(true)
      }
      let invalidFields = {}
      const validateOptions = options || this.validateOptions

      this.fields.forEach((field) => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
          }
          invalidFields = objectAssign({}, invalidFields, field)
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid, invalidFields)
          }
        }, validateOptions)
      })

      if (promise) {
        return promise
      }
    },
    validateField(props, cb, options) {
      props = [].concat(props)
      const fields = this.fields.filter(field => props.includes(field.prop))
      if (!fields.length) {
        // eslint-disable-next-line no-console
        console.warn('[Element Warn]please pass correct props!')
        return
      }

      if (cb && typeof cb === 'object') {
        options = cb
        cb = undefined
      }

      const validateOptions = options || this.validateOptions

      fields.forEach((field) => {
        field.validate('', cb, validateOptions)
      })
    },
    getLabelWidthIndex(width) {
      const index = this.potentialLabelWidthArr.indexOf(width)
      // it's impossible
      if (index === -1) {
        throw new Error('[ElementForm]unpected width ', width)
      }
      return index
    },
    registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = this.getLabelWidthIndex(oldVal)
        this.potentialLabelWidthArr.splice(index, 1, val)
      }
      else if (val) {
        this.potentialLabelWidthArr.push(val)
      }
    },
    deregisterLabelWidth(val) {
      const index = this.getLabelWidthIndex(val)
      this.potentialLabelWidthArr.splice(index, 1)
    },
  },
}
</script>

<template>
  <form
    class="el-form" :class="[
      labelPosition ? `el-form--label-${labelPosition}` : '',
      { 'el-form--inline': inline },
    ]"
  >
    <slot />
  </form>
</template>
