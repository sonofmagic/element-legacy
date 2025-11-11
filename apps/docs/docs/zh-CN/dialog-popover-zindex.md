## Dialog + Popover 层级复现

该示例用来观测「对话框内的表格行里嵌套 Popover」在多次打开对话框后，遮罩、对话框和 Popover 的 z-index 之间的关系。

### 操作步骤

1. 点击下方按钮打开对话框，记录遮罩（`.v-modal`）和对话框（`.el-dialog`）的 z-index，首次分别为 `2001 / 2002`。
2. 关闭对话框再次打开，遮罩与对话框的 z-index 递增为 `2003 / 2004`。
3. 再次打开后，将鼠标悬浮在表格行按钮上显示 Popover，实际 z-index 仍停留在 `2001`，没有延续到预期的 `2005`，因此 Popover 被遮罩挡住。

:::demo 将 Popover 放在表格列里，关闭后重新打开 Dialog，再 hover 表格行即可观察实际 z-index。

```html
<el-button type="primary" @click="dialogVisible = true">打开 Dialog</el-button>

<el-dialog
  title="订单列表"
  :visible.sync="dialogVisible"
  width="700px"
  @close="handleClose"
  @opened="handleOpened"
>
  <p class="demo-dialog-tip">
    打开 → 关闭 → 再次打开后，再 Hover 表格行上的「查看详情」并观察 Popover 的 z-index。
  </p>
  <el-table :data="tableData" border height="320px">
    <el-table-column prop="order" label="订单号" width="160" />
    <el-table-column prop="date" label="下单时间" width="160" />
    <el-table-column prop="name" label="客户姓名" width="120" />
    <el-table-column align="center" label="操作">
      <template slot-scope="{ row }">
        <el-popover
          placement="top"
          width="260"
          trigger="hover"
        >
          <p>订单号：{{ row.order }}</p>
          <p>客户：{{ row.name }}</p>
          <p>城市：{{ row.city }}</p>
          <div slot="reference">
            <el-button type="text" size="mini">查看详情</el-button>
          </div>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</el-dialog>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        openCount: 0,
        tableData: [
          { order: 'SO-20240701001', date: '2024-07-01', name: '王小虎', city: '上海' },
          { order: 'SO-20240701002', date: '2024-07-03', name: '张三', city: '杭州' },
          { order: 'SO-20240701003', date: '2024-07-05', name: '李四', city: '北京' },
          { order: 'SO-20240701004', date: '2024-07-08', name: '赵六', city: '深圳' },
          { order: 'SO-20240701005', date: '2024-07-12', name: '刘强', city: '长沙' },
        ],
      }
    },
    methods: {
      handleOpened() {
        this.openCount += 1
        console.log(`[Dialog] 第 ${this.openCount} 次打开`)
      },
      handleClose() {
        console.log('[Dialog] closed')
      },
    },
  }
</script>

<style>
  .demo-dialog-tip {
    margin: 0 0 16px;
    color: #909399;
  }
</style>
```

:::
