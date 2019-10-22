export default {
  data() {
    return {
      isCollapsed: true,
    };
  },
  props: {
    startCollapsed: { type: Boolean, default: true },
    toggleSelector: { type: String },
  },
  created() {
    this.isCollapsed = this.startCollapsed;
  },
  mounted() {
    if (this.toggleSelector) {
      document.querySelectorAll(this.toggleSelector).forEach(el => el.addEventListener("click", this.toggle));
    }
  },
  beforeDestroy() {
    if (this.toggleSelector) {
      document.querySelectorAll(this.toggleSelector).forEach(el => el.removeEventListener("click", this.toggle));
    }
  },
  methods: {
    toggle() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        this.$emit("collapse");
      }
      else {
        this.$emit("expand");
      }
    }
  },
}