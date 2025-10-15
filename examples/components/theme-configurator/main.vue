<script>
import borderRadiusEditor from './editor/borderRadius.vue'
import boxShadowEditor from './editor/boxShadow.vue'
import ColorEditor from './editor/color.vue'
import fontLineHeightEditor from './editor/fontLineHeight.vue'
import fontSizeEditor from './editor/fontSize.vue'
import fontWeightEditor from './editor/fontWeight.vue'
import simpleTextEditor from './editor/simpleText.vue'
import { filterConfigType } from './utils/utils.js'

export default {
  components: {
    ColorEditor,
    FontSizeEditor: fontSizeEditor,
    FontLineHeightEditor: fontLineHeightEditor,
    SimpleTextEditor: simpleTextEditor,
    BorderRadiusEditor: borderRadiusEditor,
    BoxShadowEditor: boxShadowEditor,
    FontWeightEditor: fontWeightEditor,
  },
  props: {
    defaultConfig: {
      type: Array,
    },
    currentConfig: {
      type: Object,
    },
    userConfig: {
      type: Object,
    },
    globalValue: {
      type: Object,
    },
  },
  data() {
    return {
      categoryDisplay: {},
    }
  },
  computed: {
    configName() {
      return this.currentConfig.name
    },
    userConfigByType() {
      return this.userConfig[filterConfigType(this.configName)]
    },
    configByOrder() {
      const list = this.currentConfig && Array.isArray(this.currentConfig.config)
        ? this.currentConfig.config
        : []
      return [...list].sort((a, b) => (a.order - b.order))
    },
  },
  watch: {
    currentConfig: {
      handler() {
        this.$nextTick(() => {
          this.$refs.mainPanel.scrollTo(0, 0)
        })
      },
    },
  },
  methods: {
    editorComponent(type) {
      switch (type) {
        case 'color':
          return ColorEditor
        case 'fontWeight':
          return fontWeightEditor
        case 'fontSize':
          return fontSizeEditor
        case 'fontLineHeight':
          return fontLineHeightEditor
        case 'borderRadius':
          return borderRadiusEditor
        case 'boxShadow':
          return boxShadowEditor
        default:
          return simpleTextEditor
      }
    },
    onChange(e) {
      this.$emit('onChange', e)
    },
    showCategory(name, key) {
      if (!name) {
        return false
      }
      if (!this.categoryDisplay[name] || this.categoryDisplay[name] === key) {
        this.categoryDisplay[name] = key
        return true
      }
      return false
    },
  },
}
</script>

<template>
  <div ref="mainPanel" class="editor-main">
    <!-- <span>{{configName}}</span> -->
    <div v-for="(config, key) in configByOrder" :key="key">
      <span
        v-if="showCategory(config.category, key + 1)"
        class="category-name"
      >
        {{ config.category }}
      </span>
      <component
        :is="editorComponent(config.type)"
        :componentName="configName"
        :config="config"
        :userConfig="userConfigByType"
        :golbalValue="globalValue"
        @onChange="onChange"
      />
    </div>
  </div>
</template>

<style>
.editor-main {
  padding: 0 18px 15px;
  overflow-y: auto;
}
.category-name {
  color: #C0C4CC;
  font-size: 18px;
  display: block;
  margin: 13px 0 3px 0;
}
</style>
