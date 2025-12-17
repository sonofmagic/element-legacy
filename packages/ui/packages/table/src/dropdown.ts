// @ts-nocheck
import Vue from 'element-legacy/src/utils/vue'

const dropdowns = []

!Vue.prototype.$isServer && document.addEventListener('click', (event) => {
  dropdowns.forEach((dropdown) => {
    const target = event.target
    if (!dropdown || !dropdown.$el) { return }
    if (target === dropdown.$el || dropdown.$el.contains(target)) {
      return
    }
    dropdown.handleOutsideClick && dropdown.handleOutsideClick(event)
  })
})

export default {
  open(instance) {
    if (instance) {
      dropdowns.push(instance)
    }
  },

  close(instance) {
    const index = dropdowns.indexOf(instance)
    if (index !== -1) {
      dropdowns.splice(instance, 1)
    }
  },
}
