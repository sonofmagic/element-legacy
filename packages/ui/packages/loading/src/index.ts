/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
// @ts-nocheck
import Vue from '../../../src/utils/vue';
import loadingVue from './loading.vue';
import { addClass, removeClass, getStyle } from '../../../src/utils/dom';
import { PopupManager } from '../../../src/utils/popup';
import afterLeave from '../../../src/utils/after-leave';
import merge from '../../../src/utils/merge';

const LoadingConstructor = Vue.extend(loadingVue);

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customClass: ''
};

let fullscreenLoading;

LoadingConstructor.prototype.originalPosition = '';
LoadingConstructor.prototype.originalOverflow = '';
LoadingConstructor.prototype.positionSet = false;

LoadingConstructor.prototype.close = function() {
  if (this.fullscreen) {
    fullscreenLoading = undefined;
  }
  afterLeave(this, _ => {
    const target = this.fullscreen || this.body
      ? (typeof document !== 'undefined' ? document.body : this.target)
      : this.target;
    if (!target) return;
    removeClass(target, 'el-loading-parent--relative');
    removeClass(target, 'el-loading-parent--hidden');
    if (this.originalOverflow !== undefined && this.originalOverflow !== null) {
      target.style.overflow = this.originalOverflow;
    }
    if (this.positionSet && this.originalPosition !== undefined && this.originalPosition !== null) {
      target.style.position = this.originalPosition;
    }
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.$destroy();
  }, 300);
  this.visible = false;
};

const addStyle = (options, parent, instance) => {
  let maskStyle = {};
  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position');
    instance.originalOverflow = getStyle(document.body, 'overflow');
    maskStyle.zIndex = PopupManager.nextZIndex();
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position');
    instance.originalOverflow = getStyle(document.body, 'overflow');
    ['top', 'left'].forEach(property => {
      let scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
      maskStyle[property] = options.target.getBoundingClientRect()[property] +
        document.body[scroll] +
        document.documentElement[scroll] +
        'px';
    });
    ['height', 'width'].forEach(property => {
      maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px';
    });
  } else {
    instance.originalPosition = getStyle(parent, 'position');
    instance.originalOverflow = getStyle(parent, 'overflow');
  }
  Object.keys(maskStyle).forEach(property => {
    instance.$el.style[property] = maskStyle[property];
  });
};

const Loading = (options = {}) => {
  if (Vue.prototype.$isServer) return;
  options = merge({}, defaults, options);
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target);
  }
  options.target = options.target || document.body;
  if (options.target !== document.body) {
    options.fullscreen = false;
  } else {
    options.body = true;
  }
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading;
  }

  let parent = options.body ? document.body : options.target;
  let instance = new LoadingConstructor({
    el: document.createElement('div'),
    data: options
  });

  addStyle(options, parent, instance);
  const shouldAddRelative = instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed' && instance.originalPosition !== 'sticky';
  if (shouldAddRelative) {
    addClass(parent, 'el-loading-parent--relative');
    const needsPosition = !instance.originalPosition || instance.originalPosition === 'static';
    if (needsPosition) {
      parent.style.position = 'relative';
      instance.positionSet = true;
    }
  }
  if (options.fullscreen && options.lock) {
    addClass(parent, 'el-loading-parent--hidden');
    parent.style.overflow = 'hidden';
  }
  parent.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true;
  });
  if (options.fullscreen) {
    fullscreenLoading = instance;
  }
  return instance;
};

export default Loading;
