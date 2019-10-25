<template>
  <div class="accent-keyboard" v-show="!isCollapsed">
    <div class="btns-desktop">
      <UiButton class="btn" @click="nextCharset">{{ charsetSymbol }}</UiButton>
      <UiButton class="btn btn-icon" @click="toggleCapsLock">⇪</UiButton>
    </div>
  
    <div class="keys">
      <UiButton v-for="l in accents" :key="l" @click="typeAccent(l)">
        {{ formatAccent(l) }}
      </UiButton>
    </div>
  
    <div class="btns-mq">
      <UiButton class="btn btn-icon" @click="toggle">×</UiButton>
      <UiButton class="btn btn-icon" @click="toggleCapsLock">⇪</UiButton>
      <UiButton class="btn" @click="nextCharset">{{ charsetSymbol }}</UiButton>
    </div>
  
    <UiButton class="btn btn-icon btns-desktop" @click="toggle">×</UiButton>
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
      selectedCharset: 0,
      charsets: [
        {
          name: 'Latin',
          symbol: 'ļåťň',
          chars: [
            'áàăâåäãąāæćĉčċçďđðéèĕêěëėęēğĝġģĥħíìĭîïĩįīĳıĵķĺľļłŀńňñņŋóòŏôöőõøōœĸŕřŗßśŝšşťţŧúùŭûůüűũųūŵýŷÿźžżþſɓɗɛƒɣɨƙƚơɔƥƭưʉƴʒǀǁǂǃ',
          ],
        },
        {
          name: 'Cyrillic',
          symbol: 'сўяг',
          chars: [
            'абвгдежзийклмнопрстуфхцчшщъыьэюя','ѐёђѓєѕіїјљњћќѝўџѡѣѥѩѭѱѳѵѷѹѻѽѿҁҋҍҏґғҕҗҙқҝҟҡңҥҧҩҫҭүұҳҵҷҹһҽҿӂӄӆӈӊӌӎӏӑӓӕӗәӛӝӟӡӣӥӧөӫӭӯӱӳӵӷӹӻӽӿ',
          ],
        },
        {
          name: 'Greek',
          symbol: 'grek',
          chars: [
            'αβγδεζηθικλμνξοπρσςτυφχψω',
          ],
        },
      ],
    };
  },
  computed: {
    isTextArea() {
      return this.focusedInput && this.focusedInput.tagName.toLowerCase() === 'textarea';
    },
    accents() {
      return this.charsets[this.selectedCharset].chars.flatMap(a => a.split('').sort((a, b) => a.localeCompare(b)));
    },
    charsetSymbol() {
      return this.charsets[this.selectedCharset].symbol;
    },
    nextCharsetSymbol() {
      const i = this.getNextCharsetIndex();
      return this.charsets[i].symbol;
    },
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
    nextCharset() {
      this.selectedCharset = this.getNextCharsetIndex();
    },
    getNextCharsetIndex() {
      return (this.selectedCharset + 1) % this.charsets.length;
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
  height: 10rem;
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


  .btn-icon  {
    font-size: 1.5rem;
  }
  .btn {
    display: block;
    ::v-deep .ui-button__content {
      padding-bottom: 0.2rem;
    }
  }

  @media screen and (max-width: #{$mq-max-width}) {
    display: grid;
    grid-template-columns: auto auto;
    .btns-mq {
      height: 100%;
      margin-right: 4px;
      display: flex;
      flex-direction: column;
      .btn {
        padding: 0 2px;
        min-width: 2.1rem;
        min-height: 20px;
        flex: 1;
        &:not(:last-child) {
          margin-bottom: 4px;
        }
      }
    }
    .btns-desktop {
      display: none;
    }
  }

  .keys {
    flex: 1;
    max-height: 100%;
    overflow: auto;
    
    margin: 0 1rem;
    @media screen and (max-width: #{$mq-max-width}) {
      margin: 0 4px 4px 0;
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