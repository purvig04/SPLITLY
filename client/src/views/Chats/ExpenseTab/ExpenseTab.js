import { getFriendById } from "@/services/friends.service";
import { mapActions } from "vuex";

export default {
  name: "ExpenseTab",

  props: ["friendId", "page"],

  data() {
    return {
      expenses: [],
      isFriend: false,
      isCheckingFriend: true,
    };
  },

  methods: {
    ...mapActions("friends", ["createFriend"]),

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
    async goToAddExpense() {
      await this.checkIfFriend();

      if (!this.isFriend) {
        await this.createFriend(this.friendId);
      }

      this.$router.push({
        name: "AddExpense",
        query: { source: "friend", friendId: this.friendId },
      });
    },

    async checkIfFriend() {
      try {
        const result = await getFriendById(this.friendId);
        if (!result) {
          this.isFriend = false;
        } else {
          this.isFriend = true;
        }
      } catch (error) {
        console.log("Error checking friend status:", error);
        this.isFriend = false;
      }
    },
  },

  mounted() {
    this.setExpenses();
  },
};
