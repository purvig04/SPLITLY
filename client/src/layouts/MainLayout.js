import SideBar from "../views/SideBar/SideBar.vue";
import { sidebarState } from "@/store/sidebarStore.js";

export default {
  name: "MainLayout",
  setup() {
    return {
      sidebarState,
    };
  },
  components: {
    SideBar,
  },
};
