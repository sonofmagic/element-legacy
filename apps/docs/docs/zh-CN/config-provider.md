## Config Provider 全局配置

用于为一组组件提供统一的默认行为。

### 基础用法

通过 Config Provider 设置组件默认尺寸、按钮文案空格规则、Message 最大并发数量。

:::demo

```html
<template>
  <el-config-provider
    size="small"
    :button="{ autoInsertSpace: true }"
    :message="{ max: 1 }"
  >
    <div class="demo-config-provider">
      <el-button type="primary">按钮</el-button>
      <el-button type="primary" @click="openMessages">打开消息</el-button>
      <el-input
        v-model="input"
        placeholder="继承全局尺寸"
        style="width: 180px; margin-left: 12px;"
      />
    </div>
  </el-config-provider>
</template>

<script>
  export default {
    data() {
      return {
        input: ''
      };
    },
    methods: {
      openMessages() {
        this.$message('第一条消息');
        this.$message('第二条消息');
        this.$message('第三条消息（超出最大值会关闭最早的消息）');
      }
    }
  };
</script>
```

:::

### 局部覆盖

可以在内部再次嵌套 Config Provider 来覆盖局部配置。

:::demo

```html
<template>
  <el-config-provider size="mini">
    <el-button>迷你按钮</el-button>
    <el-config-provider :button="{ autoInsertSpace: false }" size="medium">
      <el-button type="primary">中文</el-button>
    </el-config-provider>
  </el-config-provider>
</template>
```

:::

### Config Provider Attributes

| 参数      | 说明                               | 类型   | 可选值                             | 默认值 |
| --------- | ---------------------------------- | ------ | ---------------------------------- | ------ |
| tag       | 渲染的元素标签                     | string | —                                  | div    |
| size      | 作为后代组件的默认尺寸             | string | large / medium / small / mini      | —      |
| z-index   | 初始 z-index，影响弹出类组件层级   | number | —                                  | 2000   |
| namespace | BEM 命名空间（预留字段）           | string | —                                  | —      |
| button    | 按钮的统一配置，支持 autoInsertSpace | object | —                                  | `{ autoInsertSpace: false }` |
| message   | Message 的全局配置                 | object | —                                  | `{}`   |

### Config Provider Button Options

| 参数            | 说明                                         | 类型    | 默认值 |
| --------------- | -------------------------------------------- | ------- | ------ |
| autoInsertSpace | 当按钮文案为两个中文字符时自动在中间插入空格 | boolean | false  |

### Config Provider Message Options

| 参数 | 说明                                         | 类型   | 默认值 |
| ---- | -------------------------------------------- | ------ | ------ |
| max  | 同时可见的 Message 最大数量，超过时关闭最早的消息 | number | —      |
