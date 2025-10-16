import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { createWorkspaceContext } from './context'

interface FileDescriptor {
  path: string
  content: string
}

const {
  require: workspaceRequire,
  resolveFromApps,
  resolveFromDocs,
  resolveFromPackages,
  resolveFromUi,
} = createWorkspaceContext(import.meta.url)

console.log()
process.on('exit', () => {
  console.log()
})

if (!process.argv[2]) {
  console.error('[组件名]必填 - Please enter new component name')
  process.exit(1)
}

const fileSave = workspaceRequire('file-save') as any
const uppercamelcase = workspaceRequire('uppercamelcase') as (value: string) => string

const componentname = process.argv[2]
const chineseName = process.argv[3] || componentname
const ComponentName = uppercamelcase(componentname)
const packagePath = resolveFromPackages(componentname)

const files: FileDescriptor[] = [
  {
    path: join(packagePath, 'index.js'),
    content: `import ${ComponentName} from './src/main.vue';

/* istanbul ignore next */
${ComponentName}.install = function(Vue) {
  Vue.component(${ComponentName}.name, ${ComponentName});
};

export default ${ComponentName};`,
  },
  {
    path: join(packagePath, 'src/main.vue'),
    content: `<template>
  <div class="el-${componentname}"></div>
</template>

<script>
export default {
  name: 'El${ComponentName}'
};
</script>`,
  },
  {
    path: resolveFromDocs('docs', 'zh-CN', `${componentname}.md`),
    content: `## ${ComponentName} ${chineseName}`,
  },
  {
    path: resolveFromDocs('docs', 'en-US', `${componentname}.md`),
    content: `## ${ComponentName}`,
  },
  {
    path: resolveFromDocs('docs', 'es', `${componentname}.md`),
    content: `## ${ComponentName}`,
  },
  {
    path: resolveFromDocs('docs', 'fr-FR', `${componentname}.md`),
    content: `## ${ComponentName}`,
  },
  {
    path: resolveFromUi('test', 'unit', 'specs', `${componentname}.spec.js`),
    content: `import { createTest, destroyVM } from '../util';
import ${ComponentName} from 'packages/${componentname}';

describe('${ComponentName}', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(${ComponentName}, true);
    expect(vm.$el).to.exist;
  });
});
`,
  },
  {
    path: resolveFromApps('theme-chalk', 'src', `${componentname}.scss`),
    content: `@import "mixins/mixins";
@import "common/var";

@include b(${componentname}) {
}`,
  },
  {
    path: resolveFromUi('types', `${componentname}.d.ts`),
    content: `import { ElementUIComponent } from './component'

/** ${ComponentName} Component */
export declare class El${ComponentName} extends ElementUIComponent {
}`,
  },
]

const componentsFile = workspaceRequire(resolveFromUi('components.json')) as Record<string, string>

if (componentsFile[componentname]) {
  console.error(`${componentname} 已存在.`)
  process.exit(1)
}
componentsFile[componentname] = `./packages/${componentname}/index.js`
fileSave(resolveFromUi('components.json'))
  .write(JSON.stringify(componentsFile, null, '  '), 'utf8')
  .end('\n')

const sassPath = resolveFromApps('theme-chalk', 'src', 'index.scss')
const sassImportText = `${readFileSync(sassPath)}@import "./${componentname}.scss";`
fileSave(sassPath)
  .write(sassImportText, 'utf8')
  .end('\n')

const elementTsPath = resolveFromUi('types', 'element-ui.d.ts')

let elementTsText = `${readFileSync(elementTsPath)}
/** ${ComponentName} Component */
export class ${ComponentName} extends El${ComponentName} {}`

const index = elementTsText.indexOf('export') - 1
const importString = `import { El${ComponentName} } from './${componentname}'`

elementTsText = `${elementTsText.slice(0, index)}${importString}\n${elementTsText.slice(index)}`

fileSave(elementTsPath)
  .write(elementTsText, 'utf8')
  .end('\n')

files.forEach((file) => {
  const dir = dirname(file.path)
  try {
    mkdirSync(dir, { recursive: true })
  }
  catch {
    // directory already exists
  }
  fileSave(file.path)
    .write(file.content, 'utf8')
    .end('\n')
})

const navConfigFile = workspaceRequire(resolveFromDocs('nav.config.json')) as Record<string, any[]>

Object.keys(navConfigFile).forEach((lang) => {
  const groups = navConfigFile[lang][4].groups
  groups[groups.length - 1].list.push({
    path: `/${componentname}`,
    title: lang === 'zh-CN' && componentname !== chineseName
      ? `${ComponentName} ${chineseName}`
      : ComponentName,
  })
})

fileSave(resolveFromDocs('nav.config.json'))
  .write(JSON.stringify(navConfigFile, null, '  '), 'utf8')
  .end('\n')

console.log('DONE!')
