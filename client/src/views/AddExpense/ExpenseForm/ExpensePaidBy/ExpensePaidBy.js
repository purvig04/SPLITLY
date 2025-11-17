export default {
  name: "ExpensePaidBy",

  props: {
    participants: {
      type: Array,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
    paidBy: {
      type: Object,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    selectedPaidBy: {
      type: Set,
      required: true,
    },
    hasAmount: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:paidBy", "toggle-paid-by", "validate-paid-total"],

  data() {
    return {
      paidByError: "",
    };
  },

  methods: {
    isPaidBy(participantId) {
      return this.selectedPaidBy.has(participantId);
    },

    togglePaidBy(participantId) {
      if (!this.hasAmount) return;
      this.$emit("toggle-paid-by", participantId);
    },

    updatePaidAmount(participantId, value) {
      if (!this.hasAmount) return;
      const updatedPaidBy = { ...this.paidBy, [participantId]: value };
      this.$emit("update:paidBy", updatedPaidBy);
      this.validatePaidTotal(updatedPaidBy);
    },

    validatePaidTotal(paidByData = this.paidBy) {
      const totalPaid = Object.values(paidByData).reduce(
        (sum, val) => sum + (parseFloat(val) || 0),
        0
      );

      if (Math.abs(totalPaid - this.totalAmount) > 0.01) {
        this.paidByError = `Total paid (₹${totalPaid.toFixed(
          2
        )}) must equal expense amount (₹${this.totalAmount.toFixed(2)})`;
      } else {
        this.paidByError = "";
      }

      this.$emit("validate-paid-total", this.paidByError);
    },
  },

  watch: {
    totalAmount() {
      this.validatePaidTotal();
    },
    paidBy: {
      handler() {
        this.validatePaidTotal();
      },
      deep: true,
    },
  },
};