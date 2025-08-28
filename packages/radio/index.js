import Radio from './src/radio.vue';

/* istanbul ignore next */
Radio.install = function(Vue) {
  Vue.component(Radio.name, Radio);
};

export default Radio;
