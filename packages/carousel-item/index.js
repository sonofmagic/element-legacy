import ElCarouselItem from '../carousel/src/item.vue';

/* istanbul ignore next */
ElCarouselItem.install = function(Vue) {
  Vue.component(ElCarouselItem.name, ElCarouselItem);
};

export default ElCarouselItem;
