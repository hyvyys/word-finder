<template>
  <div class="search-view">
    <SearchWidget class='section' :searching="searching" />

    <div class="section section-last-picks">
      <label v-if="selectedEntry" class="section-label">Last picks for {{selectedEntry.letter}}</label>
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

    <div>
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
              <UiButton :disableRipple="true" @click='selectEntry({ letter: l, word: getPickedWord(l) })'>See</UiButton>
              <UiButton :disableRipple="true" @click='swapWord(l)'>Swap</UiButton>
            </PowerWord>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="section">
      
        <label v-if="!allResultsVisible && selectedEntry" class="section-label">Last picks for {{selectedEntry.letter}}</label>
        <div v-if="!allResultsVisible && selectedEntry" class='last-picks'>
          <PowerWordRow class='secondary'
            v-for="(word, i) in lastPicks"
            :key="i"
            :word="word"
            :first="i === 0"
            @pick="pickWord"
            @copy="copyWord"
          />
        </div>

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
      </div>
    </div>

  </div>
</template>

<script>
import SearchWorker from "@/mixins/SearchWorker";
import WordPicker from "@/mixins/WordPicker";
import UiTextbox from "keen-ui/src/UiTextbox";
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

      allResultsVisible: false,
      allWords: null,
      selectedEntry: null,
      selectedWord: null,
    };
  },
  computed: {
    lastPicks() {
      return this.selectedEntry ? this.pickedWords[this.selectedEntry.letter] : [];
    },
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
    copyWord(word) {
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
    },
    selectEntry({ letter, word }) {
      this.allResultsVisible = false;
      let entry = this.wordBank.find(e => e.letter === letter);
      this.selectedEntry = entry;
      this.selectedWord = word;
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
  grid-template-columns: 70% 30%;
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

.section-last-picks {
  align-self: flex-end;
}

.last-picks {
  @include ui-border-generic();
  border-top-width: 0;
  // position: relative;
  > .content {
    margin: 0 -2px;
    height: 9rem;
    overflow: auto !important;
  }
}


.section-clipboard {
  // height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 300px;
}

.clipboard {
  flex: 1;
  @include ui-border-generic();
  border-top-width: 0 !important;
  // ::v-deep .ui-textbox__content, ::v-deep .ui-textbox__label, ::v-deep .ui-textbox__textarea {
  //   height: 100% !important;
  // }
  ::v-deep .ui-textbox__textarea {
    border: 0 !important;
    padding: 0.25rem 0.5rem;
    overflow: auto !important;
  }
  // overflow: hidden !important;
  // height: 100%;
  // flex: 1;
}

.no-results {
  text-align: center;
  padding: 2rem;
}

.lettering-section {
  margin-bottom: 10rem;

  .words {
    display: grid;
    grid-template-columns: repeat(5, 20%);
    justify-items: stretch;

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
</style>
