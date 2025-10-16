import { writeFileSync } from 'node:fs'
import { EOL } from 'node:os'
import process from 'node:process'
import { createWorkspaceContext } from './context'

type TemplateRenderer = (template: string, context: Record<string, string>) => string
type ComponentDictionary = Record<string, string>

const { require: workspaceRequire, resolveFromUi } = createWorkspaceContext(import.meta.url)
const render = workspaceRequire('json-templater/string') as TemplateRenderer
const uppercamelcase = workspaceRequire('uppercamelcase') as (value: string) => string
const pkg = workspaceRequire(resolveFromUi('package.json')) as { version?: string }
const rawComponents = workspaceRequire(resolveFromUi('components.json')) as ComponentDictionary
const OUTPUT_PATH = resolveFromUi('src', 'index.ts')

const IMPORT_TEMPLATE = 'import {{name}} from \'../packages/{{package}}/index\';'
const INSTALL_COMPONENT_TEMPLATE = '  {{name}}'
const MAIN_TEMPLATE = `/* Automatically generated don't modify this file! */

{{include}}
import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
{{install}},
  CollapseTransition
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  CollapseTransition,
  Loading,
{{list}}
}

export default {
  version: '{{version}}',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
{{list}}
};
`

const components: ComponentDictionary = { ...rawComponents }
delete components.font

const componentNames = Object.keys(components)
const includeComponentTemplate: string[] = []
const installTemplate: string[] = []
const listTemplate: string[] = []

componentNames.forEach((name) => {
  const componentName = uppercamelcase(name)

  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name,
  }))

  if (!['Loading', 'MessageBox', 'Notification', 'Message', 'InfiniteScroll'].includes(componentName)) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name,
    }))
  }

  if (componentName !== 'Loading') {
    listTemplate.push(`  ${componentName}`)
  }
})

const template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(EOL),
  install: installTemplate.join(`,${EOL}`),
  version: process.env.VERSION || pkg.version || '',
  list: listTemplate.join(`,${EOL}`),
})

writeFileSync(OUTPUT_PATH, template)
console.log('[build entry] DONE:', OUTPUT_PATH)
