import Vue, { VNode } from 'vue'
import App from './app.vue'
import MasonryWall from '@/index'

Vue.config.productionTip = false

Vue.use(MasonryWall)

new Vue({
  render: (h): VNode => h(App),
}).$mount('#app')
