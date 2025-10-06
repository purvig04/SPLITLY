import { sidebarState,toggleSidebar } from "@/store/sidebarStore";
import { mapGetters } from "vuex";

export default {
  name: "SideBar",
  setup(){
    return {
      toggleSidebar,
      sidebarState
    }
  },
   computed:{
      ...mapGetters('auth',['getUser']),
      user(){
        return this.getUser
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