<script lang="jsx">
export default {
  name: 'ElTimeline',

  provide() {
    return {
      timeline: this,
    }
  },

  props: {
    reverse: {
      type: Boolean,
      default: false,
    },
  },

  render() {
    const reverse = this.reverse
    const classes = {
      'el-timeline': true,
      'is-reverse': reverse,
    }
    let slots = this.$slots.default || []
    if (reverse) {
      slots = slots.reverse()
    }
    return (
      <ul class={classes}>
        { slots }
      </ul>
    )
  },
}
</script>
