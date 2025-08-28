import Link from './src/main.vue';

/* istanbul ignore next */
Link.install = function(Vue) {
  Vue.component(Link.name, Link);
};

export default Link;
