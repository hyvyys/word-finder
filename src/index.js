import Vue from 'vue';

// import 'keen-ui/dist/keen-ui.min.css';
// import KeenUI from '@KeenUi';
// Vue.use(KeenUI);

// instead import individual ui components into particular components, for better tree shaking

import App from './components/App.vue';

import './styles.scss';

new Vue({
	el: '#app',
  components: { App },
  template: '<App/>'
})
