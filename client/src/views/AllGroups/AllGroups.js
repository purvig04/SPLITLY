import { mapGetters, mapActions } from "vuex";
import * as bootstrap from "bootstrap";

export default {
  name: "AllGroups",
  computed: {
    ...mapGetters("group", ["getGroups", "isLoading"]),
    groups() {
      return this.getGroups;
    },
  },
  data() {
    return {
      newGroupTitle: "",
    };
  },
  methods: {
    ...mapActions("group", ["fetchGroups", "createGroup"]),
    async handleCreateGroup() {
      await this.createGroup({ title: this.newGroupTitle }, "GROUP");
      // Close modal
      const modalEl = document.getElementById("createGroupModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      this.newGroupTitle = ""; // Reset input
    },
    goToGroup(id) {
      this.$router.push(`/group/${id}`);
    },
    goBack(){
      this.$router.push('/home')
    }
  },
  async created() {
    await this.$store.dispatch("group/fetchGroups", "GROUP");
  },
};
