<template>
  <div class="search-widget">
    <LanguageSelect v-model="selectedLanguages" />

    <div class="filter-grid" :class="{ 'advanced-view': advancedView }">
      <!-- advanced view first row -->
      <label v-show="advancedView" class="section-label">Look for:</label>
      <label v-show="advancedView" class="section-label">Filter out:</label>
      <UiButton id="advanced-view-toggle" @click="advancedView = !advancedView"
        :color="advancedView ? 'primary' : 'default'"
      >
        filters
      </UiButton>
      <!-- advanced view second row -->
      <UiTextbox label="Search" placeholder="desired phrase" v-model="searchPhrase" @keydown.enter="search" />
      <UiTextbox v-show="advancedView"
        label="Filter" placeholder="undesired phrase" v-model="filterPhrase" @keydown.enter="search" />
      <div id="searchToggles" class="ui-toggle-button-group">
        <UiToggleButton tooltip="case sensitive" label="Aa" v-model="isSearchCaseSensitive" />
        <UiToggleButton tooltip="regex" label=".*" v-model="isSearchRegex" />
      </div>
      <!-- advanced view third row -->
      <div v-show="advancedView" class="filters">
        <UiCheckbox v-for="f in positiveFilters" :key="f.label" :value="f.value" @input="v => toggleFilter(v, f.index)">
          {{f.label}}
        </UiCheckbox>
        
        <UiSlider
          v-if="advancedView"
          v-model="lengthRange"
          :min="1"
          :max="LENGTH_FILTER_MAX"
          label="Length"
          :formatValue="(v) => v === LENGTH_FILTER_MAX ? '∞' : v"
        />
      </div>
      <div v-show="advancedView" class="filters filters-negative">
        <UiCheckbox v-for="f in negativeFilters" :key="f.label" :value="f.value" @input="v => toggleFilter(v, f.index)">
          {{f.label}}
        </UiCheckbox>
      </div>

      <div v-show="advancedView" style="align-self: center">
        <UiButton @click="resetFilters">Reset</UiButton>
      </div>
    </div>

    <div class='u-row'>
      <div class='search-toolbar'>
        <UiTooltipButton class="search-btn" color="primary" size="large" :disableRipple="true"
          @click="search" :loading="searching" :disabled="nothingChanged"
          tooltip="no filters have changed"
          :showTooltip="nothingChanged"
        >
          {{ searching ? 'Searching...' : 'Search' }}
        </UiTooltipButton>
      </div>
    </div>

  </div>
</template>

<script>
import LENGTH_FILTER_MAX from "@/models/LENGTH_FILTER_MAX";
import LanguageSelect from "@/components/LanguageSelect";
import UiCheckbox from "keen-ui/src/UiCheckbox";
import UiTextbox from "keen-ui/src/UiTextbox";
import UiTooltipButton from "@/components/UiTooltipButton";
import UiButton from "@/components/UiButton";
import SearchQuery from "@/mixins/SearchQuery";
import UiToggleButton from "@/components/UiToggleButton";
import UiSlider from "@/components/UiSlider";

export default {
  name: 'search-widget',
  components: {
    UiCheckbox,
    UiTextbox,
    UiButton,
    UiTooltipButton,
    UiToggleButton,
    LanguageSelect,
    UiSlider,
  },
  mixins: [ SearchQuery ],
  props: {
    searching: { type: Boolean, default: false },
    target: { type: String, default: 'search' },
    expanded: { type: Boolean, default: false },
  },
  data() {
    return {
      nothingChanged: false,
      advancedView: this.expanded,
      LENGTH_FILTER_MAX,
    };
  },
  computed: {
    negativeFilters() {
      return this.filters.filter(f => f.kind === 'negative');
    },
    positiveFilters() {
      return this.filters.filter(f => f.kind !== 'negative');
    },
  },
  watch: {
    selectedLanguages() {
      this.recordChange();
    },
    lengthRange() {
      this.recordChange();
    },
    searchPhrase() {
      this.recordChange();
    },
    filterPhrase() {
      this.recordChange();
    },
    isSearchRegex() {
      this.recordChange();
    },
    isSearchCaseSensitive() {
      this.recordChange();
    },
    searching(val) {
      if (!val) {
        this.forgetChange();
      } 
    }
  },
  mounted() {
    this.queryToParams();
  },
  methods: {
    recordChange() {
      this.nothingChanged = false;
    },
    forgetChange() {
      this.$nextTick(() => {
        this.searchRequested = false;
        this.nothingChanged = true;
      });
    },
    resetFilters() {
      this.createFilters();
      this.recordChange();
    },

    toggleFilter(v, i) {
      this.$set(this.filters[i], 'value', v);
      this.recordChange();
    },

    search() {
      this.searchRequested = true;
      const query = this.paramsToQuery();
      this.$router.push({ path: this.target, query }).catch(() => {
        this.forgetChange();
      });
    },
  },
}
</script>

<style lang="scss">
.search-widget {
  margin-top: 1rem;

  .filter-grid {
    display: grid;
    grid-template-columns: 1fr auto 90px;
    > * {
      margin-right: 0.65rem;
      margin-bottom: 0.5rem;
    }

    #advanced-view-toggle {
      order: 1;
    }
    #reset-filters-btn {
      align-self: center;
    }
    
    &.advanced-view {
      grid-template-columns: 1fr 1fr 90px;
      #advanced-view-toggle {
        order: 0;
      }
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
    }
    .filters-negative {
      .ui-checkbox {
        @include ui-crossbox;
      }
    }
  }

  /* Search button */

  .search-toolbar {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }

  .ui-button.search-btn {
    height: 2.6rem;
    min-width: 12rem;
    margin: 0;
  }

  .ui-slider {
    flex-basis: 100%;
  }
}
</style>
