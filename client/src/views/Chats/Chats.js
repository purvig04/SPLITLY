import { mapActions, mapGetters } from "vuex";

export default {
  name: "ChatsPage",
  data() {
    return {
      activeTab: "expenses",
      expenses: [],
      newMessage: "",
      friend: null,
      loading: false,
      friendId: null,
    };
  },

  computed: {
    ...mapGetters("friends", ["getFriends"]),
    ...mapGetters("chats", ["getChats"]),
    friendsData() {
      return this.getFriends;
    },
    chats() {
      return this.getChats;
    },
  },

  watch: {
    friendsData: {
      async handler(newVal) {
        if (newVal?.length && this.friendId) {
          await this.loadFriendData();
        }
      },
      deep: true,
    },

    "$route.params.friendId": {
      immediate: true,
      handler(newId) {
        this.setFriendId(newId);
      },
    },

    friendId: {
      immediate: true,
      async handler() {
        if (this.friendId) {
          await this.loadFriendData();
        }
      },
    },
  },

  methods: {
    ...mapActions("chats", ["loadChats", "sendChat"]),
    setFriendId(id) {
      this.friendId = id;
    },
    async loadFriendData() {
      this.setLoading(true);

      try {
        const friend = this.friendsData.find((f) => f.id === this.friendId);
        this.friend = friend ? { ...friend } : null;
        this.expenses = this.getMockExpenses();
        if (this.friend) await this.loadChats(this.friend.groupId);
        this.$nextTick(this.scrollToBottom);
      } catch (error) {
        console.error("Error loading friend data:", error);
      } finally {
        this.setLoading(false);
      }
    },
    setLoading(state) {
      this.loading = state;
    },
    // getDefaultFriend() {
    //   return {
    //     id: this.friendId,
    //     name: "Unknown",
    //     owedToYou: 0,
    //     youOwe: 0,
    //   };
    // },
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
    getInitials(name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      return `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
    },
    async sendMessage() {
      const text = this.newMessage.trim();
      if (!text) return;
      const message = {
        group_id: this.friend.groupId,
        chatMessage: this.newMessage,
      };
      await this.sendChat(message);
      this.newMessage = "";
      this.$nextTick(this.scrollToBottom);
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) container.scrollTop = container.scrollHeight;
    },
    closeDetail() {
      this.$router.push({ name: "Friends" });
    },
    settleUp() {
      console.log("Settle up with", this.friend?.name);
      // TODO: Implement settle up functionality
    },
    addExpense() {
      console.log("Add expense with", this.friend?.name);
      this.$router.push({
        name: "AddExpense",
        query: { friendId: this.friendId },
      });
    },
  },
};
