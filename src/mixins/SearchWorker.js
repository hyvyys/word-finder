import title from "@/models/title";
import getData from "@/models/getData";
import { mapLanguage } from '@/models/LANGUAGES';
import SearchQuery from "@/mixins/SearchQuery";
import LookupWorker from "worker-loader!@/models/lookup.worker";

export default {
  mixins: [
    SearchQuery,
  ],
  data() {
    return { 
      fetchedLanguages: {},
      searching: false,
      wordBank: [],
      resultCount: null,
    };
  },
  created() {
    this.createWorker();
  },
  mounted() {
    this.search();
  },
  beforeDestroy() {
    this.worker.terminate();
    this.worker = null;
  },
  watch: {
    $route() {
      this.search();
    },
  },
  methods: {
    createWorker() {
      this.worker = new LookupWorker();
      this.worker.onmessage = (event) => {
        const { action, ...payload } = event.data;
        switch (action) {
          case 'didPushData': {
            const { language } = payload;
            this.fetchedLanguages[language] = true;
            this.search();
            break;
          }
          case 'results': {
            const { words, resultCount } = payload;
            this.wordBank = words;
            this.resultCount = resultCount;
            this.searching = false;
            break;
          }
        }
      }
    },

    async fetch() {
      const languages = this.selectedLanguages
        .map(mapLanguage)
        .filter(language => this.fetchedLanguages[language] == null)
      languages.forEach(language => {
        this.fetchedLanguages[language] = false;
        getData(language).then(data => {
          this.worker.postMessage({ action: 'pushData', language, data })
        });
      });
    },

    search(languages) {
      this.searching = true;
      this.fetch();
      languages = this.selectedLanguages.map(mapLanguage);
      if (languages.some(l => !this.fetchedLanguages[l])) {
        return;
      }
      const query = { 
        languages,
        lengthRange: this.lengthRange,
        searchPhrase: this.searchPhrase,
        requiredCharacters: this.requiredCharacters,
        filterPhrase: this.filterPhrase,
        isRegex: this.isSearchRegex, 
        isCaseSensitive: this.isSearchCaseSensitive,
        filters: this.filters.map(f => f.value),
      };
      document.title = title({ search: query.searchPhrase, languages });
      this.worker.postMessage({ action: 'query', query });
    },
  },
};