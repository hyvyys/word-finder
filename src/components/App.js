import Vue from 'vue';

import { getData } from "../logic/getData";
import { letteringOptionDefaults, letteringOptions, computeLetteringOption, getLetteringOption } from "../logic/letteringOptions";
import mapLanguage from '../logic/mapLanguage';
import { idGenerator, arrayElementsDiffer } from '../logic/utils';

import Lettering from './Lettering.vue';
import LetteringOptions from './LetteringOptions.vue';
import Worker from '../logic/lettering.worker.js';
import { parseData } from "../logic/parseData";

export default {
  components: { Lettering, LetteringOptions },

  data() {
    return ({
      words: {},
      letteringOptions: letteringOptionDefaults,
      optionsValidation: {},
      letterings: [],
      selectedLettering: null,
      idGenerator: idGenerator(),
      eventBus: new Vue(),
      worker: null,
      dataLoading: false,
    });
  },

  beforeMount() {
    this.addLettering();
    this.eventBus.$on('snack', message => this.createSnackbar(message));

    this.$on('data-fetched', e => this.onDataFetched(e));
    this.$on('data-parsed', e => this.onDataParsed(e));
  },

  computed: {
    languages: {
      get() {
        return computeLetteringOption('languages', this.letteringOptions);
      }
    }
  },

  methods: {
    async addLettering() {
      const lettering = {
        key: this.idGenerator.next().value,
        options: Object.assign({}, this.letteringOptions), // copy options of currently selected lettering to new one
        words: [],
      };
      this.letterings.push(lettering)
      this.selectLettering(lettering.key);
      this.initUpdateLettering(lettering.key);
    },

    selectLettering(key) {
      const match = this.letterings.find(l => l.key == key);
      if (this.letterings.length && match) {
        this.selectedLettering = match;
        this.letteringOptions = match.options;
      }
    },

    async applyOptions(options) {
      // sync with GUI
      this.letteringOptions = options;

      // sync with Lettering only validated options
      let validOptions = Object.assign({}, options);
      for (let key in this.optionsValidation) {
        if (this.optionsValidation[key] === false) {
          validOptions[key] = this.selectedLettering.options[key];
        }
      }

      // fetch and parse data if necessary
      let val = validOptions, oldVal = this.selectedLettering.options;
      function propDiffers(prop) {
        const newProp = computeLetteringOption(prop, val),
          oldProp = computeLetteringOption(prop, oldVal);
        if (newProp instanceof Array) {
          return arrayElementsDiffer(newProp, oldProp)
        }
        else {
          return newProp != oldProp;
        }
      }

      // fetch and parse data if necessary
      for (let prop in val) {
        if (getLetteringOption(prop).parse && propDiffers(prop)) {
          console.log(prop)
          this.initUpdateLettering(this.selectedLettering.key);
          break;
        }
      }

      // apply options to Lettering to run filters
      this.selectedLettering.options = validOptions;
    },

    validateOptions(validation) {
      this.optionsValidation = validation;
    },

    async initUpdateLettering(letteringKey) {
      // set timeout to allow reactive props to be passed
      setTimeout(() => this.fetchData(letteringKey), 0);
    },

    async fetchData(letteringKey) {
      const lettering = this.letterings.find(l => l.key == letteringKey);
      const languages = computeLetteringOption('languages', lettering.options);
      lettering.dataPending = languages.slice();
      this.dataLoading = languages.length > 0;

      for (let language of languages) {
        const mappedLanguage = mapLanguage(language);
        if (mappedLanguage) {
          if (!this.words[mappedLanguage]) {
            getData(language)
              .then((async response => {
                const data = await response.text();
                this.$emit('data-fetched', { language, data });
              }));
          }
          else {
            this.$emit('data-parsed', { language });
          }
        }
        else { // Inutipuq has no wiktionary lemma list
          // this.createSnackbar('No data for language: ' + language + '.');
        }
      }
    },

    onDataFetched({ language, data }) {
      this.parseData(language, data);
    },

    parseData(language, data, collapseAccents) {
      const mappedLanguage = mapLanguage(language);
      let worker = new Worker();
      worker.postMessage({
        action: 'parse',
        language,
        data,
        collapseAccents
      });
      worker.onmessage = (e) => {
        if (e.data.action == 'parse') {
          this.words[mappedLanguage] = e.data.words;
          this.worker = null;
          this.$emit('data-parsed', { language })
        }
      };
    },

    onDataParsed({ language }) {
      let loading = false;
      for (let lettering of this.letterings) {
        const matchIndex = lettering.dataPending.findIndex(l => l == language);
        if (matchIndex > -1) {
          lettering.dataPending.splice(matchIndex, 1);
          if (lettering.dataPending.length == 0) {
            this.eventBus.$nextTick(
              () => this.eventBus.$emit('data-ready', ({ key: lettering.key, data: this.words }))
            );
          }
          else {
            loading = true;
          }
        }
      }

      this.dataLoading = loading;
    },

    removeLettering(key) {
      const matchIndex = this.letterings.findIndex(l => l.key == key);
      if (matchIndex > -1) {
        this.letterings.splice(matchIndex, 1);
        if (key == this.selectedLettering.key && this.letterings.length) {
          let i = Math.max(matchIndex - 1, 0);
          this.selectLettering(this.letterings[i].key);
        }
      }
    },

    createSnackbar(message) {
      console.log(message)
      this.$refs.snackbarContainer.createSnackbar({ message, duration: 2000 });
    },

    getLemmasUrl(language) {
      const mappedLanguage = mapLanguage(language);
      return `https://en.wiktionary.org/wiki/Category:${mappedLanguage}_lemmas`;
    }
  },
}