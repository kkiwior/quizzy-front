import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {
  store
} from './store'

axios.defaults.baseURL = "http://localhost:8000/api/"
axios.defaults.headers.get['Accept'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
Vue.config.productionTip = false

Vue.use(VueAxios, axios);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')