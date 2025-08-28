import ElBreadcrumb from './src/breadcrumb.vue';

/* istanbul ignore next */
ElBreadcrumb.install = function(Vue) {
  Vue.component(ElBreadcrumb.name, ElBreadcrumb);
};

export default ElBreadcrumb;
