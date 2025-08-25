import ElMenuItem from '../menu/src/menu-item.vue';

/* istanbul ignore next */
ElMenuItem.install = function(Vue) {
  Vue.component(ElMenuItem.name, ElMenuItem);
};

export default ElMenuItem;
