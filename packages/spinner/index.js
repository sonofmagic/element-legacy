import Spinner from './src/spinner.vue';

/* istanbul ignore next */
Spinner.install = function(Vue) {
  Vue.component(Spinner.name, Spinner);
};

export default Spinner;
