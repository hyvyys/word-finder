import LENGTH_FILTER_MAX from "@/models/LENGTH_FILTER_MAX";
import FILTERS from "@/models/FILTERS";
import { getLanguageCode, getLanguageName } from "@/models/LANGUAGES";

export default {
  data() {
    return {
      selectedLanguages: [],
      lengthRange: [ 6, 15 ],
      searchPhrase: '',
      requiredCharacters: '',
      filterPhrase: '',
      isSearchRegex: true,
      isSearchCaseSensitive: false,
      filters: [],
    }
  },
  created() {
    this.createFilters();
  },
  mounted() {
    this.queryToParams();
  },
  watch: {
    $route() {
      this.queryToParams();
    },
  },
  methods: {
    createFilters() {
      this.filters = FILTERS.map((f, i) => ({ ...f, index: i, value: f.default }));
    },
    resetFlags() {
      this.isSearchCaseSensitive = false;
      this.isSearchRegex = true;
    },
    encode(s) {
      // should be + but vue-router encodes plus further on, and doesn't encode space into + on its own...
      // TODO: file a bug report
      return s.replace(/ /g, "_");
    },
    decode(s) {
      return s.replace(/_/g, " ");
    },
    queryToParams() {
      let { l, i, o, r, f, rqd } = this.$route.query;
      this.selectedLanguages = (l || 'en').split(",")
        .map(l => getLanguageName(l))
        .filter(l => l);
      this.lengthRange = (r || '1,' + LENGTH_FILTER_MAX).split(',').map(i => Number(i));
      this.searchPhrase = this.decode(i || '');
      this.filterPhrase = this.decode(o || '');
      this.requiredCharacters = this.decode( rqd || '');

      if (f != null) {
        const flags = (Number('0x' + f).toString(2).padStart(FILTERS.length + 2, '0')).split('').map(d => d === '1');
        const [ isSearchRegex, isSearchCaseSensitive ] = flags.slice(0,2);
        this.isSearchRegex = isSearchRegex;
        this.isSearchCaseSensitive = isSearchCaseSensitive;
        
        const filters = flags.slice(2).slice(0, FILTERS.length);
        filters.forEach((f, i) => this.filters[i].value = f);
      }
      else {
        this.createFilters();
        this.resetFlags();
      }
    },
    paramsToQuery() {
      const { selectedLanguages, lengthRange, searchPhrase, requiredCharacters, filterPhrase, filters, isSearchCaseSensitive, isSearchRegex } = this;
      const l = selectedLanguages
        .map(l => getLanguageCode(l))
        .join(",");
      const r = lengthRange.join(',');
      const i = this.encode(searchPhrase);
      const o = this.encode(filterPhrase);
      const rqd = this.encode(requiredCharacters);
      const flags = [ isSearchRegex, isSearchCaseSensitive, ...filters.map(f => f.value) ]
        .map(v => v ? '1' : '0').join('');
      const f = Number('0b' + flags).toString(16)

      let query = { };
      if (i) query.i = i;
      if (o) query.o = o;
      if (rqd) query.rqd = rqd;
      query = {
        ...query,
        l,
        r,
        f,
      };
      return query;
    },
  }
};