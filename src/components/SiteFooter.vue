<template>
  <div class="site-footer">
    <span>{{ 'Copyright 2019 Adam\xa0Jagosz' }}</span>
    <a href="https://github.com/hyvyys/word-finder">{{ 'View source on\xa0Github' }}</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
}
</script>

<style lang="scss" scoped>
.site-footer {
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: $primary-text;
  background: darken($primary, 10%);
  background-image: url(~@/assets/quadrata-bg.png);

  > * {
    padding: 0.75rem 1.5rem;
    text-align: center;
  }
}

a {
  color: $primary-text;
}
</style>