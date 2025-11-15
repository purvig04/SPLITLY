import { mapGetters } from "vuex";

export default {
  name: "MemberSelection",

  props: {
    groupId: {
      type: String,
      required: true,
    },
    selectedMembers: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["update:selectedMembers"],

  data() {
    return {};
  },

  computed: {
    ...mapGetters("group", ["getGroupById"]),

    groupData() {
      const group = this.getGroupById(this.groupId);
      if (!group) return {};

      const members = [...group.members].sort((a, b) => {
        if (a.name === "You") return -1;
        if (b.name === "You") return 1;
        return 0;
      });
      return { ...group, members };
    },

    allSelected() {
      return (
        this.groupData.members.length > 0 &&
        this.selectedMembers.length === this.groupData.members.length - 1
      );
    },
  },

  methods: {
    isSelected(memberId) {
      if (memberId === sessionStorage.getItem("userId")) return true;
      return this.selectedMembers.some((m) => m.id === memberId);
    },

    toggleMember(memberId) {
      const member = this.groupData.members.find((m) => m.id === memberId);
      if (!member) return;

      const currentSelection = [...this.selectedMembers];
      const index = currentSelection.findIndex((m) => m.id === memberId);

      if (index > -1) {
        currentSelection.splice(index, 1);
      } else {
        currentSelection.push(member);
      }

      this.$emit("update:selectedMembers", currentSelection);
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.$emit("update:selectedMembers", []);
      } else {
        const filteredMembers = this.groupData.members.filter((member) => {
          return member.id !== sessionStorage.getItem("userId");
        });
        this.$emit("update:selectedMembers", filteredMembers);
      }
    },
  },

  watch: {
    groupData(newVal, oldVal) {
      console.log("gData new:::", newVal);
      console.log("gData old:::", oldVal);
    },
  },
};
