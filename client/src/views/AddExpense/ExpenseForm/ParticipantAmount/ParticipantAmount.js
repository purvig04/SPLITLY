export default {
  name: "ParticipantAmount",

  props: {
    participant: { type: Object, required: true },
    splitMethod: { type: String, required: true },
    amount: { type: Number, default: null },
    totalAmount: { type: Number, required: true },
    allSplits: { type: Object, default: () => ({}) },
    isExcluded: { type: Boolean, default: false },
  },

  emits: ["update"],

  data() {
    return {
      displayValue: "",
      isFocused: false,
    };
  },

  watch: {
    amount: {
      handler(newVal) {
        if (!this.isFocused) {
          this.displayValue =
            newVal === null || newVal === undefined || isNaN(newVal)
              ? ""
              : this.formatAmount(newVal);
        }
      },
      immediate: true,
    },
  },

  computed: {
    calculatePercentageAmount() {
      return this.totalAmount * ((this.amount || 0) / 100);
    },

    calculateShareAmount() {
      const totalShares = Object.values(this.allSplits).reduce(
        (sum, shares) => sum + (parseInt(shares) || 1),
        0
      );
      const amountPerShare = totalShares ? this.totalAmount / totalShares : 0;
      return amountPerShare * (parseInt(this.amount) || 1);
    },
  },

  methods: {
    formatAmount(value) {
      if (value === null || value === undefined || isNaN(value)) return "";
      return parseFloat(value).toFixed(2);
    },

    handleInput(event) {
      this.displayValue = event.target.value;
      const raw = parseFloat(event.target.value);
      this.$emit("update", isNaN(raw) ? null : raw);
    },

    handleFocus() {
      this.isFocused = true;
      this.displayValue =
        this.amount === null || this.amount === undefined
          ? ""
          : String(this.amount);
    },

    handleUpdate(value) {
      this.displayValue = value;

      const numValue = parseFloat(value);

      if (this.splitMethod === "percentage") {
        if (numValue > 100) value = "100";
        else if (numValue < 0) value = "0";
      }

      if (this.splitMethod === "unequal") {
        if (numValue > this.totalAmount) value = this.totalAmount.toString();
        else if (numValue < 0) value = "0";
      }

      this.$emit("update", parseFloat(value) || 0);
    },
    
    handleBlur() {
      this.isFocused = false;
      this.displayValue =
        this.amount === null || this.amount === undefined
          ? ""
          : this.formatAmount(this.amount);
    },

    incrementShare() {
      const currentValue = Math.round(this.amount) || 1;
      this.$emit("update", currentValue + 1);
    },

    decrementShare() {
      const currentValue = Math.round(this.amount) || 1;
      if (currentValue > 1) {
        this.$emit("update", currentValue - 1);
      }
    },
  },
};