<script>
import Element from 'main/index.js'
import bus from '../bus'
// import AlgoliaSearch from './search.vue';
import compoLang from '../i18n/component.json'
import { ACTION_USER_CONFIG_UPDATE } from './theme/constant.js'
import themeLoader from './theme/loader/index.vue'

const { version } = Element

export default {

  mixins: [themeLoader],
  data() {
    return {
      active: '',
      versions: [],
      version,
      verDropdownVisible: true,
      langDropdownVisible: true,
      langs: {
        'zh-CN': '中文',
        'en-US': 'English',
        'es': 'Español',
        'fr-FR': 'Français',
      },
    }
  },

  computed: {
    lang() {
      return this.$route.path.split('/')[1] || 'zh-CN'
    },
    displayedLang() {
      return this.langs[this.lang] || '中文'
    },
    langConfig() {
      return compoLang.filter(config => config.lang === this.lang)[0].header
    },
    isComponentPage() {
      return this.$route.name.startsWith('component')
    },
    isHome() {
      return this.$route.name.startsWith('home')
    },
  },
  mounted() {
    const testInnerImg = new Image()
    testInnerImg.onload = () => {
      this.$isEle = true
    }
    testInnerImg.onerror = (err) => {
      console.error(err)
    }
    testInnerImg.src = `https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/rmsportal/VmvVUItLdPNqKlNGuRHi.png?t=${Date.now()}`
  },

  created() {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = (_) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const versions = JSON.parse(xhr.responseText)
        this.versions = Object.keys(versions).reduce((prev, next) => {
          prev[next] = versions[next]
          return prev
        }, {})
      }
    }
    xhr.open('GET', '/versions.json')
    xhr.send()
    let primaryLast = '#409EFF'
    bus.$on(ACTION_USER_CONFIG_UPDATE, (val) => {
      let primaryColor = val.global['$--color-primary']
      if (!primaryColor) {
        primaryColor = '#409EFF'
      }
      const base64svg = 'data:image/svg+xml;base64,'
      const imgSet = document.querySelectorAll('h1 img')
      imgSet.forEach((img) => {
        img.src = `${base64svg}${window.btoa(window.atob(img.src.replace(base64svg, '')).replace(primaryLast, primaryColor))}`
      })
      primaryLast = primaryColor
    })
  },
  methods: {
    switchVersion(version) {
      if (version === this.version) {
        return
      }
      location.href = `${location.origin}/${this.versions[version]}/${location.hash} `
    },

    switchLang(targetLang) {
      if (this.lang === targetLang) {
        return
      }
      localStorage.setItem('ELEMENT_LANGUAGE', targetLang)
      this.$router.push(this.$route.path.replace(this.lang, targetLang))
    },

    handleVerDropdownToggle(visible) {
      this.verDropdownVisible = visible
    },

    handleLangDropdownToggle(visible) {
      this.langDropdownVisible = visible
    },
  },
}
</script>

<template>
  <div class="headerWrapper">
    <header ref="header" class="header">
      <div class="container">
        <div class="header-left">
          <h1>
            <router-link :to="`/${lang}`">
              <!-- logo -->
              <slot>
                <img src="../assets/images/element-logo.svg" alt="element-logo" class="nav-logo">
                <img src="../assets/images/element-logo-small.svg" alt="element-logo" class="nav-logo-small">
              </slot>
            </router-link>
          </h1>
          <div v-if="isComponentPage" class="header-version">
            <div class="header-divider" />
            <el-dropdown trigger="click" class="nav-dropdown header-version__dropdown" :class="{ 'is-active': verDropdownVisible }">
              <span>
                {{ version }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown" class="nav-dropdown-list" @input="handleVerDropdownToggle">
                <el-dropdown-item v-for="item in Object.keys(versions)" :key="item" @click.native="switchVersion(item)">
                  {{ item }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <!-- nav -->
        <ul class="nav">
          <li v-show="isComponentPage" class="nav-item nav-algolia-search">
            <!-- <algolia-search></algolia-search> -->
          </li>
          <li class="nav-item">
            <router-link active-class="active" :to="`/${lang}/guide`">
              {{ langConfig.guide }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link active-class="active" :to="`/${lang}/component`">
              {{ langConfig.components }}
            </router-link>
          </li>
          <li class="nav-item nav-item-theme">
            <router-link active-class="active" :to="`/${lang}/theme`">
              {{ langConfig.theme }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link active-class="active" :to="`/${lang}/resource`" exact>
              {{ langConfig.resource }}
            </router-link>
          </li>

          <!-- 语言选择器 -->
          <li class="nav-item lang-item">
            <el-dropdown trigger="click" class="nav-dropdown nav-lang" :class="{ 'is-active': langDropdownVisible }">
              <span>
                {{ displayedLang }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown" class="nav-dropdown-list" @input="handleLangDropdownToggle">
                <el-dropdown-item v-for="(value, key) in langs" :key="key" @click.native="switchLang(key)">
                  {{ value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>

<style lang="scss" scoped>
.headerWrapper {
  height: 80px;
}

.header {
  position: relative;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 80px;
  line-height: 80px;
  color: #fff;
  background-color: #fff;

  .container {
    box-sizing: border-box;
    height: 100%;
    border-bottom: 1px solid #DCDFE6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-lang-spe {
    color: #888;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 32px;
    font-weight: normal;

    a {
      display: block;
      color: #333;
      text-decoration: none;
    }

    span {
      display: inline-block;
      width: 34px;
      height: 18px;
      margin-left: 10px;
      font-size: 12px;
      line-height: 18px;
      vertical-align: middle;
      text-align: center;
      border: 1px solid rgb(255 255 255 / 50%);
      border-radius: 3px;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    line-height: 80px;
    background: transparent;
    list-style: none;

    &::before,
    &::after {
      display: table;
      content: "";
    }

    &::after {
      clear: both;
    }
  }

  .nav-logo,
  .nav-logo-small {
    vertical-align: sub;
  }

  .nav-logo-small {
    display: none;
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0;
    cursor: pointer;
    list-style: none;

    & + .nav-item {
      margin-left: 34px;
    }

    &.nav-algolia-search {
      cursor: default;
    }

    &.lang-item {
      cursor: default;

      .nav-lang {
        display: inline-flex;
        align-items: center;
        height: 80px;
        color: #888;
        cursor: pointer;

        span {
          opacity: .8;
        }

        &:hover {
          color: #409EFF;
        }

        &.active {
          font-weight: bold;
          color: #409EFF;
        }
      }
    }

    a {
      display: block;
      padding: 0 22px;
      color: #1989FA;
      text-decoration: none;
      opacity: 0.5;

      &.active,
      &:hover {
        opacity: 1;
      }

      &.active::after {
        position: absolute;
        bottom: 0;
        left: calc(50% - 15px);
        display: inline-block;
        width: 30px;
        height: 2px;
        content: '';
        background: #409EFF;
      }
    }
  }
}

.header-version {
  display: flex;
  align-items: center;
  margin-left: 24px;
}

.header-divider {
  position: relative;
  width: 1px;
  height: 80px;
  margin-right: 20px;

  &::before {
    position: absolute;
    top: calc(50% - 8px);
    width: 1px;
    height: 16px;
    content: '';
    background: #ebebeb;
  }
}

.nav-dropdown {
  display: inline-flex;
  align-items: center;
  width: auto;
  padding: 0;
  margin-bottom: 0;

  span {
    display: inline-flex;
    align-items: center;
    height: 80px;
    padding: 0 22px;
    font-size: 16px;
    line-height: 80px;
    color: #888;
    user-select: none;
    transition: .2s;

    &:hover {
      cursor: pointer;
    }
  }

  i {
    font-size: 12px;
    color: #979797;
    transform: translateY(-2px);
    transition: .2s;
  }

  &.is-active,
  &:hover {
    span,
    i {
      color: #409EFF;
    }
  }

  &.is-active i {
    transform: rotateZ(180deg) translateY(3px);
  }
}

.header-version__dropdown {
  span {
    padding: 0 16px;
  }
}

.nav-dropdown-list {
  width: auto;
}

@media (width <=850px) {
  .header {
    .nav-logo {
      display: none;
    }

    .nav-logo-small {
      display: inline-block;
    }

    .nav-item {
      margin-left: 6px;

      &.lang-item,
      & + .nav-item {
        margin-left: 10px;
      }

      a {
        padding: 0 5px;
      }
    }

    .nav-dropdown {
      span {
        padding: 0 12px;
      }
    }

    .nav-theme-switch,
    .nav-algolia-search {
      display: none;
    }
  }
}

@media (width <=700px) {
  .header {
    .container {
      padding: 0 12px;
    }

    .nav-item {
      a {
        font-size: 12px;
        vertical-align: top;
      }

      &.lang-item {
        height: 100%;

        .nav-lang {
          display: flex;
          align-items: center;

          span {
            padding-bottom: 0;
          }
        }
      }
    }

    .nav-dropdown {
      padding: 0;

      span {
        font-size: 12px;
        padding: 0 8px;
      }
    }

    .header-version {
      display: none;
    }
  }
}
</style>
