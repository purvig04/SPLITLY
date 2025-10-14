import { mapGetters, mapActions } from "vuex";

export default {
  // name: FriendsPage,

  computed: {
    ...mapGetters("friends", ["getFriends", "isLoading"]),
    friends() {
      return this.getFriends;
    },
    loading() {
      return this.isLoading;                                      
    },
    selectedFriendId() {
      return this.$route.params.friendId
        ? parseInt(this.$route.params.friendId)
        : null;
    },
    hasChatPanel() {
      return !!this.$route.params.friendId;
    },
  },

  methods: {
    ...mapActions("friends", ["loadFriends"]),
    goToFriendDetail(friendId) {
      this.$router.push({ name: "Chats", params: { friendId } });
    },
    goToAddExpense() {
      //Logic
    },
    getInitials(name) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
  },

  async created() {
    await this.loadFriends();
  },
};
