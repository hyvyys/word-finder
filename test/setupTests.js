import Vue from 'vue';
import KeenUI from 'keen-ui';
Vue.use(KeenUI);

// Tippy fix for KeenUI ui-select
global.document.createRange = () => ({
  setStart: () => { },
  setEnd: () => { },
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});