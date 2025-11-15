import ExpenseDetails from "./ExpenseDetails/ExpenseDetails.vue";
import ExpenseSplit from "./ExpenseSplit/ExpenseSplit.vue";
import ExpensePaidBy from "./ExpensePaidBy/ExpensePaidBy.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ExpenseForm",

  components: {
    ExpenseDetails,
    ExpenseSplit,
    ExpensePaidBy,
  },

  props: {
    participants: {
      type: Array,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },

  emits: ["submit", "cancel"],

  data() {
    return {
      activeTab: "split",
      formData: {
        title: "",
        description: "",
        amount: "",
        category: "",
        splitMethod: "equal",
      },
      splits: {},
      paidBy: {},
      selectedPaidBy: new Set(),
      paidByError: "",
      splitError: "",
      manuallyEditedSplits: new Set(),
      excludedMembersFromSplit: new Set(),
    };
  },

  computed: {
    ...mapGetters("categories", ["getCategories"]),
    categories() {
      return this.getCategories;
    },

    allParticipants() {
      return [this.currentUser, ...this.participants];
    },

    hasAmount() {
      return (
        this.formData.amount !== "" && parseFloat(this.formData.amount) > 0
      );
    },

    isFormValid() {
      const hasTitle = this.formData.title.trim() !== "";
      const hasAmount = this.hasAmount;
      const hasCategory = this.formData.category !== "";
      const hasPaidBy = this.selectedPaidBy.size > 0;
      const paidByValid = this.paidByError === "";
      const splitValid = this.splitError === "";

      return (
        hasTitle &&
        hasAmount &&
        hasCategory &&
        hasPaidBy &&
        paidByValid &&
        splitValid
      );
    },
  },

  methods: {
    ...mapActions("categories", ["loadCategories"]),

    initializeSplits() {
      const totalAmount = parseFloat(this.formData.amount) || 0;

      const includedParticipants =
        this.formData.splitMethod === "equal"
          ? this.allParticipants.filter(
              (p) => !this.excludedMembersFromSplit.has(p.id)
            )
          : this.allParticipants;

      const perPerson =
        includedParticipants.length > 0
          ? totalAmount / includedParticipants.length
          : 0;

      this.manuallyEditedSplits.clear();

      this.allParticipants.forEach((p) => {
        if (this.formData.splitMethod === "equal") {
          this.splits[p.id] = this.excludedMembersFromSplit.has(p.id)
            ? 0
            : perPerson;
        } else if (this.formData.splitMethod === "shares") {
          this.splits[p.id] = 1;
        } else if (this.formData.splitMethod === "percentage") {
          this.splits[p.id] = 100 / this.allParticipants.length;
        } else if (this.formData.splitMethod === "unequal") {
          this.splits[p.id] = null;
        }
      });

      this.splits = { ...this.splits };
      this.initializePaidBy();
    },

    toggleMemberInSplit(participantId) {
      if (this.excludedMembersFromSplit.has(participantId)) {
        this.excludedMembersFromSplit.delete(participantId);
      } else {
        this.excludedMembersFromSplit.add(participantId);
      }

      this.excludedMembersFromSplit = new Set(this.excludedMembersFromSplit);

      if (this.formData.splitMethod === "equal") {
        this.initializeSplits();
        this.validateSplitTotals();
      }
    },

    initializePaidBy() {
      if (this.hasAmount) {
        this.selectedPaidBy = new Set([this.currentUser.id]);
        this.paidBy = { [this.currentUser.id]: this.formData.amount };
        this.paidByError = "";
      }
    },

    redistributeUnequal(changedParticipantId) {
      const totalAmount = parseFloat(this.formData.amount) || 0;

      this.manuallyEditedSplits.add(changedParticipantId);

      const manuallyEdited = [];
      const autoDistributed = [];

      this.allParticipants.forEach((p) => {
        if (this.manuallyEditedSplits.has(p.id)) {
          manuallyEdited.push({
            id: p.id,
            value: parseFloat(this.splits[p.id]) || 0,
          });
        } else {
          autoDistributed.push({ id: p.id });
        }
      });

      const manualTotal = manuallyEdited.reduce((sum, p) => sum + p.value, 0);

      const remaining = totalAmount - manualTotal;

      if (autoDistributed.length > 0) {
        const perPerson = Math.max(0, remaining / autoDistributed.length);
        autoDistributed.forEach((p) => {
          this.splits[p.id] = perPerson;
        });
      }

      this.splits = { ...this.splits };

      this.validateSplitTotals();
    },

    redistributePercentage(changedParticipantId) {
      this.manuallyEditedSplits.add(changedParticipantId);

      const manuallyEdited = [];
      const autoDistributed = [];

      this.allParticipants.forEach((p) => {
        if (this.manuallyEditedSplits.has(p.id)) {
          manuallyEdited.push({
            id: p.id,
            value: parseFloat(this.splits[p.id]) || 0,
          });
        } else {
          autoDistributed.push({ id: p.id });
        }
      });

      const manualTotal = manuallyEdited.reduce((sum, p) => sum + p.value, 0);

      const remaining = 100 - manualTotal;

      if (autoDistributed.length > 0) {
        const perPerson = Math.max(0, remaining / autoDistributed.length);
        autoDistributed.forEach((p) => {
          this.splits[p.id] = perPerson;
        });
      }

      this.splits = { ...this.splits };

      this.validateSplitTotals();
    },

    redistributeShares() {
      this.splits = { ...this.splits };
      this.splitError = "";
    },

    validateSplitTotals() {
      const totalAmount = parseFloat(this.formData.amount) || 0;

      if (this.formData.splitMethod === "equal") {
        const includedCount = this.allParticipants.filter(
          (p) => !this.excludedMembersFromSplit.has(p.id)
        ).length;

        if (includedCount < 2) {
          this.splitError = "At least two members must be included in the split";
          return;
        }
      }
      if (this.formData.splitMethod === "unequal") {
        const totalSplit = this.allParticipants.reduce((sum, p) => {
          return sum + (parseFloat(this.splits[p.id]) || 0);
        }, 0);

        if (Math.abs(totalSplit - totalAmount) > 0.01) {
          this.splitError = `Total split (₹${totalSplit.toFixed(
            2
          )}) must equal expense amount (₹${totalAmount.toFixed(2)})`;
        } else {
          this.splitError = "";
        }
      } else if (this.formData.splitMethod === "percentage") {
        const totalPercentage = this.allParticipants.reduce((sum, p) => {
          return sum + (parseFloat(this.splits[p.id]) || 0);
        }, 0);

        if (Math.abs(totalPercentage - 100) > 0.01) {
          this.splitError = `Total percentage (${totalPercentage.toFixed(
            2
          )}%) must equal 100%`;
        } else {
          this.splitError = "";
        }
      } else {
        this.splitError = "";
      }
    },

    updateFormData(newFormData) {
      this.formData = { ...this.formData, ...newFormData };
    },

    handleAmountChange() {
      if (this.formData.splitMethod === "equal") {
        this.initializeSplits();
      } else if (this.formData.splitMethod === "unequal") {
        const totalAmount = parseFloat(this.formData.amount) || 0;

        const manuallyEdited = [];
        const autoDistributed = [];

        this.allParticipants.forEach((p) => {
          if (this.manuallyEditedSplits.has(p.id)) {
            manuallyEdited.push({
              id: p.id,
              value: parseFloat(this.splits[p.id]) || 0,
            });
          } else {
            autoDistributed.push({ id: p.id });
          }
        });

        const manualTotal = manuallyEdited.reduce((sum, p) => sum + p.value, 0);
        const remaining = totalAmount - manualTotal;

        if (autoDistributed.length > 0) {
          const perPerson = Math.max(0, remaining / autoDistributed.length);
          autoDistributed.forEach((p) => {
            this.splits[p.id] = perPerson;
          });
        }

        this.splits = { ...this.splits };
      } else if (this.formData.splitMethod === "shares") {
        this.splits = { ...this.splits };
      } else if (this.formData.splitMethod === "percentage") {
        this.splits = { ...this.splits };
      }

      this.initializePaidBy();
    },

    handleSplitMethodChange(method) {
      this.formData.splitMethod = method;
      this.excludedMembersFromSplit.clear();
      this.initializeSplits();
    },

    handleSplitUpdate(participantId, value) {
      if (this.formData.splitMethod === "unequal") {
        this.splits[participantId] =
          value === "" || value === null ? null : parseFloat(value);
        this.redistributeUnequal(participantId);
      } else if (this.formData.splitMethod === "percentage") {
        this.splits[participantId] = parseFloat(value) || 0;
        this.redistributePercentage(participantId);
      } else if (this.formData.splitMethod === "shares") {
        this.splits[participantId] = parseInt(value) || 1;
        this.redistributeShares();
      }
    },

    togglePaidBy(participantId) {
      const newSelectedPaidBy = new Set(this.selectedPaidBy);

      if (newSelectedPaidBy.has(participantId)) {
        newSelectedPaidBy.delete(participantId);
        const newPaidBy = { ...this.paidBy };
        delete newPaidBy[participantId];
        this.paidBy = newPaidBy;
      } else {
        newSelectedPaidBy.add(participantId);
        if (!(participantId in this.paidBy)) {
          this.paidBy = { ...this.paidBy, [participantId]: "" };
        }
      }

      this.selectedPaidBy = newSelectedPaidBy;
    },

    updatePaidBy(newPaidBy) {
      this.paidBy = { ...newPaidBy };
    },

    validatePaidTotal(error) {
      this.paidByError = error;
    },

    handleSubmit() {
      if (!this.isFormValid) return;

      const expenseData = {
        title: this.formData.title,
        description: this.formData.description,
        totalAmount: parseFloat(this.formData.amount),
        categoryId: this.formData.category,
        paid_by: { ...this.paidBy },
        shared_amounts: { ...this.splits },
      };

      this.$emit("submit", expenseData);
    },
  },

  async mounted() {
    this.initializeSplits();
    await this.loadCategories();
  },

  watch: {
    "formData.amount"() {
      this.handleAmountChange();
    },
    participants: {
      handler() {
        this.initializeSplits();
      },
      deep: true,
    },
  },
};
