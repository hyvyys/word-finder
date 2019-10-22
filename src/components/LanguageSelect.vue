
<template>
  <div class="language-select">
    <UiSelect
      v-model="selectedLanguages"
      :multiple="multiLanguage"
      :options="languages"
      :has-search="true"
      :filter="languageFilter"
      label="Languages"
      placeholder=""
      ref="langSelect"
      @select="$refs.langSelect.clearQuery()"
    />
    <UiCheckbox :value="multiLanguage" @input="onMultiLanguage">multiple</UiCheckbox>
  </div>
</template>

<script>
import { LANGUAGES } from "@/models/LANGUAGES";
import UiCheckbox from "keen-ui/src/UiCheckbox";
import UiSelect from "@/components/UiSelect";

export default {
  components: {
    UiSelect,
    UiCheckbox,
  },
  data() {
    return {
      languages: LANGUAGES,
      selectedLanguages: [], // Array or String, depending on `multiLanguage`
      selectedLanguagesBackup: null, // keep last Array value in case `multiLanguage` is toggled back on
      multiLanguage: true,
    };
  },
  props: {
    value: { type: Array, default: () => [] },
  },
  computed: {
    selectedLanguagesArray() {
      const value = this.selectedLanguages;
      return typeof value === 'object' ? value : [ value ];
    },
  },
  watch: {
    value() {
      this.processValue();
    },
    selectedLanguagesArray(val, oldVal) {
      function arraysDiffer(a, b) {
        return a.some(e => !b.includes(e))
          || b.some(e => !a.includes(e));
      }
      if (arraysDiffer(val, oldVal)) {
        this.$emit("input", val);
      }
    }
  },
  mounted() {
    this.processValue();
  },
  methods: {
    processValue() {
      this.selectedLanguages = this.value;
      const multi = this.value.length > 1;
      this.onMultiLanguage(multi);
    },
    backupValue() {
      if (typeof this.selectedLanguages === 'object') {
        this.selectedLanguagesBackup = this.selectedLanguages;
      }
    },
    onMultiLanguage(multi) {
      if (multi) {
        if (typeof this.selectedLanguages === 'string') {
          if (this.selectedLanguagesBackup.includes(this.selectedLanguages)) {
            this.selectedLanguages = this.selectedLanguagesBackup;
          }
          else {
            this.selectedLanguages = [ this.selectedLanguages ];
          }
        }
      } else {
        if (typeof this.selectedLanguages === 'object') {
          this.selectedLanguages = this.selectedLanguages[0] || '';
        }
      }
      this.multiLanguage = multi;
      this.backupValue();
    },

    languageFilter(suggestion, query, defaultFilter) {
      // fuzzy match but first letter exact match of any first letter in a word
      return defaultFilter(suggestion, query)
        && (!query.length || new RegExp("(^| )" + query[0], "i").test(suggestion));
    },
  }
}
</script>

<style lang="scss" scoped>
.language-select {
  display: flex;
  overflow: hidden;
  .ui-select {
    overflow: hidden;
    flex: 1;
    ::v-deep .ui-select__content {
      overflow: hidden;
      min-width: 0;
      .ui-select__display {
        min-width: 0;
        .ui-select__display-value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: normal;
          // height: 100%;
        }
      }    
    }
  }
}
</style>
      