<template>
  <div class="search-widget">
    <LanguageSelect v-model="selectedLanguages" />

    <div class="filter-grid" :class="{ 'advanced-view': advancedView }">

      <!-- advanced view first col -->
      <label v-show="advancedView" class="section-label">Look for:</label>
      <UiTextbox label="Search" placeholder="desired phrase" v-model="searchPhrase" @keydown.enter="search" />
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

      <!-- advanced view second col -->
      <label v-show="advancedView" class="section-label">Filter out:</label>
      <UiTextbox v-show="advancedView"
        label="Filter" placeholder="undesired phrase" v-model="filterPhrase" @keydown.enter="search" />
      <div v-show="advancedView" class="filters filters-negative">
        <UiCheckbox v-for="f in negativeFilters" :key="f.label" :value="f.value" @input="v => toggleFilter(v, f.index)">
          {{f.label}}
        </UiCheckbox>
      </div>
      <!-- advanced view third col -->
      <UiButton class="mq-col-right mq-row-1" id="advanced-view-toggle" @click="advancedView = !advancedView"
        :color="advancedView ? 'primary' : 'default'"
      >
        filters
      </UiButton>
      <div class="mq-col-right mq-row-2 ui-toggle-button-group" id="searchToggles">
        <UiToggleButton tooltip="case sensitive" label="Aa" v-model="isSearchCaseSensitive" />
        <UiToggleButton tooltip="regex" label=".*" v-model="isSearchRegex" />
      </div>
      <div class="mq-col-right mq-row-3 mq-row-rest reset-filter-cell" v-show="advancedView">
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
    .reset-filter-cell {
      align-self: flex-end;
    }
    
    &.advanced-view {
      grid-template-columns: 1fr 1fr 90px;
      grid-template-rows: auto auto auto;
      grid-auto-flow: column;
      
      #advanced-view-toggle {
        order: 0;
      }

      @media screen and (max-width: #{$mq-max-width}) {
        grid-auto-flow: row;
        grid-template-columns: 1fr 90px;
        // display: block;
        :not(.mq-col-right) {
          grid-column-start: 1;
        }
        @for $i from 1 through 3 {
          .mq-row-#{$i} {
            grid-row-start: $i;
            grid-column-start: 2;
          } 
        }
        .mq-row-rest {
          grid-row-end: span 10;
        }
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
