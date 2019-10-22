function randomElement(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export default {
  data() {
    return {
      wordBank: [],
      pickedWords: {},
      pinnedLetters: {},
      selectedLetter: null,
    };
  },
  computed: {
    letters() {
      return Object.keys(this.pickedWords).sort();
    },
  },
  mounted() {
    this.swapAll();
  },
  watch: {
    wordBank() {
      this.pickedWords = {};
      this.wordBank.forEach(entry => {
        if (!this.pickedWords[entry.letter])
          this.drawWord(entry);
      });
    },
  },
  methods: {
    drawWord(entry) {
      const words = entry.words.slice();
      // remove the currently picked word from set to make sure it doesn't get drawn again this time around
      if (entry.words.length > 1) {
        const i = words.indexOf(this.getPickedWord(entry.letter));
        words.splice(i, 1);
      }
      let word = randomElement(words);
      this.setWord(entry.letter, word);
    },
    setWord(letter, word) {
      if (word) {
        const entry = this.pickedWords[letter];
        if (!entry)
          this.$set(this.pickedWords, letter, [ word ]);
        else {
          const existing = entry.findIndex(w => w === word);
          if (existing > -1) entry.splice(existing, 1);
          entry.unshift(word);
        }
      }
    },
    getLetterWords(letter) {
      const e = this.wordBank.find(e => e.letter === letter)
      return e ? e.words : [];
    },
    getPickedWord(letter) {
      const entry = this.pickedWords[letter];
      const word = entry ? entry[0] : null;
      return word;
    },
    pin(l, val = true) {
      this.$set(this.pinnedLetters, l, val);
    },
    unpin(l) {
      this.pin(l, false);
    },
    togglePin(l) {
      this.pin(l, !this.pinnedLetters[l]);
    },
    unpinAll() {
      this.pinnedLetters = {};
    },
    swapWord(l) {
      const entry = this.wordBank.find(e => e.letter === l)
      if (entry) {
        this.drawWord(entry);
      }
    },
    swapAll() {
      this.wordBank.forEach(entry => {
        if (!this.pinnedLetters[entry.letter])
          this.drawWord(entry);
      });
    },
  },
}