import { CLOUDINARY_BASE_URL } from "@/services/cloudinary.service";
import { getInitials } from "@/utils/stringHelpers";
import { getUserByShareCode } from "@/services/user.service";
import { groupService } from "@/services/groups.service";
import { mapActions } from "vuex";

export default {
  name: "SharedProfile",

  props: {
    shareCode: {
      type: String,
      required: true,
    },
  },

  emits: ["close", "add-friend"],

  data() {
    return {
      user: null,
      loading: true,
      error: null,
      isFriend: false,
    };
  },

  computed: {
    initials() {
      return getInitials(this.user?.name || "");
    },

    profilePicUrl() {
      if (!this.user?.profilePic) return null;

      return (
        CLOUDINARY_BASE_URL +
        "v" +
        this.user.profilePicVersion +
        "/" +
        this.user.profilePic
      );
    },
  },

  methods: {
    ...mapActions("friends", ["createFriend"]),

    async fetchUserDetail() {
      try {
        this.loading = true;
        this.error = null;
        this.user = await getUserByShareCode(this.shareCode);
        const groupId = await groupService.getPersonalGroupId(this.user?.id);
        if (groupId) {
          this.isFriend = true;
        }
      } catch (err) {
        this.error = err.message || "Failed to load user profile";
      } finally {
        this.loading = false;
      }
    },

    async addFriend() {
      const groupId = await this.createFriend(this.user.id);
      if (groupId) {
        this.isFriend = true;
      }
    },

    closeModal() {
      this.$router.push({ name: "ProfilePage" });
    },
  },

  async mounted() {
    await this.fetchUserDetail();
  },
};
