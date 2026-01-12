import { CLOUDINARY_BASE_URL } from "@/services/cloudinary.service";
import { getInitials } from "@/utils/stringHelpers";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FriendsPage",

  data() {
    return {
      friendShareCode: "SPLIT-YAM-82470-C",
    };
  },

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
      return !!this.$route.params.id;
    },
  },

  methods: {
    ...mapActions("friends", ["loadFriends"]),
    goToFriendChat(friendId) {
      this.$router.push({ name: "Chats", params: { id: friendId } });
    },
    goToAddExpense() {
      this.$router.push({ name: "AddExpense", query: { source: "friends" } });
    },
    getInitials,
    profileUrl(friend) {
      if (friend.profilePic) {
        return `${CLOUDINARY_BASE_URL}v${friend.profilePicVersion}/${friend.profilePic}`;
      }
    },

    openAddFriendModal() {
      this.$router.push({
        name: "AddFriend",
      });
    },
  },

  async created() {
    await this.loadFriends();
    // console.log("Friend:", this.friends);
  },

  // async updated() {
  //   if (this.friends) {
  //     this.friends.map();
  //   }
  // },
};
