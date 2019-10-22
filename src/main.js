import Vue from 'vue'

Vue.config.productionTip = false

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// import VueObserveVisibility from 'vue-observe-visibility'
// Vue.use(VueObserveVisibility)

import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueVirtualScroller from "vue-virtual-scroller";
Vue.use(VueVirtualScroller);
 
import App from './App.vue'
import router from './router';
import store from './store';

new Vue({
  router,
  store,
  render: h => h(App),
  mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
}).$mount('#app');
