<template>
  <div class="accent-keyboard" v-show="!isCollapsed">
    <UiButton class="btn btn-desktop" @click="toggleCapsLock">⇪</UiButton>
  
    <div class="keys">
      <UiButton v-for="l in accents" :key="l" @click="typeAccent(l)">
        {{ formatAccent(l) }}
      </UiButton>
    </div>
  
    <div class="btns-mq">
      <UiButton class="btn" @click="toggle">×</UiButton>
      <UiButton class="btn" @click="toggleCapsLock">⇪</UiButton>
    </div>
  
    <UiButton class="btn btn-desktop" @click="toggle">×</UiButton>
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
      capsLock: false,

      accents: 
      (
        "áàăâåäãąāæćĉčċçďđðéèĕêěëėęēğĝġģĥħíìĭîïĩįīĳıĵķĺľļłŀńňñņŋóòŏôöőõøōœĸŕřŗßśŝšşťţŧúùŭûůüűũųūŵýŷÿźžżþ" +
        "ſɓɗɛƒɣɨƙƚơɔƥƭưʉƴʒǀǁǂǃ"
      ).split('').sort((a, b) => a.localeCompare(b)),
    };
  },
  computed: {
    isTextArea() {
      return this.focusedInput && this.focusedInput.tagName.toLowerCase() === 'textarea';
    }
  },
  created() {
    document.addEventListener('focusin', this.focusChanged);
    window.addEventListener('keyup', this.checkCapsLock);
    this.$on('expand', () => {
      this.focusInput();
    });
  },
  beforeDestroy() {
    document.removeEventListener('focusin', this.focusChanged)
    window.removeEventListener('keyup', this.checkCapsLock);
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
    checkCapsLock(e) {
      this.capsLock = e.getModifierState("CapsLock");
    },
    toggleCapsLock() {
      this.capsLock = !this.capsLock;
    },
    formatAccent(l) {
      return this.capsLock ? l.toUpperCase() : l;
    },
    typeAccent(l) {
      const input = this.focusedInput;
      if (!input) return;
      const pos = input.selectionStart;
      input.value = input.value.slice(0, pos) + this.formatAccent(l) + input.value.slice(pos);
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
  left: 50%;
  width: 1200px;
  max-width: 100%;
  transform: translateX(-50%);
  background: $light;
  box-shadow: 0 1px 7px rgba(#333, 0.6);
  border-radius: 4px 4px 0 0;
  padding: 0.5rem;

  display: flex;
  align-items: flex-start;

  .btns-mq {
    display: none;
  }


  .btn {
    font-size: 1.5rem;
    ::v-deep .ui-button__content {
      padding-bottom: 0.2rem;
    }
  }

  @media screen and (max-width: #{$mq-max-width}) {
    display: grid;
    grid-template-columns: auto auto;
    .btns-mq {
      height: 100%;
      display: flex;
      flex-direction: column;
      .btn {
        padding: 0 2px;
        min-width: 2rem;
        flex: 1;
      }
    }
    .btn-desktop {
      display: none;
    }
  }

  .keys {
    max-height: 25vh;
    overflow: auto;
    
    margin: 0 1rem;
    @media screen and (max-width: #{$mq-max-width}) {
      margin: 0 4px;
    }

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
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