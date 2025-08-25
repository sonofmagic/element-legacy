import Backtop from './src/main.vue';

/* istanbul ignore next */
Backtop.install = function(Vue) {
  Vue.component(Backtop.name, Backtop);
};

export default Backtop;
