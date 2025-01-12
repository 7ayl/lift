// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'

const pinia=createPinia()
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.mount('#app')