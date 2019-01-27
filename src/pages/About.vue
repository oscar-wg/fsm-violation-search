<template>
  <page-container centered :title="$t('pages.about.title')">
    <section class="page-container-section">

      <header class="home-header">
        <div class="home-logo">
          <logo-vue-material animated />
        </div>
        <div class="home-call">
          <h1 class="home-name">iJerky</h1>
          <p>澳門交通違例查詢 APP</p>
        </div>
      </header>

      <div class="md-layout md-gutter md-alignment-top-left">

        <div class="md-layout-item md-xsmall-size-100">
          <md-card class="md-primary" md-theme="nuxt" md-with-hover @click.native="openLink('https://github.com/oscar-wg')">
            <md-ripple>
              <md-card-header>
                <md-card-header-text>
                  <div class="md-title">Universal App with Vue.js</div>
                  <div class="md-subhead">Styling with vue-material</div>
                </md-card-header-text>

                <md-card-media>
                  <img src="https://vuejs.org/images/logo.png" alt="vue.js">
                </md-card-media>
              </md-card-header>

              <md-card-content>
                An open source app build with Node.js, getting data from government by build in crawler.
              </md-card-content>
            </md-ripple>
          </md-card>
        </div>

        <div class="md-layout-item md-xsmall-size-100">
          <md-card class="md-primary" md-theme="nuxt" md-with-hover @click.native="openLink('http://kamfu.net')">
            <md-ripple>
              <md-card-header>
                <md-card-header-text>
                  <div class="md-title">Oscar</div>
                  <div class="md-subhead">Macau Developer</div>
                </md-card-header-text>

                <md-card-media>
                  <img src="https://cdn.shopify.com/s/files/1/1061/1924/products/Yellow_Moon_Emoji_large.png?v=1480481044" alt="oscar icon">
                </md-card-media>
              </md-card-header>

              <md-card-content>
                A creative programmer, always keep learning and try something to make life better.
              </md-card-content>
            </md-ripple>
          </md-card>
        </div>
      </div>

    </section>
  </page-container>
</template>

<script>
export default {
  name: 'About',
  methods: {
    openLink (link) {
      window.open(link, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~vue-material/src/components/MdAnimation/variables";
  @import "~vue-material/src/components/MdLayout/mixins";
  @import "~vue-material/dist/theme/engine";
  @import "~vue-material/dist/components/MdCard/theme";

  .home-header {
    text-align: center;
  }

  .home-logo {
    max-width: 200px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .logo-vue-material {
    width: 100%;
  }

  .home-call {
    margin-top: 24px;
    flex: 0 0 50%;
    font-size: 18px;
    line-height: 1.6em;
  }

  .home-name {
    margin: 0;
    font-size: 50px;
    font-weight: 500;
    line-height: 1em;

    @include md-layout-xsmall {
      font-size: 36px;
    }
  }

  .home-actions {
    margin-top: 24px;
    display: flex;
    justify-content: center;

    .md-button {
      margin-left: 0;
    }
  }

  @include md-register-theme("nuxt", (
    primary: #46A37A
  ));

  .home-ecosystem {
    width: calc(100% + 32px);
    background: #f5f5f5;

    .md-layout-item {
      @include md-layout-small {
        margin-top: 16px;
      }
    }

    .md-card {
      + .md-card {
        margin-top: 24px;
      }

      &.flying {
        p {
          margin-right: 15%;
        }

        .ecosystem-logo {
          width: 100px;
          padding: 16px;
          position: absolute;
          right: -20px;
          bottom: -20px;
          z-index: 0;
          overflow: hidden;
          opacity: .38;
          background-color: rgba(#000, .26);
          border-radius: 50%;
        }
      }
    }
  }
</style>
