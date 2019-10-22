<template>
  <div class="home-view">
    <div class="search">
      <SearchWidget />
      
      <div class="u-reading">
        <h2>A flexible multi-language word finder</h2>
        <p>
          Search 182 languages for words with specific letter combinations or matching a regular expression.
          Filter results by languages, word length, and occurrence of accents (or lack thereof).
        </p>
        <p>
          The app was designed with type designers in mind, but I hope it can be useful to anyone.
        </p>
        <p>
          The word lists are compiled from Wiktionary, so every word has a wiki link available.
        </p>

        <h2>How to?</h2>
        <p>
          First pick one or more languages to run your query against, or use one of the presets:
        </p>
        <ul>
          <li v-for="(preset, i) in searchPresets" :key="i">
            <router-link :to="preset.url">{{ preset.title}}</router-link>{{ preset.description ? ` – ${preset.description}` : '' }}
          </li>
        </ul>
        <p>
          And... you're actually good to go, if you just want to pick some random words from A to Z!
          You will see an entry for every letter.
          You can swap each word until you find the one you like, pin words you like to shuffle the remainder,
          or pick your words manually from the list of all results.
        </p>
        <h2>Filters</h2>
        <p>
          If you want to narrow down your search, use the search input to get more specific results.
          For instance, you might want to find
          <router-link to="/search?i=fi%7Cfl&l=en&r=5,10&f=107c">
            English words consisting of 5 to 10 letters, including a "fi" or "fl" combination</router-link>.
          Expand the filters section to use the other filters such as:
          <ul>
          <li>the negative search input (type anything you <em>don't</em> want to come up);</li>
          <li>positive and negative accent filters
            (“accent” is used here as an umbrella term for a letter
            that is not found in the English, Russian, and basic Greek alphabets);</li>
          <li>alliteration filter – for finding words that repeat their initial letter, like “Adam”, Bob”, and “Cecilia”
            (linguists — my apologies for abusing the term);</li>
          <li>punctuation, digit, multi-word filters – to filter off all the chemical compound names
            and other quirky entries added by the enthusiastic Wiktionarians (Kudos to them, though).</li>
          </ul>
        </p>
      </div>

      <SearchWidget :expanded="true" />
    </div>
  </div>
</template>

<script>
import title from "@/models/title";
import searchPresets from "@/models/searchPresets";
import SearchWidget from "@/components/SearchWidget";

export default {
  name: 'home-view',
  components: {
    SearchWidget,
  },
  data() {
    return {
      searchPresets,
    };
  },
  mounted() {
    document.title = title();
  }
}
</script>

<style lang="scss" scoped>
.home-view {
  p {
    line-height: 1.6;
    font-size: 1.1rem;
  }
  margin-bottom: 8rem;
}

.search {
  max-width: 700px;
  margin: 0 auto;
}

</style>
