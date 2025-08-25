import SkeletonItem from '../skeleton/src/item.vue';

/* istanbul ignore next */
SkeletonItem.install = function(Vue) {
  Vue.component(SkeletonItem.name, SkeletonItem);
};

export default SkeletonItem;
