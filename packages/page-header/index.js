import PageHeader from './src/main.vue';

/* istanbul ignore next */
PageHeader.install = function(Vue) {
  Vue.component(PageHeader.name, PageHeader);
};

export default PageHeader;
