<script type="text/babel">
import ElCheckbox from 'element-legacy/packages/checkbox'
import Mousewheel from 'element-legacy/src/directives/mousewheel'
import Locale from 'element-legacy/src/mixins/locale'
import Migrating from 'element-legacy/src/mixins/migrating'
import { addResizeListener, removeResizeListener } from 'element-legacy/src/utils/resize-event'
import { debounce, throttle } from 'throttle-debounce'
import { createStore, mapStates } from './store/helper'
import TableBody from './table-body'
import TableFooter from './table-footer'
import TableHeader from './table-header'
import TableLayout from './table-layout'
import { parseHeight } from './util'

let tableIdSeed = 1

export default {
  name: 'ElTable',

  directives: {
    Mousewheel,
  },

  components: {
    TableHeader,
    TableFooter,
    TableBody,
    ElCheckbox,
  },

  mixins: [Locale, Migrating],

  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },

    size: String,

    width: [String, Number],

    height: [String, Number],

    maxHeight: [String, Number],

    fit: {
      type: Boolean,
      default: true,
    },

    stripe: Boolean,

    border: Boolean,

    rowKey: [String, Function],

    context: {},

    showHeader: {
      type: Boolean,
      default: true,
    },

    showSummary: Boolean,

    sumText: String,

    summaryMethod: Function,

    rowClassName: [String, Function],

    rowStyle: [Object, Function],

    cellClassName: [String, Function],

    cellStyle: [Object, Function],

    headerRowClassName: [String, Function],

    headerRowStyle: [Object, Function],

    headerCellClassName: [String, Function],

    headerCellStyle: [Object, Function],

    highlightCurrentRow: Boolean,

    highlightSelectionRow: {
      type: Boolean,
      default: false,
    },

    currentRowKey: [String, Number],

    emptyText: String,

    expandRowKeys: Array,

    defaultExpandAll: Boolean,

    defaultSort: Object,

    tooltipEffect: String,

    spanMethod: Function,

    selectOnIndeterminate: {
      type: Boolean,
      default: true,
    },

    indent: {
      type: Number,
      default: 16,
    },

    treeProps: {
      type: Object,
      default() {
        return {
          hasChildren: 'hasChildren',
          children: 'children',
        }
      },
    },

    lazy: Boolean,

    load: Function,
  },

  methods: {
    getMigratingConfig() {
      return {
        events: {
          expand: 'expand is renamed to expand-change',
        },
      }
    },

    setCurrentRow(row) {
      this.store.commit('setCurrentRow', row)
    },

    toggleRowSelection(row, selected) {
      this.store.toggleRowSelection(row, selected, false)
      this.store.updateAllSelected()
    },

    toggleRowExpansion(row, expanded) {
      this.store.toggleRowExpansionAdapter(row, expanded)
    },

    clearSelection() {
      this.store.clearSelection()
    },

    clearFilter(columnKeys) {
      this.store.clearFilter(columnKeys)
    },

    clearSort() {
      this.store.clearSort()
    },

    handleMouseLeave() {
      this.store.commit('setHoverRow', null)
      if (this.hoverState) { this.hoverState = null }
    },

    updateScrollY() {
      const changed = this.layout.updateScrollY()
      if (changed) {
        this.layout.notifyObservers('scrollable')
        this.layout.updateColumnsWidth()
      }
    },

    handleFixedMousewheel(event, data) {
      const bodyWrapper = this.bodyWrapper
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrapper.scrollTop
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault()
        }
        if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
          event.preventDefault()
        }
        bodyWrapper.scrollTop += Math.ceil(data.pixelY / 5)
      }
      else {
        bodyWrapper.scrollLeft += Math.ceil(data.pixelX / 5)
      }
    },

    handleHeaderFooterMousewheel(event, data) {
      const { pixelX, pixelY } = data
      if (Math.abs(pixelX) >= Math.abs(pixelY)) {
        this.bodyWrapper.scrollLeft += data.pixelX / 5
      }
    },

    // TODO 使用 CSS transform
    syncPostion() {
      const { scrollLeft, scrollTop, offsetWidth, scrollWidth } = this.bodyWrapper
      const { headerWrapper, footerWrapper, fixedBodyWrapper, rightFixedBodyWrapper } = this.$refs
      if (headerWrapper) { headerWrapper.scrollLeft = scrollLeft }
      if (footerWrapper) { footerWrapper.scrollLeft = scrollLeft }
      if (fixedBodyWrapper) { fixedBodyWrapper.scrollTop = scrollTop }
      if (rightFixedBodyWrapper) { rightFixedBodyWrapper.scrollTop = scrollTop }
      const maxScrollLeftPosition = scrollWidth - offsetWidth - 1
      if (scrollLeft >= maxScrollLeftPosition) {
        this.scrollPosition = 'right'
      }
      else if (scrollLeft === 0) {
        this.scrollPosition = 'left'
      }
      else {
        this.scrollPosition = 'middle'
      }
    },

    throttleSyncPostion: throttle(16, function () {
      this.syncPostion()
    }),

    onScroll(evt) {
      const raf = window.requestAnimationFrame
      if (!raf) {
        this.throttleSyncPostion()
      }
      else {
        raf(this.syncPostion)
      }
    },

    bindEvents() {
      this.bodyWrapper.addEventListener('scroll', this.onScroll, { passive: true })
      if (this.fit) {
        addResizeListener(this.$el, this.resizeListener)
      }
    },

    unbindEvents() {
      this.bodyWrapper.removeEventListener('scroll', this.onScroll, { passive: true })
      if (this.fit) {
        removeResizeListener(this.$el, this.resizeListener)
      }
    },

    resizeListener() {
      if (!this.$ready) { return }
      let shouldUpdateLayout = false
      const el = this.$el
      const { width: oldWidth, height: oldHeight } = this.resizeState

      const width = el.offsetWidth
      if (oldWidth !== width) {
        shouldUpdateLayout = true
      }

      const height = el.offsetHeight
      if ((this.height || this.shouldUpdateHeight) && oldHeight !== height) {
        shouldUpdateLayout = true
      }

      if (shouldUpdateLayout) {
        this.resizeState.width = width
        this.resizeState.height = height
        this.doLayout()
      }
    },

    doLayout() {
      if (this.shouldUpdateHeight) {
        this.layout.updateElsHeight()
      }
      this.layout.updateColumnsWidth()
    },

    sort(prop, order) {
      this.store.commit('sort', { prop, order })
    },

    toggleAllSelection() {
      this.store.commit('toggleAllSelection')
    },

  },

  computed: {
    tableSize() {
      const configSize = (this.$elementConfig || {}).size
      return this.size || configSize
    },

    bodyWrapper() {
      return this.$refs.bodyWrapper
    },

    shouldUpdateHeight() {
      return this.height
        || this.maxHeight
        || this.fixedColumns.length > 0
        || this.rightFixedColumns.length > 0
    },

    bodyWidth() {
      const { bodyWidth, scrollY, gutterWidth } = this.layout
      return bodyWidth ? `${bodyWidth - (scrollY ? gutterWidth : 0)}px` : ''
    },

    bodyHeight() {
      const { headerHeight = 0, bodyHeight, footerHeight = 0 } = this.layout
      if (this.height) {
        return {
          height: bodyHeight ? `${bodyHeight}px` : '',
        }
      }
      else if (this.maxHeight) {
        const maxHeight = parseHeight(this.maxHeight)
        if (typeof maxHeight === 'number') {
          return {
            'max-height': `${maxHeight - footerHeight - (this.showHeader ? headerHeight : 0)}px`,
          }
        }
      }
      return {}
    },

    fixedBodyHeight() {
      if (this.height) {
        return {
          height: this.layout.fixedBodyHeight ? `${this.layout.fixedBodyHeight}px` : '',
        }
      }
      else if (this.maxHeight) {
        let maxHeight = parseHeight(this.maxHeight)
        if (typeof maxHeight === 'number') {
          maxHeight = this.layout.scrollX ? maxHeight - this.layout.gutterWidth : maxHeight
          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight
          }
          maxHeight -= this.layout.footerHeight
          return {
            'max-height': `${maxHeight}px`,
          }
        }
      }
      return {}
    },

    fixedHeight() {
      if (this.maxHeight) {
        if (this.showSummary) {
          return {
            bottom: 0,
          }
        }
        return {
          bottom: (this.layout.scrollX && this.data.length) ? `${this.layout.gutterWidth}px` : '',
        }
      }
      else {
        if (this.showSummary) {
          return {
            height: this.layout.tableHeight ? `${this.layout.tableHeight}px` : '',
          }
        }
        return {
          height: this.layout.viewportHeight ? `${this.layout.viewportHeight}px` : '',
        }
      }
    },

    emptyBlockStyle() {
      if (this.data && this.data.length) { return null }
      let height = '100%'
      if (this.layout.appendHeight) {
        height = `calc(100% - ${this.layout.appendHeight}px)`
      }
      return {
        width: this.bodyWidth,
        height,
      }
    },

    ...mapStates({
      selection: 'selection',
      columns: 'columns',
      tableData: 'data',
      fixedColumns: 'fixedColumns',
      rightFixedColumns: 'rightFixedColumns',
    }),
  },

  watch: {
    height: {
      immediate: true,
      handler(value) {
        this.layout.setHeight(value)
      },
    },

    maxHeight: {
      immediate: true,
      handler(value) {
        this.layout.setMaxHeight(value)
      },
    },

    currentRowKey: {
      immediate: true,
      handler(value) {
        if (!this.rowKey) { return }
        this.store.setCurrentRowKey(value)
      },
    },

    data: {
      immediate: true,
      handler(value) {
        this.store.commit('setData', value)
      },
    },

    expandRowKeys: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.store.setExpandRowKeysAdapter(newVal)
        }
      },
    },
  },

  created() {
    this.tableId = `el-table_${tableIdSeed++}`
    this.debouncedUpdateLayout = debounce(50, () => this.doLayout())
  },

  mounted() {
    this.bindEvents()
    this.store.updateColumns()
    this.doLayout()

    this.resizeState = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight,
    }

    // init filters
    this.store.states.columns.forEach((column) => {
      if (column.filteredValue && column.filteredValue.length) {
        this.store.commit('filterChange', {
          column,
          values: column.filteredValue,
          silent: true,
        })
      }
    })

    this.$ready = true
  },

  destroyed() {
    this.unbindEvents()
  },

  data() {
    const { hasChildren = 'hasChildren', children = 'children' } = this.treeProps
    this.store = createStore(this, {
      rowKey: this.rowKey,
      defaultExpandAll: this.defaultExpandAll,
      selectOnIndeterminate: this.selectOnIndeterminate,
      // TreeTable 的相关配置
      indent: this.indent,
      lazy: this.lazy,
      lazyColumnIdentifier: hasChildren,
      childrenColumnName: children,
    })
    const layout = new TableLayout({
      store: this.store,
      table: this,
      fit: this.fit,
      showHeader: this.showHeader,
    })
    return {
      layout,
      isHidden: false,
      renderExpanded: null,
      resizeProxyVisible: false,
      resizeState: {
        width: null,
        height: null,
      },
      // 是否拥有多级表头
      isGroup: false,
      scrollPosition: 'left',
    }
  },
}
</script>

<template>
  <div
    class="el-table"
    :class="[{
      'el-table--fit': fit,
      'el-table--striped': stripe,
      'el-table--border': border || isGroup,
      'el-table--hidden': isHidden,
      'el-table--group': isGroup,
      'el-table--fluid-height': maxHeight,
      'el-table--scrollable-x': layout.scrollX,
      'el-table--scrollable-y': layout.scrollY,
      'el-table--enable-row-hover': !store.states.isComplex,
      'el-table--enable-row-transition': (store.states.data || []).length !== 0 && (store.states.data || []).length < 100,
    }, tableSize ? `el-table--${tableSize}` : '']"
    @mouseleave="handleMouseLeave($event)"
  >
    <div ref="hiddenColumns" class="hidden-columns">
      <slot />
    </div>
    <div
      v-if="showHeader"
      ref="headerWrapper"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__header-wrapper"
    >
      <TableHeader
        ref="tableHeader"
        :store="store"
        :border="border"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? `${layout.bodyWidth}px` : '',
        }"
      />
    </div>
    <div
      ref="bodyWrapper"
      class="el-table__body-wrapper"
      :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']"
      :style="[bodyHeight]"
    >
      <TableBody
        :context="context"
        :store="store"
        :stripe="stripe"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{
          width: bodyWidth,
        }"
      />
      <div
        v-if="!data || data.length === 0"
        ref="emptyBlock"
        class="el-table__empty-block"
        :style="emptyBlockStyle"
      >
        <span class="el-table__empty-text">
          <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
        </span>
      </div>
      <div
        v-if="$slots.append"
        ref="appendWrapper"
        class="el-table__append-wrapper"
      >
        <slot name="append" />
      </div>
    </div>
    <div
      v-if="showSummary"
      v-show="data && data.length > 0"
      ref="footerWrapper"
      v-mousewheel="handleHeaderFooterMousewheel"
      class="el-table__footer-wrapper"
    >
      <TableFooter
        :store="store"
        :border="border"
        :sum-text="sumText || t('el.table.sumText')"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :style="{
          width: layout.bodyWidth ? `${layout.bodyWidth}px` : '',
        }"
      />
    </div>
    <div
      v-if="fixedColumns.length > 0"
      ref="fixedWrapper"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed"
      :style="[{
                 width: layout.fixedWidth ? `${layout.fixedWidth}px` : '',
               },
               fixedHeight]"
    >
      <div
        v-if="showHeader"
        ref="fixedHeaderWrapper"
        class="el-table__fixed-header-wrapper"
      >
        <TableHeader
          ref="fixedTableHeader"
          fixed="left"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
        />
      </div>
      <div
        ref="fixedBodyWrapper"
        class="el-table__fixed-body-wrapper"
        :style="[{
                   top: `${layout.headerHeight}px`,
                 },
                 fixedBodyHeight]"
      >
        <TableBody
          fixed="left"
          :store="store"
          :stripe="stripe"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{
            width: bodyWidth,
          }"
        />
        <div
          v-if="$slots.append"
          class="el-table__append-gutter"
          :style="{ height: `${layout.appendHeight}px` }"
        />
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        ref="fixedFooterWrapper"
        class="el-table__fixed-footer-wrapper"
      >
        <TableFooter
          fixed="left"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
        />
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      ref="rightFixedWrapper"
      v-mousewheel="handleFixedMousewheel"
      class="el-table__fixed-right"
      :style="[{
                 width: layout.rightFixedWidth ? `${layout.rightFixedWidth}px` : '',
                 right: layout.scrollY ? `${border ? layout.gutterWidth : (layout.gutterWidth || 0)}px` : '',
               },
               fixedHeight]"
    >
      <div
        v-if="showHeader"
        ref="rightFixedHeaderWrapper"
        class="el-table__fixed-header-wrapper"
      >
        <TableHeader
          ref="rightFixedTableHeader"
          fixed="right"
          :border="border"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
        />
      </div>
      <div
        ref="rightFixedBodyWrapper"
        class="el-table__fixed-body-wrapper"
        :style="[{
                   top: `${layout.headerHeight}px`,
                 },
                 fixedBodyHeight]"
      >
        <TableBody
          fixed="right"
          :store="store"
          :stripe="stripe"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{
            width: bodyWidth,
          }"
        />
        <div
          v-if="$slots.append"
          class="el-table__append-gutter"
          :style="{ height: `${layout.appendHeight}px` }"
        />
      </div>
      <div
        v-if="showSummary"
        v-show="data && data.length > 0"
        ref="rightFixedFooterWrapper"
        class="el-table__fixed-footer-wrapper"
      >
        <TableFooter
          fixed="right"
          :border="border"
          :sum-text="sumText || t('el.table.sumText')"
          :summary-method="summaryMethod"
          :store="store"
          :style="{
            width: bodyWidth,
          }"
        />
      </div>
    </div>
    <div
      v-if="rightFixedColumns.length > 0"
      ref="rightFixedPatch"
      class="el-table__fixed-right-patch"
      :style="{
        width: layout.scrollY ? `${layout.gutterWidth}px` : '0',
        height: `${layout.headerHeight}px`,
      }"
    />
    <div v-show="resizeProxyVisible" ref="resizeProxy" class="el-table__column-resize-proxy" />
  </div>
</template>
