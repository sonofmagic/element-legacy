## Config Provider

Provide global defaults for a part of your app.

### Basic Usage

Wrap your view with Config Provider to set default size, enable Chinese spacing for buttons, and cap the number of Message instances.

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
      <el-button type="primary" @click="openMessages">Open messages</el-button>
      <el-input
        v-model="input"
        placeholder="inherits size"
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
        this.$message('first message');
        this.$message('second message');
        this.$message('third message (older ones close when max is reached)');
      }
    }
  };
</script>
```

:::

### Scoped Overrides

Nest another Config Provider to override part of the configuration.

:::demo

```html
<template>
  <el-config-provider size="mini">
    <el-button>Mini button</el-button>
    <el-config-provider :button="{ autoInsertSpace: false }" size="medium">
      <el-button type="primary">中文</el-button>
    </el-config-provider>
  </el-config-provider>
</template>
```

:::

### Config Provider Attributes

| Attribute | Description | Type | Accepted Values | Default |
| --------- | ----------- | ---- | --------------- | ------- |
| tag | Rendered element tag | string | — | div |
| size | Default size applied to descendants | string | large / medium / small / mini | — |
| z-index | Initial z-index for popup based components | number | — | 2000 |
| namespace | BEM namespace (reserved) | string | — | — |
| button | Button configuration, supports `autoInsertSpace` | object | — | `{ autoInsertSpace: false }` |
| message | Message configuration | object | — | `{}` |

### Config Provider Button Options

| Attribute | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| autoInsertSpace | Insert a space when the label is exactly two Chinese characters | boolean | false |

### Config Provider Message Options

| Attribute | Description | Type | Default |
| --------- | ----------- | ---- | ------- |
| max | Maximum number of concurrent Message instances, closes the earliest when exceeded | number | — |
