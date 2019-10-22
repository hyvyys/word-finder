<template>
  <div class="ui-toggle-button" :class="{ 'is-checked': value }" @click="toggle">
    <label class="ui-toggle-button__label">
      {{ label }}
    </label>
    <UiTooltip v-if="tooltip" :openDelay="600">{{tooltip}}</UiTooltip>
  </div>
</template>

<script>
import UiTooltip from "keen-ui/src/UiTooltip";

export default {
  components: {
    UiTooltip,
  },
  props: {
    value: { type: Boolean, default: true },
    label: { type: String, default: '\xa0' },
    tooltip: { type: String, default: '' },
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'keen-ui/src/styles/imports';

.ui-toggle-button {
  outline: none;
  user-select: none;
  padding: 0.2rem 0.2rem;
  min-width: 1.8rem;
  text-align: center;
  border-radius: 4px;
  color: $ui-input-border-color--active;
  border: 2px solid $ui-input-border-color;
  &:hover {
    border-color: $ui-input-border-color--hover;
  }
  &.is-checked {
    border-color: $brand-primary-color;
    background: $brand-primary-color;
    &:hover {
      border-color: darken($brand-primary-color, 10%);
      background-color: darken($brand-primary-color, 10%);
    }
    color: $light;
  }
  transition: all 0.2s;
}
</style>