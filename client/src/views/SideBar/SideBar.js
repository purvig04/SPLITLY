import { sidebarState,toggleSidebar } from "@/store/sidebarStore";

export default {
  name: "SideBar",
  setup(){
    return {
      toggleSidebar,
      sidebarState
    }
  },
  
  data() {
    return {
      activeItem: 'Home',
    };
  },

  methods: {
    setActive(val) {
        this.activeItem = val
    },

  }
};