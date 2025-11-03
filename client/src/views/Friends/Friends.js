import { getInitials } from "@/utils/stringHelpers";
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
    goToFriendChat(friendId) {
      this.$router.push({ name: "Chats", params: { friendId } });
    },
    goToAddExpense() {
      //Logic
    },
    getInitial(name) {
      return getInitials(name);
    },
  },

  async created() {
    await this.loadFriends();
  },
};
