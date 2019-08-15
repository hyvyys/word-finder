import Vue from 'vue';
import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
Vue.use(KeenUI);

// import App from './App';

import App from './components/App.vue';

import './styles.scss';

new Vue({
	el: '#app',
  components: { App },
  template: '<App/>'
})
