<template>
  <div class="ui-tooltip-button u-relative">
    <UiButton :class="className" v-bind="$attrs" v-on="$listeners">
      <slot />
    </UiButton>
    <span class="ui-tooltip-button__tooltip-trigger u-overlay" v-if='showTooltip'>
      <UiTooltip :openDelay="0" openOn="hover click">{{ tooltip }}</UiTooltip>
    </span>
  </div>
</template>

<script>
import UiTooltip from "keen-ui/src/UiTooltip";
import UiButton from "@/components/UiButton";

export default {
  components: {
    UiButton,
    UiTooltip,
  },
  data() {
    return {
      className: '',
    };
  },
  props: {
    showTooltip: { type: Boolean, default: true },
    tooltip: { type: String, default: '' },
  },
  mounted() {
    this.className = this.$el.className;
  },
  computed: {
    attrs() {
      /* eslint-disable no-unused-vars */
      const { tooltip, showTooltip, ...attributes } = this.$attrs;
      return attributes;
    },
  }
}
</script>

<style lang="scss" scoped>
.ui-tooltip-button__tooltip-trigger {
  outline: none;
}
.ui-button {
  margin: 0 !important; // margin should be applied to root
  &.is-disabled {
    opacity: 0.4;
  }
}
</style>