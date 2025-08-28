import ElSubmenu from '../menu/src/submenu.vue';

/* istanbul ignore next */
ElSubmenu.install = function(Vue) {
  Vue.component(ElSubmenu.name, ElSubmenu);
};

export default ElSubmenu;
