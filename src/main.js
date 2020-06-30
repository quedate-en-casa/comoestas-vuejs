import Vue from 'vue'
import App from './App.vue'
import  '@fortawesome/fontawesome-free/css/all.min.css'
import './../node_modules/bulma/css/bulma.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
