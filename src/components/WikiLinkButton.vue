<template>
  <UiButton
    class="wiki-link"
    :href="wiktionaryUrl(word)"
    target="_blank"
    color="primary"
  >
    {{displayedText}}
  </UiButton>
</template>

<script>
import UiButton from "@/components/UiButton";
import WikiLink from "@/mixins/WikiLink";

export default {
  mixins: [ WikiLink ],
  components: {
    UiButton,
  },
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