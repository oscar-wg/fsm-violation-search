// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' // This line here
import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'

import App from './App'
import { i18n, router } from './config'
import store from './store'
import './components'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(vueEventCalendar, {
  locale: 'en',
  color: '#5cb85c',
  weekStartOn: '1'
})

// change single option
Vue.material.locale.dateFormat = 'YYYY/MM/DD'

// change multiple options
Vue.material = {
  ...Vue.material,
  locale: {
    ...Vue.material.locale,
    dateFormat: 'YYYY/MM/DD',
    firstDayOfAWeek: 1
  }
}

sync(store, router)

document.addEventListener('DOMContentLoaded', () => {
  const app = new Vue({
    name: 'Root',
    router,
    store,
    i18n,
    render: mount => mount(App)
  })

  router.onReady(() => {
    app.$mount('#app')
  })
})
