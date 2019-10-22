<template>
  <div class="word-list">
    <PowerWordRow v-if="selectedWord"
      :word="selectedWord"
      @pick="$emit('pick', selectedWord)"
      @copy="$emit('copy', selectedWord)"
    />
    <div v-else class="placeholder-wrapper">
      <div class="placeholder">Click a word for actions</div>
    </div>

    <div class="border">
      <RecycleScroller ref="words" class="content" :items="filteredWords" :item-size="26" v-slot="{ item }">
        <div class="word" @click="selectWord(item)">{{ item }}</div>
      </RecycleScroller>
    </div>
    <UiTextbox v-model="searchPhrase" @keydown.enter.native="search" placeholder="Search" />
  </div>
</template>

<script>
import { RecycleScroller } from "vue-virtual-scroller";
import PowerWordRow from "@/components/PowerWordRow";
import UiTextbox from "keen-ui/src/UiTextbox";

export default {
  components: {
    PowerWordRow,
    RecycleScroller,
    UiTextbox,
  },
  props: {
    words: { type: Array, default: () => [] },
  },
  data() {
    return {
      selectedWord: null,
      searchPhrase: '',
      usedSearchPhrase: '',
    };
  },
  computed: {
    filteredWords() {
      if (this.usedSearchPhrase === '')
        return this.words;
      else
        return this.words.filter(w => w.indexOf(this.usedSearchPhrase) > -1);
    }
  },
  watch: {
    words() {
      if (this.$refs.words) this.$refs.words.scrollTop = 0;
      this.selectedWord = null;
    },
  },
  methods: {
    search() {
      this.usedSearchPhrase = this.searchPhrase;
    },
    selectWord(word) {
      if (word)
        this.selectedWord = word;
    },
  },
}
</script>

<style lang="scss" scoped>
.border {
  @include ui-border-generic();
  border-top-width: 0;
  border-bottom-width: 0;
}
.content {
  height: 200px;
}

.power-word-row,
.placeholder-wrapper {
  min-height: 2.0rem;
  background: $secondary;
  display: flex;
  align-items: center;
  .placeholder {
    padding: 0 0.6rem;
  }
}

.ui-textbox {
  height: 2.0rem;
  background: $secondary;
  margin: 0;
  ::v-deep .ui-textbox__input {
    border-bottom-width: 2px;
    padding: 0 0.6rem;
  }
}

.word {
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  &:hover {
    background: lighten($secondary, 5%);
  }
}
</style>