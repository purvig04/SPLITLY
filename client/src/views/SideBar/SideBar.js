import { sidebarState, toggleSidebar } from "@/store/sidebarStore.js";
import { mapGetters } from "vuex";

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
      if (path === "/home") {
        this.setActive("Home");
      } else if (path === "/friends") {
        this.setActive("Friends");
      } else if (path === "/groups") {
        this.setActive("Groups");
      } else {
        this.setActive("");
      }
    },
  },
};
