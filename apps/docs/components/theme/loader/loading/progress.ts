import Vue from 'vue'
import ProgressBar from './progress.vue'

declare module 'vue/types/vue' {
  // Augment Vue instances with progress bar reference used across the docs app.
  interface Vue {
    $bar?: Vue
  }
}

const progressBar = new Vue(ProgressBar).$mount()

Vue.prototype.$bar = progressBar

if (progressBar.$el instanceof Element) {
  document.body.appendChild(progressBar.$el)
}
