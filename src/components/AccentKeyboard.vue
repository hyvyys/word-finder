<template>
  <div class="accent-keyboard" v-show="!isCollapsed">
    <div class="keys">
      <UiButton v-for="l in accents" :key="l" @click="typeAccent(l)">
        {{l}}
      </UiButton>
    </div>
    <UiButton id="close-keyboard">X</UiButton>
  </div>
</template>

<script>
import UiButton from "@/components/UiButton";
import Collapsible from "@/mixins/Collapsible.js";

export default {
  name: 'accent-keyboard',
  mixins: [ Collapsible ],
  components: {
    UiButton,
  },
  data() {
    return {
      focusedInput: null,
      accents: "áàăâåäãąāæćĉčċçďđðéèĕêěëėęēğĝġģĥħíìĭîïĩįīĳıĵķĺľļłŀńňñņŋóòŏôöőõøōœĸŕřŗśŝšşťţŧúùŭûůüűũųūŵýŷÿźžżþ".split(''),
    };
  },
  computed: {
    isTextArea() {
      return this.focusedInput && this.focusedInput.tagName.toLowerCase() === 'textarea';
    }
  },
  created() {
    document.addEventListener('focusin', this.focusChanged);
    this.$on('expand', () => {
      this.focusInput();
    });
  },
  beforeDestroy() {
    document.removeEventListener('focusin', this.focusChanged)
  },
  methods: {
    focusChanged (event) {
      const input = event.target;
      if (input && ['input', 'textarea'].includes(input.tagName.toLowerCase()))
        this.focusedInput = input;
    },
    focusInput() {
      this.focusedInput && this.focusedInput.focus();
    },
    typeAccent(l) {
      const input = this.focusedInput;
      if (!input) return;
      const pos = input.selectionStart;
      input.value = input.value.slice(0, pos) + l + input.value.slice(pos);
      this.dispatchEvent();
      this.$nextTick(() => {
        input.selectionStart = pos + 1;
        input.selectionEnd = pos + 1;
        input.focus();
      });
    },
    dispatchEvent() {
      const input = this.focusedInput;
      var event = new Event('input', { 'bubbles': true, 'cancelable': true });
      input.dispatchEvent(event);
    },
  },
}
</script>
<style lang="scss" scoped>
.accent-keyboard {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 100%;
  background: $light;
  box-shadow: 0 0 10px #333;
  display: flex;
  align-items: flex-start;

  .keys {
    max-width: 800px;
    margin: 1rem auto;
    display: flex;
    flex-wrap: wrap;
    .ui-button {
      min-width: 2rem;
      padding: 0;
      height: 2rem;
      text-transform: none;
      // font-family: Consolas;
      font-weight: normal;
      font-size: 1.2rem;
      border-radius: 0;
    }
  }
}
</style>