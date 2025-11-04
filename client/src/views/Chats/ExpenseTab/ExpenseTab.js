export default {
  name: "ExpenseTab",

  data() {
    return {
      expenses: [],
    };
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },

    getMockExpenses() {
      return [
        {
          id: 1,
          description: "Lunch at Restaurant",
          amount: 150.0,
          date: new Date("2025-10-08"),
          type: "owed",
        },
        {
          id: 2,
          description: "Movie Tickets",
          amount: 100.5,
          date: new Date("2025-10-05"),
          type: "owed",
        },
        {
          id: 3,
          description: "Grocery Shopping",
          amount: 200.0,
          date: new Date("2025-10-03"),
          type: "owe",
        },
      ];
    },

    setExpenses() {
      this.expenses = this.getMockExpenses();
    },
  },

  mounted() {
    this._previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    this.setExpenses();
  },

  beforeUnmount() {
    document.body.style.overflow = this._previousBodyOverflow || "";
  },
};
