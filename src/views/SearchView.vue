<template>
  <div class="search-view">
    <SearchWidget class='section section-search' :searching="searching" />

    <div class="section-results">
      <div class="no-results" v-if="letters.length === 0 && !searching">
        No results. Try adjusting the filters.
      </div>
      <div class="lettering-section section" v-else-if="letters.length > 0" >
        <div class="section-header">
          <label class="section-label">Random picks</label>
          <UiButton color="primary" @click="showAll">Show all results</UiButton>
          <UiButton color="primary" @click="unpinAll">Unpin all</UiButton>
          <UiButton color="primary" @click="copyAll">Copy all</UiButton>
          <UiButton color="primary" @click="swapAll">Swap unpinned</UiButton>
        </div>
        <div class="words">
          <div
            :class="`word weight-${countClass(l)} ${ pinnedLetters[l] ? 'pinned' : ''}`"
            v-for="(l, i) in letters"
            :key="i"
          >
            <div class="count">{{ countLetterWords(l) }}</div>
            <PowerWord
              :class="{ 'pinned': pinnedLetters[l], 'selected': selectedEntry && selectedEntry.letter === l }"
              :word="getPickedWord(l)"
            >
              <UiButton :disableRipple="true" @click='togglePin(l)'>{{pinnedLetters[l] ? 'Unpin' : 'Pin'}}</UiButton>

              <UiButton v-if='!selectedEntry || selectedEntry.letter !== l'
                :disableRipple="true"
                @click='selectEntry({ letter: l, word: getPickedWord(l) })'
              >
                See
              </UiButton>
              <UiButton v-else
                :disableRipple="true"
                @click='copyWord(getPickedWord(l))'
              >
                Copy
              </UiButton>

              <UiButton :disableRipple="true" @click='swapWord(l)'>Swap</UiButton>
            </PowerWord>
          </div>
        </div>
      </div>
    </div>

    <div ref="sectionLastPicks" class="section-wrapper">
      <div class="section section-last-picks" v-if="selectedEntry">
        <label class="section-label">Last picks for {{selectedEntry.letter}}</label>
        <div class='last-picks'>
          <div class='content'>
            <PowerWordRow class='secondary'
              v-for="(word, i) in lastPicks"
              :key="i"
              :word="word"
              :first="i === 0"
              @pick="pickWord"
              @copy="copyWord"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="section-details" ref="sectionDetails">
      <div class="section">
        <label class="section-label" v-if="allResultsVisible" >
          All results ({{ allWords.length }})
        </label>
        <label class="section-label title" v-else-if="selectedEntry">
          Results starting with {{ selectedEntry.letter }} ({{ selectedEntry.words.length }})
        </label>
        <WordList v-if="selectedEntry || allWords"
          :words="allResultsVisible ? allWords : selectedEntry.words"
          @pick="pickWord"
          @copy="copyWord"
        />
      </div>
      
      <div class="section section-clipboard">
        <label class="section-label">Clipboard</label>
        <UiTextbox
          ref="clipboard"
          class="clipboard"
          placeholder="Copied word will be appended here"
          :value="clipboardText"
          @input="v => clipboardText = v"
          :multiLine="true"
          :spellcheck="false"
          :rows="10"
        />
        <UiCheckbox v-model="capitalizeClipboard">Capitalize</UiCheckbox>
      </div>
    </div>

  </div>
</template>

<script>
import SearchWorker from "@/mixins/SearchWorker";
import WordPicker from "@/mixins/WordPicker";
import UiTextbox from "keen-ui/src/UiTextbox";
import UiCheckbox from "keen-ui/src/UiCheckbox";
import SearchWidget from "@/components/SearchWidget";
import WordList from "@/components/WordList";
import UiButton from "@/components/UiButton";
import PowerWord from "@/components/PowerWord";
import PowerWordRow from "@/components/PowerWordRow";

export default {
  name: 'search-view',
  mixins: [
    SearchWorker,
    WordPicker,
  ],
  components: {
    UiTextbox,
    UiCheckbox,
    SearchWidget,
    WordList,
    UiButton,
    PowerWord,
    PowerWordRow,
  },
  data() {
    return { 
      // overlapping with WordPicker and SearchWorker mixin:
      wordBank: [],

      // overlapping with WordPicker mixin:
      pickedWords: {},
      pinnedLetters: {},
      selectedLetter: null,

      clipboardText: '',
      capitalizeClipboard: false,

      allResultsVisible: false,
      allWords: null,
      selectedEntry: null,
      selectedWord: null,

      mobile: false,
    };
  },
  computed: {
    lastPicks() {
      return this.selectedEntry ? this.pickedWords[this.selectedEntry.letter] : [];
    },
  },
  mounted() {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.mobile = w <= 800;
  },
  methods: {
    countLetterWords(letter) {
      return this.getLetterWords(letter).length;
    },
    countClass(letter) {
      const count = this.countLetterWords(letter);
      const classes = [
        1, 5, 20, 50, 100,
        1000, 2000, 3000, 4000, 5000
      ];
      let i = 0;
      while (count > classes[i] && i < classes.length - 1) {
        i++;
      }
      return 10 - i;
    },
    copyToClipboard(newText) {
      const text = (this.clipboardText.trim() + ' ' + newText).trim();
      this.clipboardText = text;
      this.$nextTick(() => {
        this.$refs.clipboard.$refs.textarea.scrollTop = 10000;
      });
    },
    capitalize(str) {
      return str.slice(0,1).toUpperCase() + str.slice(1);
    },
    copyWord(word) {
      if (this.capitalizeClipboard) {
        word = this.capitalize(word);
      }
      this.$copyText(word);
      this.copyToClipboard(word);
    },
    copyAll() {
      const words = this.letters.map(l => this.getPickedWord(l)).join(' ');
      this.$copyText(words);
      this.copyToClipboard(words);
    },
    showAll() {
      this.allWords = this.wordBank.flatMap(e => e.words);
      this.allResultsVisible = true;
      if (this.mobile) {
        this.$refs.sectionDetails.scrollIntoView({ behavior: 'smooth' });
      }
    },
    selectEntry({ letter, word }) {
      this.allResultsVisible = false;
      let entry = this.wordBank.find(e => e.letter === letter);
      this.selectedEntry = entry;
      this.selectedWord = word;
      if (this.mobile) {
        this.$refs.sectionLastPicks.scrollIntoView({ behavior: 'smooth' });
      }
    },
    pickWord(word) {
      this.setWord(this.selectedEntry.letter, word);
    },
  },
}
</script>

<style lang="scss" scoped>
.border {
  @include ui-border-generic();
  border-top-width: 0;
}

.search-view {
  margin: 0 auto;
  width: 100%;
  max-width: 1500px;
  min-height: 100vh;
  padding: 0.5rem;

  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 70% 30%;
  grid-template-rows: auto 1fr; // avoid clipboard (right column, 2nd row) jumping around when content is loading
  
  @media screen and (max-width: #{$mq-max-width}) {
    display: flex;
    flex-direction: column;

    .section-search, .section-results {
      order: -1;
    }
  }
}
.with-keyboard {
  .search-view {
    padding-bottom: 180px;
  }
}

.section {
  margin: 0.5rem;
}


.section-header {
  display: flex;
  padding: 0;
  label {
    flex: 1;
  }
  .ui-button {
    @include ui-button-tiny();  
    flex: 1;
    margin: 0;
  }
}

.section-content {
  @include ui-border-generic();
  border-top-width: 0;
  .section-content-inner {
    overflow: hidden auto;
    max-height: 50vh;
    padding: 0.25rem 0.5rem;
  }
}

.section-wrapper {
  display: flex;
  .section {
    flex: 1;
  }
}

.section-last-picks {
  min-height: 11rem;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  @media screen and (max-width: #{$mq-max-width}) {
    align-self: unset;
    min-height: unset;
  }
}

.last-picks {
  @include ui-border-generic();
  border-top-width: 0;
  max-height: 9rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  > .content {
    max-height: 100%;
    margin: 0 -2px;
    overflow: auto !important;
  }
}


.section-clipboard {
  display: flex;
  flex-direction: column;
  max-height: 300px;
}

.clipboard {
  flex: 1;
  @include ui-border-generic();
  border-top-width: 0 !important;
  ::v-deep .ui-textbox__textarea {
    border: 0 !important;
    padding: 0.25rem 0.5rem;
    overflow: auto !important;
  }
}

.no-results {
  text-align: center;
  padding: 2rem;
}

.lettering-section {
  margin-bottom: 10rem;
  @media screen and (max-width: #{$mq-max-width}) {
    margin-bottom: 0.5rem;
  }

  .words {
    display: grid;
    grid-template-columns: repeat(5, 20%);
    justify-items: stretch;
    
    @media screen and (max-width: #{$mq-max-width}) {
      grid-template-columns: repeat(3, 33%);
    }
    @media screen and (max-width: 400px) {
      grid-template-columns: repeat(2, 50%);
    }

    > .word {
      position: relative;

      .fit-me {
        margin: 0 8px;
      }

      .count {
        position: absolute;
        z-index: 1;
        top: 2px;
        right: 4px;
        font-size: 0.7rem;
        color: rgba(#666, 0.7);
      }
      &.pinned {
        .count {
          color: white;
        }
      }

      $n: 35;
      @for $i from 0 through $n {
        &:nth-child(#{$i}) {
          background: adjust-hue($secondary-dark, $i);
          background: mix($words-b, $words-a, 100% * $i / $n);
        }
        background: mix($words-b, $words-a, 100% * $n / $n);
      }

      @for $i from 0 through 10 {
        &.weight-#{$i} {
          $l: rgba(white, 0.4 +$i * 0.04);
          background-image: linear-gradient(#{$l}, #{$l});
        }
      }
      .power-word {
        height: 3.4rem;
      }
    }
  }
}

@media screen and (max-width: #{$mq-max-width}) {
  .power-word {
    ::v-deep .word-actions {
      opacity: 1;
      background: transparent;
      border-color: transparent;
    }
  }
}
</style>
