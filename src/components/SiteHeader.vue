<template>
  <div class="site-header">
    <nav class="nav">
      <router-link class="home-link" to="/">
        <h1>Word Finder</h1>
      </router-link>

      <router-link v-for="(preset, i) in searchPresets" :key="i" :to="preset.url">{{ preset.title}}</router-link>
    </nav>

    <UiButton id="accent-keyboard-toggle">keyboard</UiButton>
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
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: $primary;
  background-image: url(~@/assets/quadrata-bg.jpg);
  // background-position-y: 15%;
  background-blend-mode: color-burn;

  h1 {
    color: $primary-text;
    margin: 0 0 .5rem;
  }
}

.nav {
  display: flex;
  align-items: center;
  height: 2rem;
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