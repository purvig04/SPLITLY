export default {
  name: "SideBar",
  data() {
    return {
      activeItem: 'Home',
      isCollapsed: true,
    };
  },

  methods: {
    setActive(val) {
        this.activeItem = val
    },

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed
    }
  }
};