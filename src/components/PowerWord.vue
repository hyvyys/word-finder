<template>
  <div class="power-word u-relative" :class="`has-changed-${hasChanged}`">
    <div class="word-actions u-overlay u-row">
      <slot />
    </div>
    <FitText class="word" :text="word"/>
  </div>
</template>

<script>
import FitText from "@/components/FitText";

export default {
  components: {
    FitText,
  },
  props: {
    word: { type: String },
  },
  data() {
    return {
      hasChanged: 0,
      changedTimeout: null,
    };
  },
  watch: {
    word() {
      this.hasChanged = 1;
      setTimeout(() => this.hasChanged = 2, 0);
      if (this.changedTimeout) clearTimeout(this.changedTimeout);
      this.changedTimeout = setTimeout(() => this.hasChanged = 0, 1250);
      this.$nextTick(() => {
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.power-word {
  padding: 0 0.2rem 0.8rem;
  height: 2rem;
  
  &.pinned {
    transition: none;
    background: $primary;
    color: white;
    .word-actions {
      border: 2px solid darken($primary, 10%);
      background: $primary;
      color: white;
    }
  }

  $color-light: mix($primary-light, white);

  .word-actions {
    display: flex;
    background: white;
    border: 2px solid $color-light;
    // display: none;
    opacity: 0;
    .ui-button {
      @include ui-button-tiny();
      color: $primary-dark;
      font-weight: 700;
      text-transform: uppercase;
      height: 100%;
      flex: 1;
      position: relative;
      background: transparent;

      ::v-deep .ui-button__content {
        /* I would have just used flexbox but Chrome's got an issue with it here... */
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
      }
    }
  }
  
  &:hover {
    .word-actions {
      opacity: 1;
      transition: opacity 0.35s;
    }
  }
  .ui-button {
    &:hover {
      background: $color-light;
    }
  }
  &.pinned {
    .word-actions {
      background: $primary;
      color: white;
      .ui-button {
        font-weight: normal;
        color: $primary-text;
        &:hover {
          background: darken($primary, 10%);
        }
      }
    }
  }

  .word {
    position: relative;
    z-index: 1;
    pointer-events: none;
    margin: 0 8px;
  }
  &.selected {
    .word {
      text-decoration: underline;
    }
  }

  &.has-changed-1 {
    background-color: $primary;
  }
  &.has-changed-2 {
    transition: background-color 1s, color 1s;
  }
}
</style>