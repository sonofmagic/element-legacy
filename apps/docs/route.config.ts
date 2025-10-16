import type { Component as VueComponent } from 'vue'
import type { RouteConfig } from 'vue-router'

import langs from './i18n/route.json'
import navConfigJson from './nav.config.json'
import Play from './play/index.vue'

type Language = keyof typeof navConfigJson
type AsyncComponentLoader = () => Promise<unknown>

interface NavItem {
  path: string
  title?: string
  name?: string
  description?: string
  href?: string
  groups?: Array<{ list: NavItem[] }>
  children?: NavItem[]
}

type NavConfig = Record<Language, NavItem[]>

const navConfig = navConfigJson as NavConfig

const LOAD_MAP: Record<Language, (name: string) => AsyncComponentLoader> = {
  'zh-CN': (name: string) => {
    return () => import(`./pages/zh-CN/${name}.vue`)
  },
  'en-US': (name: string) => {
    return () => import(`./pages/en-US/${name}.vue`)
  },
  'es': (name: string) => {
    return () => import(`./pages/es/${name}.vue`)
  },
  'fr-FR': (name: string) => {
    return () => import(`./pages/fr-FR/${name}.vue`)
  },
}

function load(lang: Language, path: string): AsyncComponentLoader {
  return LOAD_MAP[lang](path)
}

const modules = import.meta.glob<{ default: VueComponent }>('./docs/**/*.md')

const LOAD_DOCS_MAP: Record<Language, (path: string) => AsyncComponentLoader> = {
  'zh-CN': (path: string) => {
    return () => modules[`./docs/zh-CN${path}.md`]()
  },
  'en-US': (path: string) => {
    return () => modules[`./docs/en-US${path}.md`]()
  },
  'es': (path: string) => {
    return () => modules[`./docs/es${path}.md`]()
  },
  'fr-FR': (path: string) => {
    return () => modules[`./docs/fr-FR${path}.md`]()
  },
}

function loadDocs(lang: Language, path: string): AsyncComponentLoader {
  return LOAD_DOCS_MAP[lang](path)
}

function registerRoute(config: NavConfig): RouteConfig[] {
  const route: RouteConfig[] = []
  Object.keys(config).forEach((langKey, index) => {
    const lang = langKey as Language
    const navs = config[lang]
    const componentRoute: RouteConfig = {
      path: `/${lang}/component`,
      redirect: `/${lang}/component/installation`,
      component: load(lang, 'component'),
      children: [],
    }
    route.push(componentRoute)

    const addRoute = (page: NavItem) => {
      if (!page.path) { return }
      const componentLoader = page.path === '/changelog'
        ? load(lang, 'changelog')
        : loadDocs(lang, page.path)
      const resolvedComponent
        = ((componentLoader as unknown as { default?: VueComponent }).default
          || componentLoader) as RouteConfig['component']
      const child: RouteConfig = {
        path: page.path.slice(1),
        meta: {
          title: page.title || page.name,
          description: page.description,
          lang,
        },
        name: `component-${lang}${page.title || page.name || ''}`,
        component: resolvedComponent,
      }

      componentRoute.children!.push(child)
    }

    navs.forEach((nav) => {
      if (nav.href) { return }
      if (nav.groups) {
        nav.groups.forEach((group) => {
          group.list.forEach(addRoute)
        })
      }
      else if (nav.children) {
        nav.children.forEach(addRoute)
      }
      else {
        addRoute(nav)
      }
    })
  })

  return route
}

let route = registerRoute(navConfig)

function generateMiscRoutes(lang: Language): RouteConfig[] {
  const guideRoute: RouteConfig = {
    path: `/${lang}/guide`, // 指南
    redirect: `/${lang}/guide/design`,
    component: load(lang, 'guide'),
    children: [
      {
        path: 'design', // 设计原则
        name: `guide-design${lang}`,
        meta: { lang },
        component: load(lang, 'design'),
      },
      {
        path: 'nav', // 导航
        name: `guide-nav${lang}`,
        meta: { lang },
        component: load(lang, 'nav'),
      },
    ],
  }

  const themeRoute: RouteConfig = {
    path: `/${lang}/theme`,
    component: load(lang, 'theme-nav'),
    children: [
      {
        path: '/', // 主题管理
        name: `theme${lang}`,
        meta: { lang },
        component: load(lang, 'theme'),
      },
      {
        path: 'preview', // 主题预览编辑
        name: `theme-preview-${lang}`,
        meta: { lang },
        component: load(lang, 'theme-preview'),
      },
    ],
  }

  const resourceRoute: RouteConfig = {
    path: `/${lang}/resource`, // 资源
    meta: { lang },
    name: `resource${lang}`,
    component: load(lang, 'resource'),
  }

  const indexRoute: RouteConfig = {
    path: `/${lang}`, // 首页
    meta: { lang },
    name: `home${lang}`,
    component: load(lang, 'index'),
  }

  return [guideRoute, resourceRoute, themeRoute, indexRoute]
}

langs.forEach((langItem) => {
  const lang = langItem.lang as Language
  route = route.concat(generateMiscRoutes(lang))
})

route.push({
  path: '/play',
  name: 'play',
  component: Play,
})

const userLanguage = localStorage.getItem('ELEMENT_LANGUAGE') || window.navigator.language || 'zh-CN'
let defaultPath = '/zh-CN'
if (userLanguage.includes('en')) {
  defaultPath = '/en-US'
}
else if (userLanguage.includes('es')) {
  defaultPath = '/es'
}
else if (userLanguage.includes('fr')) {
  defaultPath = '/fr-FR'
}
else if (userLanguage.includes('zh-')) {
  defaultPath = '/zh-CN'
}

route = route.concat([
  {
    path: '/',
    redirect: defaultPath,
  },
  {
    path: '*',
    redirect: defaultPath,
  },
])

export default route
