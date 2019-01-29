<template>
  <div class="main-nav-content">
    <router-link to="/iJerky" exact>{{ $t('pages.search.title') }}</router-link>
    <router-link to="/iJerky/about">{{ $t('pages.about.title') }}</router-link>
  </div>
</template>

<script>
export default {
  name: 'MainNavContent',
  watch: {
    $router () {
      this.scrollActiveItemIntoView()
    }
  },
  methods: {
    scrollActiveItemIntoView () {
      this.$nextTick().then(() => {
        const activeEl = this.$el.querySelector('.router-link-exact-active')
        if (activeEl) {
          activeEl.scrollIntoView({
            behavior: 'smooth'
          })
        }
      })
    }
  },
  mounted () {
    this.$nextTick().then(() => {
      window.setTimeout(this.scrollActiveItemIntoView, 700)
    })
  }
}
</script>

<style lang="scss" scoped>
  @import "~vue-material/dist/theme/engine";

  .md-theme-default a:not(.md-button):hover {
    text-decoration: none;
  }

  .main-nav-content {
    width: 100%;

    a {
      display: block;
      font-size: 16px;
      line-height: 2em;
      text-align: center;

      &:not(.router-link-active) {
        color: inherit;
      }
    }

    .router-link-active, .router-link-active:hover {
      font-weight: bold;
      background: #ececec;
      color: #333;
    }

    .router-link-active:hover, a:hover {
      background: #dcdcdc;
    }
  }

  .main-nav-level {
    margin-bottom: 16px;
    margin-left: 20px;
  }
</style>
