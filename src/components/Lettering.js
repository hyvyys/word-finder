import Vue from 'vue';
import * as clipboard from "clipboard-polyfill"
import { letteringOptionDefaults, letteringOptions, computeLetteringOption, hasFilter } from "../logic/letteringOptions";
import mapLanguage from '../logic/mapLanguage';
import { capitalize, randomElement } from '../logic/utils';
import Worker from '../logic/lettering.worker.js';

export default {
  props: {
    eventBus: Vue,
    options: { type: Object },
    dataPending: Array,
    isSelected: Boolean,
    loading: Boolean,
  },

  computed: {
    languages: function () {
      return computeLetteringOption('languages', this.options);
    }
  },

  data() {
    return ({
      title: '',
      words: [],
      filteredWords: [],
      drawnWords: [],
      formattedDrawnWords: [],
      filterSatisfaction: [],
      focusedOption: null,
      state: {
        filterLoading: false,
      },
      worker: null,
      clickedLetter: '',
      clickStartX: 0,
      lastClick: 0,
    })
  },

  mounted() {
    this.setTitle();

    this.eventBus.$on('data-ready', ({ key, data }) => {
      if (key == this.$vnode.key) {
        this.mergeWords(data);
      }
    });

    this.eventBus.$on('option-focused', prop => {
      this.focusedOption = null;
      if (hasFilter(prop)) {
        this.focusedOption = prop;
        this.checkFilterSatisfaction();
      }
    });
  },

  watch: {
    options(val, oldVal) {
      if (val != oldVal) {
        for (let prop in val) {
          if (val[prop] != oldVal[prop]) {
            if (hasFilter(prop)) {
              this.filter();
              return;
            }
          }
        }
        this.formatLettering();
      }
    },
  },

  methods: {
    setTitle() {
      if (this.languages.length > 0)
        this.title = this.languages.join(', ');
    },

    mergeWords(allData) {
      this.setTitle();

      let data = [];
      for (let language of this.languages) {
        const mappedLanguage = mapLanguage(language);
        let words = allData[mappedLanguage];
        if (!words) {
          return;
        }
        data.push(words);
      }

      if (this.worker) {
        this.worker.terminate();
        console.log('terminated')
      }
      this.worker = new Worker();
      this.worker.postMessage({
        action: 'merge',
        words: data,
        collapseAccents: this.options.collapseAccents,
      });
      this.worker.onmessage = (e) => {
        if (e.data.action == 'merge') {
          let words = e.data.result;
          if (this.languages.length > 1) {
            words = words
              .sort((a, b) => a.letter.localeCompare(b.letter, 'en'))
          }
          this.words = words
          this.worker = null;
          this.filter();
        }
      };
    },

    formatLettering() {
      if (this.options.capitalize) {
        this.formattedDrawnWords = this.drawnWords.map(w => ({ ...w, word: capitalize(w.word) }));
      }
      else {
        this.formattedDrawnWords = this.drawnWords;
      }
    },

    pickWords() {
      this.drawnWords = this.filteredWords.map(({ letter, words }) =>
        ({ letter, word: randomElement(words) }));
      this.formatLettering();
    },

    swapWordStart(letter, $event) {
      this.clickedLetter = letter;
      this.clickStartX = $event.screenX;
      let now = Date.now();
      if (now - this.lastClick < 900)
        $event.preventDefault();
      this.lastClick = now;
    },
    swapWordEnd(letter, $event) {
      if (Math.abs(this.clickStartX - $event.screenX) < 2 )
        if (this.clickedLetter == letter)
          this.swapWord(letter);

    },

    swapWord(letter) {
      const entry = this.drawnWords.find(e => e.letter == letter);
      const words = this.filteredWords.find(e => e.letter == letter).words.slice();
      if (words.length > 1) {
        const i = words.indexOf(entry.word);
        words.splice(i, 1)
        entry.word = randomElement(words);
        this.formatLettering();
      }
      else {
        this.eventBus.$emit('snack', 'Only one word matches the filters.');
      }
    },

    filter() {
      let options = {};
      for (let key in this.options) {
        options[key] = computeLetteringOption(key, this.options);
      }

      this.state.filterLoading = true;
      if (this.worker) {
        this.worker.terminate();
      }
      this.worker = new Worker();
      this.worker.postMessage({
        action: 'filter',
        words: this.words,
        options: options,
      });

      this.worker.onmessage = (e) => {
        if (e.data.action == 'filter') {
          this.state.filterLoading = false;
          let filterSatisfaction;
          ({ data: this.filteredWords, filterSatisfaction } = e.data.result);
          this.pickWords();
          this.formatLettering();
          this.worker = null;
          this.checkFilterSatisfaction();
        }
      };
    },

    checkFilterSatisfaction() {
      let prop = this.focusedOption;
      /* for each letter, whether the filtered words match focused filter */
      this.filterSatisfaction = this.filteredWords.map(
        ({ filterSatisfaction: sat }) => sat[prop]
      );
    },

    copy() {
      clipboard.writeText(this.drawnWords.map(w => w.word).join(' '));
      this.$emit('copy');
    },

    remove() {
      if (this.worker)
        this.worker.terminate();
      this.$emit('remove');
    }
  },
}