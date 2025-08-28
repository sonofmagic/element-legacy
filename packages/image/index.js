import Image from './src/main.vue';

/* istanbul ignore next */
Image.install = function(Vue) {
  Vue.component(Image.name, Image);
};

export default Image;
