import u2Component from 'u2-component'
import 'u2-component/style'

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(u2Component)
app.mount('#app')
