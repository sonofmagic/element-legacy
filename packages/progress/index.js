import ElProgress from './src/progress.vue';

/* istanbul ignore next */
ElProgress.install = function(Vue) {
  Vue.component(ElProgress.name, ElProgress);
};

export default ElProgress;
