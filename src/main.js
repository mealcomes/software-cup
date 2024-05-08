import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import VueDropdown from '@tomoeed/vue-dropdown';
import 'element-plus/dist/index.css'
import "./style.css"
import '@/socket/index.js'

const app = createApp(App)
app.use(ElementPlus)
.use(VueDropdown, {
    dropdown: 'j-dropdown',
    menu: 'j-dropdown-menu',
    menuitem: 'j-dropdown-menuitem'
})
.mount('#app')
