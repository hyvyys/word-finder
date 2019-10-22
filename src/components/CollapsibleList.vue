<template>
  <div class='collapsible-list'>
    <div class='show-less-btn' v-if="activeStopIndex > 0 && items.length > stops[0]" @click="collapse">
      collapse
    </div>
    <div class='item' v-for="(item, k) in items.slice(0, activeStop)" :key="k">
      <slot :item="item">
        {{ item }}
      </slot>
    </div>
    <div class='show-more-btn' v-if="items.length > activeStop" @click="showMore">
      ...show next {{nextCount}} of {{restCount}}
    </div>
    <div class='show-less-btn' v-if="activeStopIndex > 0 && items.length > stops[0]" @click="collapse">
      collapse
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
  },
  data() {
    return {
      activeStopIndex: 0,
    };
  },
  computed: {
    stops() {
      const a = [ 5, 100, 1000 ];
      function sum(a) {
        return a.reduce((acc, i) => acc + i, 0);
      }
      return a.map((n,i) => n + sum(a.slice(0, i)));
      return a;
    },
    activeStop() {
      return this.stops[this.activeStopIndex];
    },
    nextStop() {
      return this.stops[this.activeStopIndex + 1];
    },
    nextCount() {
      return Math.min(this.restCount, (this.nextStop || this.items.length) - this.activeStop);
    },
    restCount() {
      return this.items.length - this.activeStop;
    },
  },
  methods: {
    showMore() {
      this.activeStopIndex++;
    },
    showLess() {
      this.activeStopIndex = Math.max(0, this.activeStopIndex - 1);
    },
    collapse() {
      const bottom1 = this.$el.getBoundingClientRect().bottom;
      this.activeStopIndex = 0;
      this.$nextTick(() => {
        const bottom2 = this.$el.getBoundingClientRect().bottom;
        const diff = bottom1 - bottom2;
        if (bottom2 < 0)
          document.scrollingElement.scrollTop -= diff;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.collapsible-list {
  flex: 1;
}

.item {
  display: flex;
  align-items: flex-end;
}

.show-more-btn,
.show-less-btn {
  text-decoration: underline;
  text-align: right;
  cursor: pointer;
  &:hover {
    background: linear-gradient(to right, transparent, rgba($primary, 0.5));
  }
}
.show-more-btn {
  flex: 1;
  white-space: nowrap;
}
.show-less-btn {
  flex: 100%;
}
</style>