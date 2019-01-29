<template>
  <div id="app" class="container">
    <!-- HEADER -->
    <main-header/>
    <!-- MAIN -->
    <div class="container-wrapper md-layout-row">
      <main-nav />

      <div class="main-container" v-if="loading">
        <code-loading>全力載入中...</code-loading>
      </div>

      <router-view v-else />
    </div>
    <!-- FOOTER -->
    <main-footer/>
  </div>
</template>

<script>
import CodeLoading from './components/CodeLoading'
import MainHeader from './template/MainHeader'
import MainFooter from './template/MainFooter'
import MainNav from './template/MainNav'
export default {
  components: {
    CodeLoading,
    MainFooter,
    MainHeader,
    MainNav
  },
  name: 'App',
  data: () => ({
    loading: false
  }),
  created () {
    this.$router.beforeEach(this.beforeRouteRender)
    this.$router.afterEach(this.afterRouteRender)
  },
  methods: {
    beforeRouteRender (to, from, next) {
      this.loading = true
      next()
    },
    afterRouteRender () {
      this.loading = false
    }
  }
}
</script>

<style>
  body {
    height: 100%;
  }

</style>

<style lang="scss" scoped>
  @import "~vue-material/src/components/MdAnimation/variables";
  @import "~vue-material/src/components/MdLayout/mixins";
  @import "~vue-material/dist/theme/engine";

  .container {
    min-height: 100%;
    padding-top: 64px;
    display: flex;
    flex-direction: column;
    font-family: "Roboto Mono", monospace, "Microsoft JhengHei";
    transition: $md-transition-default;
    transition-property: padding-top;

  @include md-layout-small {
    padding-top: 48px;
  }

  @include md-layout-xsmall {
    padding-top: 56px;
  }

  &.splash >>> {
  .main-header .md-toolbar-row,
  .main-footer-container {
    max-width: 1312px;
    margin: 0 auto;
  }
  }
  }

  .container-wrapper {
  &:not(.splash) {
     flex: 1;
     padding-left: 230px !important;

  @include md-layout-xsmall {
    padding-left: 0 !important;
  }
  }
  }

  .main-container {
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .code-loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
