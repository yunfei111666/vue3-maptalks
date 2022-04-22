import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '@/assets/css/global.less'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import ClickOutside from './utils/directive/clickOutside'


const app = createApp(App);
app.directive('click-outside', ClickOutside)
app.use(store).use(router).mount('#app');
