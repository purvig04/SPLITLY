import { mapGetters, mapActions } from "vuex";
import { groupService } from "@/services/groups.service";
import { userService } from "@/services/user.service";
import { expenseService } from "@/services/expenses.service";
import ExpenseDetail from "../ExpenseDetailModal/ExpenseDetail.vue";
import GroupSettlement from "../Settlements/GroupSettlement/GroupSettlement.vue";
// import { checkAndSettleGroup } from "@/utils/settlements";
import {
  calculateUserBalanceList,
  computeSettlements,
} from "@/utils/settlements";
export default {
  name: "GroupPage",
  components: { ExpenseDetail, GroupSettlement },
  props: ["id"],
  data() {
    return {
      group: null,
      expenses: [],
      selectedExpense: null,
      showExpenseModal: false,
      isModalOpen: false, // Add Member Modal
      isShowMembersOpen: false, // Show Members Modal
      selectedFriends: [],
      emailInput: "",
      userExists: null,
      loadingExpenses: false,
      addingMembers: false,
      addMemberResult: "",
      addMemberResultClass: "",
      checkUserTimeout: null,
      isShowSettleUpModal: false,
      userBalances: [],
    };
  },

  computed: {
    ...mapGetters("group", ["getGroupById", "isLoading"]),
    ...mapGetters("friends", ["getFriends", "isLoading"]),
    ...mapGetters("auth", ["getUser"]),
    user() {
      return this.getUser;
    },
    friends() {
      return this.getFriends;
    },
    loading() {
      return this.isLoading;
    },
    groupId() {
      return this.$route.params.id;
    },
    suggestedFriends() {
      if (!this.friends || this.friends.length === 0) {
        console.log("no friends found");
        return;
      }
      if (
        !this.group ||
        !this.group.members ||
        this.group.members.length === 0
      ) {
        console.log("no members found");
        return;
      }
      const diff = this.friends
        .filter(
          (friend) =>
            !this.group.members.some((member) => member.user?.id === friend.id)
        )
        .map((friend) => ({
          id: friend.id,
          name: friend.name,
          email: friend.email,
        }));

      return diff;
    },

    topThreeBalances() {
      return this.userBalances.slice(0, 3);
    },
    remainingBalanceCount() {
      return Math.max(0, this.userBalances.length - 3);
    },
    isAllSettled() {
      return this.userBalances.length === 0;
    },
  },
  methods: {
    ...mapActions("friends", ["loadFriends"]),
    ...mapActions("group", ["addMembers", "fetchGroups"]),

    getUserNamesById(userId) {
      const member = this.group.members.find((m) => m.user.id === userId);
      if (member) {
        return member.user.name;
      }
      return "Unknown";
    },

    getPaidBySummary(expense) {
      const payers = expense.paid_by;
      if (!payers || payers.length === 0) {
        return "No payment info";
      }
      if (payers.length === 1) {
        const name = this.getUserNamesById(payers[0].userId);
        return `Paid by ${name} `;
      }
      return `Paid by ${payers.length} people`;
    },

    getAmountShared(expense) {
      try {
        const userId = this.user.id;
        const payer = expense.paid_by.find((p) => p.userId === userId);
        const sharer = expense.shared_amounts.find((s) => s.userId === userId);

        const payerAmount = Number(payer?.amount || 0);
        const sharerAmount = Number(sharer?.amount || 0);

        return payerAmount - sharerAmount;
      } catch (e) {
        console.error("user not found", e);
      }
    },

    async openExpenseModal(expenseId) {
      const { getExpenseById } = await expenseService.getExpenseById(expenseId);
      this.selectedExpense = getExpenseById;
      this.showExpenseModal = true;
    },
    closeExpenseModal() {
      this.selectedExpense = null;
      this.showExpenseModal = false;
    },

    async fetchGroupDetail() {
      try {
        const { getGroupDetails } = await groupService.getGroupDetails(
          this.groupId
        );
        this.group = getGroupDetails;
        await this.loadExpenses();
      } catch (error) {
        console.error("Error loading group:", error);
        this.$router.push("/groups");
      }
    },

    async refreshGroup() {
      await this.fetchGroupDetail();
    },
    async loadExpenses() {
      this.loadingExpenses = true;
      try {
        const { getExpensesByGroup } = await expenseService.getExpensesByGroup(
          this.groupId
        );

        this.expenses = getExpensesByGroup;
      } catch (error) {
        console.error("Error loading expenses:", error);
      } finally {
        this.loadingExpenses = false;
      }
    },

    async checkUserExists() {
      if (this.checkUserTimeout) clearTimeout(this.checkUserTimeout);
      if (!this.isValidEmail(this.emailInput)) {
        this.userExists = null;
        return;
      }
      this.checkUserTimeout = setTimeout(async () => {
        try {
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
      this.selectedFriends = this.selectedFriends.filter((e) => e !== email);
    },
    async handleAddMembers() {
      if (this.selectedFriends.length === 0) return;
      this.addingMembers = true;
      this.addMemberResult = "";
      try {
        const res = await groupService.addMemberToGroup(
          this.groupId,
          this.selectedFriends
        );
        const result = res.addMemberToGroup;
        let message = "";
        if (result.added?.length) {
          message += `✓ Added ${result.added.length} member(s). `;
          this.addMemberResultClass = "alert-success";
        }
        if (result.invited?.length) {
          message += `Sent ${result.invited.length} invite(s). `;
          this.addMemberResultClass = "alert-info";
        }
        if (result.alreadyMembers?.length) {
          message += ` ${result.alreadyMembers.length} already member(s).`;
          this.addMemberResultClass = "alert-warning";
        }
        this.addMemberResult = message;
        this.group = result.updatedGroup;
        setTimeout(() => {
          this.selectedFriends = [];
          this.addMemberResult = "";
          this.isModalOpen = false; // close modal
        }, 2000);
      } catch (error) {
        console.error("Error adding members:", error);
        this.addMemberResult = "Failed to add members: " + error.message;
        this.addMemberResultClass = "alert-danger";
      } finally {
        this.addingMembers = false;
      }
    },
    getYourShareText(expense) {
      const share = this.getAmountShared(expense);
      if (share > 0) return `you lent ₹${share.toFixed(2)}`;
      if (share < 0) return `you owe ₹${Math.abs(share).toFixed(2)}`;
      return "Not included";
    },
    getShareClass(expense) {
      const share = this.getAmountShared(expense);
      if (share > 0) return "text-success";
      if (share < 0) return "text-danger";
      return "text-muted";
    },
    goBack() {
      this.$router.push("/groups");
    },
    editGroup() {
      this.$router.push(`/group/${this.groupId}/edit`);
    },
    goToAddExpense() {
      this.$router.push({
        name: "AddExpense",
        query: { source: "group", groupId: this.id },
      });
    },
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
      if (this.isModalOpen === false) {
        this.selectedFriends = [];
      }
    },
    openShowMembers() {
      this.isShowMembersOpen = true;
    },
    closeShowMembers() {
      this.isShowMembersOpen = false;
    },
    showSettleUpModal() {
      this.isShowSettleUpModal = true;
    },
    closeSettleUpModal() {
      this.isShowSettleUpModal = false;
    },
    async fetchData() {
      await this.fetchGroupDetail();
      if (!this.user) {
        await this.$store.dispatch("auth/fetchUser");
      }
      this.userBalances = await calculateUserBalanceList(
        this.user.id,
        this.group.id
      );
    },
    async handleSettlement(payload) {
      await this.fetchData();
      console.log("payload from group js", payload);
    },
  },
  async created() {
    await this.loadFriends();
  },
  async mounted() {
    await this.fetchData();
    await computeSettlements(this.group.id);
    await this.fetchGroups("GROUP");
  },
  // async updated(){
  //   await this.fetchGroups("GROUP");

  // },
  watch: {
    groupId(newId) {
      this.fetchGroupDetail(newId);
    },
  },
};
