<template>
  <div class="ui-slider" :style="`height: ${sliderHeight}px`">
    <label v-if="label" class="label">{{ label }}</label>
    
    <div class="track" ref="track" @mousedown="onTrackMouseDown">
      <div class="range-empty" :style="rangeEmptyStyle" />
      <div class="range" :style="rangeStyle" />
      <div class="knob knob-1" :style="knobStyle + ` left: ${knobLeft[0]}px;`" @mousedown.stop="onKnobMouseDown(0)">
        <div class="knob-inner" :style="knobInnerStyle">
          <div class="text">{{ formatValue(value[0]) }}</div>
          <div class="marker" :style="markerStyle"></div>
        </div>
      </div>
      <div class="knob knob-2" :style="knobStyle + ` left: ${knobLeft[1]}px;`" @mousedown.stop="onKnobMouseDown(1)">
        <div class="knob-inner" :style="knobInnerStyle">
          <div class="marker" :style="markerStyle"></div>
          <div class="text">{{ formatValue(value[1]) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Array, required: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    label: { type: String },
    formatValue: { type: Function, default: () => (v) => v },

    sliderHeight: { type: Number, default: 32 },
    knobWidth: { type: Number, default: 32 },
    knobHeight: { type: Number, default: 32 },
    rangeHeight: { type: Number, default: 24 },
    markerHeight: { type: Number, default: 38 },
    markerWidth: { type: Number, default: 4 },
  },
  data() {
    return {
      knobLeft: [ 0, 0 ],
      knobClicked: null,
      delta: 0,
      trackWidth: 0,
    };
  },
  computed: {
    range() {
      return this.max - this.min;
    },
    knobStyle() {
      return `width: ${this.knobWidth}px;`;
    },
    knobInnerStyle() {
      return `height: ${this.knobHeight}px;`;
    },
    rangeStyle() {
      const half = this.knobWidth / 2;
      const l = this.knobLeft[0] + half;
      const w = this.knobLeft[1] - this.knobLeft[0];
      return `height: ${this.rangeHeight}px; left: ${l}px; width: ${w}px;`;
    },
    rangeEmptyStyle() {
      return `height: ${this.rangeHeight}px;`;
    },
    markerStyle() {
      return `height: ${this.markerHeight}px; width: ${this.markerWidth}px;`;
    },
  },
  watch: {
    value() {
      this.render();
    },
  },
  mounted() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    this.render();
  },
  beforeDestroy() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  },
  methods: {
    roundToStep(v) {
      return Math.round(v);
    },
    getTrackWidth() {
      return this.trackWidth || Math.round(this.$refs.track.getBoundingClientRect().width);
    },
    getTrackUsableWidth() {
      return this.getTrackWidth() - 2 * this.knobWidth;
    },
    getTrackLeft() {
      return Math.round(this.$refs.track.getBoundingClientRect().left);
    },
    render() {
      if (this.knobClicked != null) return;
      this.computeLeft();
    },
    async computeLeft() {
      await this.$nextTick();
      this.setKnobLeft(0, this.value[0]);
      this.setKnobLeft(1, this.value[1]);
    },
    setKnobLeft(i, val) {
      const w = this.getTrackUsableWidth();
      const adjust = i === 1 ? this.knobWidth : 0;
      this.$set(this.knobLeft, i, adjust + (val - this.min) / this.range * w);
    },
    onKnobMouseDown(i) {
      this.knobClicked = i;
    },
    onMouseUp() {
      this.knobClicked = null;
      this.delta = 0;
      this.render();
    },
    onTrackMouseDown(event) {
      const w = this.getTrackUsableWidth();
      const l = this.getTrackLeft() + this.knobWidth / 2;
      let x = event.clientX - l;
      let val = x / w * this.range;
      // add tiny difference to select closer knob when their values are the same
      const diffs = this.value.map((v, i) => Math.abs(v + 0.00001 * i - val));
      const i = diffs.indexOf(Math.min(...diffs));
      x += (i ? -1 : 1) * this.knobWidth / 2
      val = x / w * this.range;
      val = this.adjustValue(i, val);
      val = this.roundToStep(val);
      this.setValue(i, val);
      this.$nextTick(() => {
        this.knobClicked = i;
      });
    },
    onMouseMove(event) {
      if (this.knobClicked != null) {
        const i = this.knobClicked;
        const dx = event.movementX;
        const w = this.getTrackUsableWidth();
        const delta = dx / w * this.range;
        this.delta += delta;

        let val = this.adjustValue(i, this.value[i] + this.delta);
        this.setKnobLeft(i, val);
        // this.setKnobLeft(i, this.knobLeft[i] + dx);
        if (Math.abs(this.delta) >= 0.5) {
          val = this.roundToStep(val);
          const consumedDelta = val - this.value[i];
          this.delta -= consumedDelta;
          this.setValue(i, val);
        }
      }
    },
    adjustValue(i, val) {
      val = Math.min(this.max, val);
      val = Math.max(this.min, val);
      if (i === 0) val = Math.min(val, this.value[1]);
      if (i === 1) val = Math.max(val, this.value[0]);
      return val;
    },
    setValue(i, val) {
      const newValue = this.value.slice();
      newValue[i] = val;
      this.$emit("input", newValue);
    },
  },
}
</script>

<style lang="scss" scoped>
$primary: royalblue !default;
$secondary: #6a99ff !default;

.ui-slider {
  @include ui-labelled;
  width: 100%;
  flex: 1;
  min-width: 10em;
  display: flex;
  align-items: center;
}

$border-radius: 0.3em;
$marker-border-radius: 0;

.track {
  border-radius: $border-radius;
  flex: 1;
  position: relative;
  .knob,
  .range,
  .range-empty {
    border-radius: $border-radius;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    // overflow: hidden;
    user-select: none;
    $d: 0.05s;
  }
  .range {
    top: 50%;
    transform: translateY(-50%);
    background: rgba($primary, 0.7);
  }
  .range-empty {
    background: rgba($primary, 0.7);
    background-color: $md-grey-400;
  }
  .knob {
    flex-shrink: 0;
    flex-shrink: 0;
    @include ui-background-primary;
    .knob-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .text {
        text-align: center;
      }
      .marker {
        border-radius: $marker-border-radius;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: $primary;
      }
    }
  }
  .knob-1 {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    .knob-inner {
      .text {
        margin-right: 2px;
      }
      .marker {
        right: 0px;
        border-right: 1px solid white;
      }
    }
  }
  .knob-2 {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    .knob-inner {
      .text {
        margin-left: 2px;
      }
      .marker {
        left: -1px;
        border-left: 1px solid white;
      }
    }
  }
}
</style>