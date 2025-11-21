import { mapGetters, mapActions } from "vuex";
import * as bootstrap from "bootstrap";

export default {
  name: "AllGroups",
  computed: {
    ...mapGetters("group", ["getGroups", "isLoading"]),
    groups() {
      return this.getGroups;
    },
    hasChatPanel() {
      return !!this.$route.params.id;
    },
  },
  data() {
    return {
      newGroupTitle: "",
      modalInstance: null,
    };
  },
  methods: {
    ...mapActions("group", ["fetchGroups", "createGroup"]),

    openModal() {
      const modalEl = document.getElementById("createGroupModal");
      this.modalInstance = new bootstrap.Modal(modalEl);
      this.modalInstance.show();
    },

    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }

      this.newGroupTitle = "";
    },
    async handleCreateGroup() {
      if (!this.newGroupTitle.trim()) {
        alert("Please enter a valid group name.");

        return;
      }

      await this.createGroup({ title: this.newGroupTitle }, "GROUP");
      // Close modal
      this.closeModal();
      this.fetchGroups("GROUP");
    },
    goToGroup(id) {
      this.$router.push({ name: "GroupChats", params: { id } });
    },
    goBack() {
      this.$router.push("/home");
    },
  },
  async created() {
    await this.fetchGroups("GROUP");
  },
};
