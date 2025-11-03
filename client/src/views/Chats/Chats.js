import { mapActions, mapGetters } from "vuex";
import ChatTab from "./ChatTab/ChatTab.vue";
import ExpenseTab from "./ExpenseTab/ExpenseTab.vue";
import { getInitials } from "@/utils/stringHelpers";
export default {
  name: "ChatsPage",

  components: {
    ChatTab,
    ExpenseTab,
  },

  data() {
    return {
      activeTab: "expenses",
      friend: null,
      loading: false,
      friendId: null,
    };
  },
  computed: {
    ...mapGetters("friends", ["getFriends"]),
    friendsData() {
      return this.getFriends;
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
    ...mapActions("chats", ["loadChats"]),
    setFriendId(id) {
      this.friendId = id;
    },
    async loadFriendData() {
      this.setLoading(true);
      try {
        const friend = this.friendsData.find((f) => f.id === this.friendId);
        this.friend = friend ? { ...friend } : null;
        if (this.friend && this.friend.groupId) {
          await this.loadChats(this.friend.groupId);
        }
      } catch (error) {
        console.error("Error loading friend data:", error);
      } finally {
        this.setLoading(false);
      }
    },
    setLoading(state) {
      this.loading = state;
    },
    closeDetail() {
      this.$router.push({ name: "Friends" });
    },
    getInitial(name) {
      return getInitials(name);
    },
  },
};
