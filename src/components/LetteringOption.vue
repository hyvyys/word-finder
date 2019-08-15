<template>
  <div :class="`lettering-option ${type}`">
    <ui-textbox
      v-if="type == `number`"
      type="number"
      :label="label"
      v-model.number="localValue"
      :min="min"
      :max="max"
      @focus="focus"
      @blur="blur"
    >
      <option-label
        :label="label"
        :info="info"
        :toggles="toggles"
        :toggleLabels="toggleLabels"
        @input:toggle="v => $emit('input:toggle', v)"
      ></option-label>
    </ui-textbox>

    <component
      v-else
      :is="component()"
      :label="label"
      v-model="localValue"
      :invalid="validation === false"
      :multiple="multiple"
      :options="options"
      :filter="filter"
      :has-search="true"
      @focus="focus"
      @blur="blur"
    >
      <option-label
        :label="label"
        :info="info"
        :toggles="toggles"
        :toggleLabels="toggleLabels"
        @input:toggle="v => $emit('input:toggle', v)"
      ></option-label>
    </component>
  </div>
</template>

<style scoped lang="scss">
.lettering-option {
  margin: 0 0.5em;
}
.number {
  flex: 34%;
}
.select,
.string,
.boolean {
  flex: 100%;
}
</style>


<script>
import Vue from "vue";
import { escapeRegExp, capitalize } from "../logic/utils";
import { letteringOptions } from "../logic/letteringOptions";
import OptionLabel from "./OptionLabel.vue";

export default {
  components: { OptionLabel },

  props: {
    prop: String,
    value: {
      type: null,
      required: true
    },
    validation: Boolean,
    toggleProps: Array,
    toggles: Array,
    eventBus: Vue
  },

  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(localValue) {
        if (localValue != this.value) {
          this.$emit("input", localValue);
        }
      }
    },
    options: {
      get() {
        const opts = this.opt().options;

        return opts && [
          ...opts.filter(o => this.value.includes(o)),
          ...opts.filter(o => !this.value.includes(o))
        ];
      }
    }
  },

  data() {
    return {
      label:
        this.opt().label ||
        capitalize(this.prop.replace(/[A-Z]/g, " $&").toLowerCase()),
      type: this.opt().type,
      filter: this.opt().filter,
      multiple: this.opt().multiple,
      min: this.opt().min,
      max: this.opt().max,
      toggleLabels:
        this.toggleProps &&
        this.toggleProps.map(
          toggleProp =>
            this.opt(toggleProp).label ||
            capitalize(toggleProp.replace(/[A-Z]/g, " $&").toLowerCase())
        ),
      info: this.opt().info,
      components: {
        number: "ui-textbox",
        string: "ui-textbox",
        boolean: this.opt().form == "toggle" ? "ui-switch" : "ui-checkbox",
        select: "ui-select",
      },
    };
  },

  methods: {
    component() { return this.components[this.type] },

    opt(prop = this.prop) {
      return letteringOptions.find(o => o.prop == prop);
    },

    focus() {
      this.eventBus.$emit("option-focused", this.prop);
    },

    blur() {
      this.eventBus.$emit("option-focused", null);
    }
  }
};
</script>
