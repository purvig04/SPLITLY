import { mapGetters, mapActions } from "vuex";

export default {
  name: "GroupPage",
  data() {
    return {
      newGroupTitle: "",
      showModal: false,
    };
  },
  computed: {
    ...mapGetters("group", ["getGroups", "isLoading"]),
    groups() {
      return this.getGroups;
    },
  },
  methods: {
    ...mapActions("group", ["fetchGroups", "createGroup"]),
    async handleCreateGroup() {
      await this.createGroup({ title: this.newGroupTitle , type: "GROUP"});
      this.closeModal()
    },
    closeModal() {
      this.showModal = false
      this.newGroupTitle = ""; // Reset input
    }
  },
  async created() {
    await this.$store.dispatch("group/fetchGroups", "GROUP");
  },
};
