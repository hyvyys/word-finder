<template>
  <div id="app" class="app" :class="{ 'with-keyboard': isKeyboardVisible }" >
    <SiteHeader />

    <main>
      <router-view></router-view>
    </main>

    <AccentKeyboard
      toggleSelector="#accent-keyboard-toggle"
      @expand="isKeyboardVisible = true"
      @collapse="isKeyboardVisible = false"
    />
    <SiteFooter />
  </div>
</template>

<script>
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AccentKeyboard from "@/components/AccentKeyboard";

export default {
  name: 'app',
  components: {
    SiteHeader,
    SiteFooter,
    AccentKeyboard,
  },
  data() {
    return {
      isKeyboardVisible: false,
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/utils";
@import "~@/styles/keen-ui";
@import "~@/styles/vue-slider";

body {
  font-family: $font-stack;
  margin: 0;
  overflow: auto scroll;
}

*, *::after, *::before {
  box-sizing: border-box;
}

main {
  min-height: 100vh;
}

.container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding-bottom: 3rem;
}

.section-label {
  background: $primary;
  // margin: 0.5rem 0;
  display: block;
  padding: 0.25rem 0.5rem;
  color: $primary-text;
}
</style>
