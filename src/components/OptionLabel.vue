<template>
  <span class="option-label">
    <span class="option-label__label">{{ label }}</span>

    <ui-checkbox
      class="option-label__toggle"
      v-for="(toggle, i) in toggles"
      :key="i"
      :label="toggleLabels[i]"
      :value="toggles[i]"
      @input="v =>sync(v, i)"
    ></ui-checkbox>

    <span class="icon" v-if="info">
      <ui-icon-button
        type="secondary"
        :icon="info ? `info_outline` : ``"
        color="primary"
        size="small"
        :disableRipple="true"
      ></ui-icon-button>
      <ui-tooltip>{{ info }}</ui-tooltip>
    </span>
  </span>
</template>

<style lang="scss">
@import "keen-ui/src/styles/variables.scss";

.option-label {
  display: flex;
  align-items: center;

  .option-label__label {
    flex: 1;
  }

  .ui-checkbox {
    margin: 0;
    margin-left: 0.5em;
    font-size: 1em;
    .ui-checkbox__checkmark {
      height: 1rem;
      width: 1rem;
      margin-top: 0.2rem;
    }
    .ui-checkbox__label-text {
      font-size: 1em;
      margin-left: 0.15em;
    }
  }

  .icon {
    display: flex;
    align-items: center;
    margin: -0.8em 0.25em;
    .ui-icon-button {
      opacity: 0.95;
      transform: rotate(0.03deg) translateY(1px);
      &--size-small {
        height: 1.5rem;
        width: 1.5rem;
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    label: String,
    info: String,
    toggles: Array,
    toggleLabels: Array
  },

  methods: {
    sync(val, i) {
      this.$set(this.toggles, i, val);
      this.$emit("input:toggle", this.toggles);
    }
  }
};
</script>
