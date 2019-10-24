<template>
  <div class="fit-me">
    <div
      class="fitted"
      ref="fitted"
      :style="`font-size: ${fontSize}px;`"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, default: '' },
    maxFontSize: { type: Number, default: 16 },
  },
  data() {
    return {
      fontSize: 16,
      onlyDecrease: true,
    };
  },
  mounted() {
    this.runFit();
  },
  watch: {
    text() {
      this.$nextTick(() => {
        this.runFit();
      });
    },
  },
  methods: {
    async fit(i, trial = 0) {
      this.fontSize = this.maxFontSize;
      await this.$nextTick();

      const el = this.$refs.fitted;
      const parent = this.$el;
      let W = parent.clientWidth;
      let w = el.clientWidth;
      if (!w || !W) {
        return;
      }
      if (w === W && trial < 5) { // suspicious
        setTimeout(() => {
          this.fit(0, trial + 1);
        }, 100);
        return;
      }
      let ratio = W / w;
      if (this.onlyDecrease && ratio > 1) return;

      let fontSize = parseFloat(getComputedStyle(el).fontSize);
      let newFontSize = Math.round(fontSize * ratio);
      this.fontSize = newFontSize;
      await this.$nextTick();

      const H = parent.clientHeight;
      const h = el.clientHeight;
      if (h / H < 0.8 && i < this.cutText) {
        await this.fit(i + 1);
      }
    },

    runFit() {
      this.fit(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.fit-me {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
