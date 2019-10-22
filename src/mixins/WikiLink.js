export default {
  methods: {
    wiktionaryUrl(word) {
      return encodeURI('https://en.wiktionary.org/wiki/' + word);
    },
    wiktionaryUrlShort(word) {
      return this.text || 'wiktionary.org/wiki/' + word;
    },
  }
}