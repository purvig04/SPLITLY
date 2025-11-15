export default {
  name: "ExpenseDetails",
  
  props: {
    formData: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    isFormValid: {
      type: Boolean,
      required: true
    }
  },

  emits: ["update:formData", "cancel", "submit"],

  methods: {
    updateField(field, value) {
      this.$emit("update:formData", { ...this.formData, [field]: value });
    },

    handleAmountChange(value) {
      this.updateField("amount", value);
    }
  }
};