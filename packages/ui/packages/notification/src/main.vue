<script type="text/babel">
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
}

export default {
  data() {
    return {
      visible: false,
      title: '',
      message: '',
      duration: 4500,
      type: '',
      showClose: true,
      customClass: '',
      iconClass: '',
      onClose: null,
      onClick: null,
      closed: false,
      verticalOffset: 0,
      timer: null,
      dangerouslyUseHTMLString: false,
      position: 'top-right',
    }
  },

  computed: {
    typeClass() {
      return this.type && typeMap[this.type] ? `el-icon-${typeMap[this.type]}` : ''
    },

    horizontalClass() {
      return this.position.includes('right') ? 'right' : 'left'
    },

    verticalProperty() {
      return this.position.startsWith('top-') ? 'top' : 'bottom'
    },

    positionStyle() {
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`,
      }
    },
  },

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
        this.$el.addEventListener('transitionend', this.destroyElement)
      }
    },
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close()
        }
      }, this.duration)
    }
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown)
  },

  methods: {
    destroyElement() {
      this.$el.removeEventListener('transitionend', this.destroyElement)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },

    click() {
      if (typeof this.onClick === 'function') {
        this.onClick()
      }
    },

    close() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose()
      }
    },

    clearTimer() {
      clearTimeout(this.timer)
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    keydown(e) {
      if (e.keyCode === 46 || e.keyCode === 8) {
        this.clearTimer() // detele 取消倒计时
      }
      else if (e.keyCode === 27) { // esc关闭消息
        if (!this.closed) {
          this.close()
        }
      }
      else {
        this.startTimer() // 恢复倒计时
      }
    },
  },
}
</script>

<template>
  <transition name="el-notification-fade">
    <div
      v-show="visible" class="el-notification"
      :class="[customClass, horizontalClass]"
      :style="positionStyle"
      role="alert"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click"
    >
      <i
        v-if="type || iconClass"
        class="el-notification__icon"
        :class="[typeClass, iconClass]"
      />
      <div class="el-notification__group" :class="{ 'is-with-icon': typeClass || iconClass }">
        <h2 class="el-notification__title" v-text="title" />
        <div v-show="message" class="el-notification__content">
          <slot>
            <p v-if="!dangerouslyUseHTMLString">
              {{ message }}
            </p>
            <p v-else v-html="message" />
          </slot>
        </div>
        <div
          v-if="showClose"
          class="el-notification__closeBtn el-icon-close"
          @click.stop="close"
        />
      </div>
    </div>
  </transition>
</template>
