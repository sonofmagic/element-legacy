import Cascader from './src/cascader.vue';

/* istanbul ignore next */
Cascader.install = function(Vue) {
  Vue.component(Cascader.name, Cascader);
};

export default Cascader;
