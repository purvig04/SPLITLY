import { CLOUDINARY_BASE_URL } from "@/services/cloudinary.service";
import { sidebarState, toggleSidebar } from "@/store/sidebarStore.js";
import { mapGetters } from "vuex";
import defaultUserImage from "@/assets/images/default-user-image.png";

export default {
  name: "SideBar",
  setup() {
    return {
      toggleSidebar,
      sidebarState,
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
    user() {
      return this.getUser;
    },

    profileUrl() {
      if (this.user && this.user.profilePic) {
        return `${CLOUDINARY_BASE_URL}v${this.user.profilePicVersion}/${this.user.profilePic}`;
      } else {
        return defaultUserImage;
      }
    },
  },

  data() {
    return {
      activeItem: "",
    };
  },

  watch: {
    $route(to) {
      this.updateActiveItem(to.path);
    },
  },

  mounted() {
    this.updateActiveItem(this.$route.path);
  },

  methods: {
    setActive(val) {
      this.activeItem = val;
    },
    updateActiveItem(path) {
      if (path.includes("/home")) {
        this.setActive("Home");
      } else if (path.includes("/friends")) {
        this.setActive("Friends");
      } else if (path.includes("/groups")) {
        this.setActive("Groups");
      } else {
        this.setActive("");
      }
    },
  },
};
