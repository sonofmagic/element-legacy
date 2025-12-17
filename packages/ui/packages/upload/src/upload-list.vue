<script>
import ElProgress from 'element-legacy/packages/progress'
import Locale from 'element-legacy/src/mixins/locale'

export default {

  name: 'ElUploadList',
  components: { ElProgress },

  mixins: [Locale],

  props: {
    files: {
      type: Array,
      default() {
        return []
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    handlePreview: Function,
    listType: String,
  },

  data() {
    return {
      focusing: false,
    }
  },
  methods: {
    parsePercentage(val) {
      return Number.parseInt(val, 10)
    },
    handleClick(file) {
      this.handlePreview && this.handlePreview(file)
    },
  },
}
</script>

<template>
  <transition-group
    tag="ul"
    class="el-upload-list" :class="[
      `el-upload-list--${listType}`,
      { 'is-disabled': disabled },
    ]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :key="file.uid" class="el-upload-list__item"
      :class="[`is-${file.status}`, focusing ? 'focusing' : '']"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].includes(listType)"
          class="el-upload-list__item-thumbnail"
          :src="file.url" alt=""
        >
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document" />{{ file.name }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i
            class="el-icon-upload-success" :class="{
              'el-icon-circle-check': listType === 'text',
              'el-icon-check': ['picture-card', 'picture'].includes(listType),
            }"
          />
        </label>
        <i v-if="!disabled" class="el-icon-close" @click="$emit('remove', file)" />
        <i v-if="!disabled" class="el-icon-close-tip">{{ t('el.upload.deleteTip') }}</i> <!-- 因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上 -->
        <ElProgress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)"
        />
        <span v-if="listType === 'picture-card'" class="el-upload-list__item-actions">
          <span
            v-if="handlePreview && listType === 'picture-card'"
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="$emit('remove', file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
