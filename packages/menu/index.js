import ElMenu from './src/menu.vue';

/* istanbul ignore next */
ElMenu.install = function(Vue) {
  Vue.component(ElMenu.name, ElMenu);
};

export default ElMenu;
