<template>
  <div class="site-header">
    <router-link class="home-link" to="/">
      <h1>Word Finder</h1>
    </router-link>

    <nav class="nav">
      <router-link v-for="(preset, i) in searchPresets" :key="i" :to="preset.url">{{ preset.title}}</router-link>
    </nav>

    <div class="rest">
      <UiButton id="accent-keyboard-toggle">keyboard</UiButton>
    </div>
  </div>
</template>

<script>
import searchPresets from "@/models/searchPresets";
import UiButton from "@/components/UiButton";
export default {
  components: {
    UiButton,
  },
  data() {
    return {
      searchPresets,
    };
  },
}
</script>

<style lang="scss" scoped>
.site-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: darken($primary, 5%);
  background-image: url(~@/assets/quadrata-bg.png);

  h1 {
    color: $primary-text;
    margin: 0 0 .5rem;
  }
}

.rest {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.nav {
  display: flex;
  align-items: center;
  height: 2rem;

  @media screen and (max-width: #{$mq-max-width}) {
    display: none;
  }
}

a {
  color: $primary-text;
  margin: 0 1rem;
  &:not(.home-link) {
    padding: 0.75rem 0 1rem;
  }
  &:not(:hover), &.home-link {
    text-decoration: none;
  }
}
</style>