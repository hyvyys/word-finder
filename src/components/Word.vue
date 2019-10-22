<template>
  <div class="word">
    {{ word }}
    <!-- <div class="tools">
      Pin
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    word: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
.tools {
  display: none;
}

.word {
  border-radius: 4px;
  position: relative;

  &:hover {
    background: #eee;
    .tools {
      position: absolute;
      top: 100%;
      left: 0;
      display: flex;
      background: #eee;
      padding: 0.5rem;
      z-index: 1;
      box-shadow: 0 2px 2px #333;
    }
  }
}
</style>