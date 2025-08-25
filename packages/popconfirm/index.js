import Popconfirm from './src/main.vue';

/* istanbul ignore next */
Popconfirm.install = function(Vue) {
  Vue.component(Popconfirm.name, Popconfirm);
};

export default Popconfirm;
