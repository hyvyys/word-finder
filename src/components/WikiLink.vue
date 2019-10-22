<template>
  <a class="wiki-link" :href="wiktionaryUrl(word)" target="_blank">{{displayedText}}</a>
</template>

<script>
import WikiLink from "@/mixins/WikiLink";

export default {
  mixins: [ WikiLink ],
  props: {
    word: { type: String, required: true },
    text: { type: String },
  },
  computed: {
    displayedText() {
      return this.wiktionaryUrlShort(this.word);
    },
  }
}
</script>