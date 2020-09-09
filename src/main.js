import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'vuescroll/dist/vuescroll.css';

Vue.config.productionTip = false
Vue.use(ElementUI)

// Vue.use(Iconfont)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')