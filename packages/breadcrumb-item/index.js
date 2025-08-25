import ElBreadcrumbItem from '../breadcrumb/src/breadcrumb-item.vue';

/* istanbul ignore next */
ElBreadcrumbItem.install = function(Vue) {
  Vue.component(ElBreadcrumbItem.name, ElBreadcrumbItem);
};

export default ElBreadcrumbItem;
