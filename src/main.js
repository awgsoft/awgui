import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

Vue.use(BootstrapVue)
Vue.component('VueSlider', VueSlider)

new Vue({
  el: '#app',
  render: h => h(App)
})
