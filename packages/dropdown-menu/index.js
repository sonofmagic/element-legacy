import ElDropdownMenu from '../dropdown/src/dropdown-menu.vue';

/* istanbul ignore next */
ElDropdownMenu.install = function(Vue) {
  Vue.component(ElDropdownMenu.name, ElDropdownMenu);
};

export default ElDropdownMenu;
