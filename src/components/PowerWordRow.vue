<template>
  <div class="power-word-row">
    <strong class='word'>{{ word }} </strong>
    <span class="actions">
      <UiButton color="primary" @click="$emit('pick', word)" v-if="!first">Pick</UiButton>
      <UiButton color="primary" @click="$emit('copy', word)">Copy</UiButton>
      <WikiLinkButton color="primary" :word="word" text="Wiki" />
    </span>
  </div>
</template>

<script>
import UiButton from "@/components/UiButton";
import WikiLinkButton from "@/components/WikiLinkButton";

export default {
  components: {
    WikiLinkButton,
    UiButton,
  },
  props: {
    word: { type: String },
    first: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
.power-word-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: $secondary;
  .word, 
  .ui-button {
    height: 28px !important;
  }
  .actions {
    margin-left: auto;
    display: flex;
  }
  .ui-button:hover {
    background: rgba(darken($secondary, 5%), 0.7);
  }

  &:nth-child(even), &.even {
    &, .ui-button {
      background: lighten($secondary, 5%);
    }
    .ui-button:hover {
      background: rgba(lighten($secondary, 10%), 0.7);
    }
  }

  .word { 
    padding: 0 0.5rem;
    flex: 1;
    align-self: center;
    &::after {
      content: '\a0';
    }
  }
  .placeholder {
    color: darken($primary, 10%);
  }
  .wiki-link {
    text-decoration-skip-ink: none;
  }
  .ui-button {
    padding: 0 1rem;
    height: 100%;
    // @include ui-button-tiny;
    border-radius: 0;
    min-width: 4rem;
  }

  .ui-button {
    background: $secondary;
    color: $secondary-text;
    &:hover {
      background: lighten($secondary, 10%);
    }
  }
}
</style>