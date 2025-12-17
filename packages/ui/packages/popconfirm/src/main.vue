<script>
import ElButton from 'element-legacy/packages/button'
import ElPopover from 'element-legacy/packages/popover'
import { t } from 'element-legacy/src/locale'

export default {
  name: 'ElPopconfirm',
  components: {
    ElPopover,
    ElButton,
  },
  props: {
    title: {
      type: String,
    },
    confirmButtonText: {
      type: String,
    },
    cancelButtonText: {
      type: String,
    },
    confirmButtonType: {
      type: String,
      default: 'primary',
    },
    cancelButtonType: {
      type: String,
      default: 'text',
    },
    icon: {
      type: String,
      default: 'el-icon-question',
    },
    iconColor: {
      type: String,
      default: '#f90',
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    displayConfirmButtonText() {
      return this.confirmButtonText || t('el.popconfirm.confirmButtonText')
    },
    displayCancelButtonText() {
      return this.cancelButtonText || t('el.popconfirm.cancelButtonText')
    },
  },
  methods: {
    confirm() {
      this.visible = false
      this.$emit('confirm')
    },
    cancel() {
      this.visible = false
      this.$emit('cancel')
    },
  },
}
</script>

<template>
  <ElPopover
    v-bind="$attrs"
    v-model="visible"
    trigger="click"
  >
    <div class="el-popconfirm">
      <p class="el-popconfirm__main">
        <i
          v-if="!hideIcon"
          :class="icon"
          class="el-popconfirm__icon"
          :style="{ color: iconColor }"
        />
        {{ title }}
      </p>
      <div class="el-popconfirm__action">
        <ElButton
          size="mini"
          :type="cancelButtonType"
          @click="cancel"
        >
          {{ displayCancelButtonText }}
        </ElButton>
        <ElButton
          size="mini"
          :type="confirmButtonType"
          @click="confirm"
        >
          {{ displayConfirmButtonText }}
        </ElButton>
      </div>
    </div>
    <slot slot="reference" name="reference" />
  </ElPopover>
</template>
