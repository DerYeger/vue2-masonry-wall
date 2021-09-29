import Vue, { VNode } from 'vue'
import Dev from './app.vue'
import MasonryWall from '@/entry'

Vue.config.productionTip = false

Vue.use(MasonryWall)

new Vue({
  render: (h): VNode => h(Dev),
}).$mount('#app')
