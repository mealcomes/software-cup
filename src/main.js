import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import Chat from 'vue3-beautiful-chat'
import 'element-plus/dist/index.css'
import "./style.css"
// import "//at.alicdn.com/t/c/font_4539827_o6tod6lv17j.css"
import '@/socket/index.js'

const app = createApp(App)
app.use(ElementPlus)
.use(Chat)
.mount('#app')
