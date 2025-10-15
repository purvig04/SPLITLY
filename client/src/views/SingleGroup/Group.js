import { mapGetters, mapActions } from "vuex";
import * as bootstrap from "bootstrap";
import { groupService } from "@/services/groups.service";
import { userService } from "@/services/user.service";

export default {
  name: "GroupPage",
  data() {
    return {
      group: null,
      expenses: [],
      owedToYou: [
        // Example data - replace with real data
        { userId: "1", userName: "John Doe", amount: 500 },
        { userId: "2", userName: "Jane Smith", amount: 250 },
      ],
      youOwe: [
        // Example data - replace with real data
        { userId: "3", userName: "Bob Wilson", amount: 300 },
      ],
      hardcodedExpenses: [
        {
          id: "1",
          title: "Hotel Booking",
          description: "Beach resort for 3 nights",
          paidBy: "Rahul Sharma",
          amount: 4500,
          date: "Jan 15, 2025",
          category: "Accommodation",
          icon: "fa-solid fa-hotel",
          yourShare: 1500,
        },
        {
          id: "2",
          title: "Dinner at Beach Shack",
          description: "Seafood dinner with drinks",
          paidBy: "You",
          amount: 2800,
          date: "Jan 16, 2025",
          category: "Food & Drinks",
          icon: "fa-solid fa-utensils",
          yourShare: -933,
        },
        {
          id: "3",
          title: "Scuba Diving",
          description: "Adventure sports activity",
          paidBy: "Priya Patel",
          amount: 6000,
          date: "Jan 17, 2025",
          category: "Activities",
          icon: "fa-solid fa-person-swimming",
          yourShare: 2000,
        },
        {
          id: "4",
          title: "Cab Fare",
          description: "Airport pickup and drop",
          paidBy: "Amit Kumar",
          amount: 1200,
          date: "Jan 15, 2025",
          category: "Transport",
          icon: "fa-solid fa-taxi",
          yourShare: -400,
        },
        {
          id: "5",
          title: "Grocery Shopping",
          description: "Snacks and beverages",
          paidBy: "You",
          amount: 850,
          date: "Jan 16, 2025",
          category: "Food",
          icon: "fa-solid fa-shopping-cart",
          yourShare: -283,
        },
      ],

      suggestedFriends: [
        // Example data - replace with real data from API
        { id: "1", name: "Alice Johnson", email: "alice@example.com" },
        { id: "2", name: "Charlie Brown", email: "charlie@example.com" },
      ],
      selectedFriends: [],
      emailInput: "",
      userExists: null,
      loadingExpenses: false,
      addingMembers: false,
      addMemberResult: "",
      addMemberResultClass: "",
      checkUserTimeout: null,
    };
  },

  computed: {
    ...mapGetters("groups", ["getGroupById", "isLoading"]),
    groupId() {
      return this.$route.params.id;
    },
    totalOwed() {
      return this.owedToYou.reduce((sum, item) => sum + item.amount, 0);
    },

    totalYouOwe() {
      return this.youOwe.reduce((sum, item) => sum + item.amount, 0);
    },
  },

  methods: {
    ...mapActions("groups", ["addMembers"]),

    // async showMembers(){

    // },

    async fetchGroupDetail() {
      try {
        // Fetch group details
        const { getGroupDetails } = await groupService.getGroupDetails(
          this.groupId
        );

        this.group = getGroupDetails;
        console.log("+++++++++", this.group);

        // Fetch expenses for this group
        await this.loadExpenses();

        // Fetch suggested friends
        await this.loadSuggestedFriends();

        // Calculate balances
        await this.calculateBalances();
      } catch (error) {
        console.error("Error loading group:", error);
        this.$router.push("/groups");
      }
    },

    async loadExpenses() {
      this.loadingExpenses = true;
      try {
        // Replace with actual API call
        // this.expenses = await expenseService.getGroupExpenses(this.groupId);
        this.expenses = []; // Placeholder
      } catch (error) {
        console.error("Error loading expenses:", error);
      } finally {
        this.loadingExpenses = false;
      }
    },

    async loadSuggestedFriends() {
      try {
        // Replace with actual API call to get friends with shared expense history
        // this.suggestedFriends = await friendService.getSuggestedFriends(this.groupId);
      } catch (error) {
        console.error("Error loading suggested friends:", error);
      }
    },

    async calculateBalances() {
      try {
        // Replace with actual balance calculation from API
        // const balances = await balanceService.getGroupBalances(this.groupId);
        // this.owedToYou = balances.owedToYou;
        // this.youOwe = balances.youOwe;
      } catch (error) {
        console.error("Error calculating balances:", error);
      }
    },

    async checkUserExists() {
      if (this.checkUserTimeout) {
        clearTimeout(this.checkUserTimeout);
      }

      if (!this.isValidEmail(this.emailInput)) {
        this.userExists = null;
        return;
      }

      this.checkUserTimeout = setTimeout(async () => {
        try {
          // API call if to checkuser in the backend
          const exists = await userService.checkUserExists(this.emailInput);
          this.userExists = exists.checkUserExists;
        } catch (error) {
          console.error("Error checking user:", error);
          this.userExists = null;
        }
      }, 500);
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    addByEmail() {
      if (this.emailInput && this.isValidEmail(this.emailInput)) {
        if (!this.selectedFriends.includes(this.emailInput)) {
          this.selectedFriends.push(this.emailInput);
        }
        this.emailInput = "";
        this.userExists = null;
      }
    },

    isSelected(email) {
      return this.selectedFriends.includes(email);
    },

    removeSelectedEmail(email) {
      console.log("working");

      this.selectedFriends = this.selectedFriends.filter((e) => e !== email);
    },

    async handleAddMembers() {
      if (this.selectedFriends.length === 0) return;


      this.addingMembers = true;
      this.addMemberResult = "";

      try {
        console.log(this.selectedFriends);

        const res = await groupService.addMemberToGroup(
          this.groupId,
          this.selectedFriends
        );
        
        const result=res.addMemberToGroup

        // this.addMemberResult = `Successfully added${this.selectedFriends.length} members(s)`;
        // this.addMemberResultClass ="alert-success";

        // await this.fetchGroupDetail();

        let message = "";

        if (result.added && result.added.length > 0) {
          message += `✓ Added ${result.added.length} member(s). `;
          this.addMemberResultClass = "alert-success";
        }
        if (result.invited && result.invited.length > 0) {
          message += `✉ Sent ${result.invited.length} invite(s). `;
          this.addMemberResultClass = "alert-info";
        }
        if (result.alreadyMembers && result.alreadyMembers.length > 0) {
          message += `⚠ ${result.alreadyMembers.length} already member(s).`;
          this.addMemberResultClass = "alert-warning";
        }
        console.log("this is message", message);

        this.addMemberResult = message;

        this.group = result.updatedGroup;

        // Reset and close modal after success
        setTimeout(() => {
          this.selectedFriends = [];
          // this.addMemberResult = "";
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("addMemberModal")
          );
          modal.hide();

          // Reload group data
          // this.loadGroupDetail();
        }, 2500);
      } catch (error) {
        console.error("Error adding members:", error);
        this.addMemberResult = "Failed to add members: " + error.message;
        this.addMemberResultClass = "alert-danger";
      } finally {
        this.addingMembers = false;
      }
    },

    getYourShareText(share) {
      if (share > 0) return `you lent ₹${share}`;
      if (share < 0) return `you owe ₹${Math.abs(share)}`;
      return "settled";
    },
    getShareClass(share) {
      if (share > 0) return "text-success";
      if (share < 0) return "text-danger";
      return "text-muted";
    },

    goBack() {
      this.$router.push("/groups");
    },

    editGroup() {
      // Navigate to edit group page
      this.$router.push(`/groups/${this.groupId}/edit`);
    },

    addExpense() {
      // Navigate to add expense page
      this.$router.push(`/groups/${this.groupId}/add-expense`);
    },

    viewExpense(expenseId) {
      // Navigate to expense detail page
      this.$router.push(`/expenses/${expenseId}`);
    },
  },

  async mounted() {
    await this.fetchGroupDetail();
  },
  watch: {
    // Watch for changes to the groupId computed property
    groupId(newId) {
      this.fetchGroupDetail(newId);
    },
  },
};
