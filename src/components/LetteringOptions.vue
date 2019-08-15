<template>
  <div class="lettering-options">
    <h3>Filters</h3>
    <div class="panel">
      <lettering-option
        v-for="prop of filterOptions"
        :key="prop"
        :prop="prop"
        :value="options[prop]"
        :validation="optionsValidation[prop]"
        :toggles="toggles[prop].map(p => options[p])"
        :toggleProps="toggles[prop]"
        :eventBus="eventBus"
        @input="v => sync(prop, v)"
        @input:toggle="v => syncArray(toggles[prop], v)"
      ></lettering-option>
    </div>

    <h3>Format</h3>
    <div class="panel">
      <lettering-option
        v-for="prop of formatOptions"
        :key="prop"
        :prop="prop"
        :value="options[prop]"
        :eventBus="eventBus"
        @input="v => sync(prop, v)"
      ></lettering-option>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5em;
}
</style>

<script>
import Vue from "vue";
import { letteringOptions, getToggles } from "../logic/letteringOptions";
import { escapeRegExp, objectFromArray } from "../logic/utils";
import LetteringOption from "./LetteringOption.vue";

export default {
  components: { LetteringOption },

  props: {
    eventBus: Vue,
    options: {
      type: Object,
      required: true
    },
    optionsValidation: Object,
  },

  computed: {
    // return {
    formatOptions: {
      get() {
        return letteringOptions.filter(o => o.format).map(o => o.prop);
      }
    },
    filterOptions: {
      get() {
        return letteringOptions
          .filter(o => !o.format)
          .filter(o => !o.if || o.if(this.options))
          .map(o => o.prop);
      }
    },
    toggles: {
      get() {
        let toggles = Object.keys(this.options).map(k => ({ prop: k, val: getToggles(k)}));
        let array = objectFromArray(toggles, 'prop', 'val');
        return array;
      } 
    },
    // };
  },

  methods: {
    sync(prop, val) {
      this.validateAndSet(prop, val);
      this.$emit("input:validation", this.optionsValidation);
      this.$emit("input", this.options);
    },

    syncArray(props, val) {
      for (let i = 0; i < props.length; i++) {
        this.sync(props[i], val[i])
      }
    },

    validateAndSet(prop, val) {
      switch (prop) {
        case "minLength":
          if (val > this.options.maxLength) this.options.maxLength = val;
          this.options.minLength = val;
          break;
        case "maxLength":
          if (val < this.options.minLength) this.options.minLength = val;
          this.options.maxLength = val;
          break;
        case "search": {
          this.options.search = val;
          var isValid = true;
          try {
            new RegExp(val);
          } catch (e) {
            isValid = false;
          }
          this.optionsValidation.search = isValid;
          break;
        }
        default:
          this.options[prop] = val;
      }
    }
  }
};
</script>