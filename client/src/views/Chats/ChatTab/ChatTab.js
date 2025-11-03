import { mapActions, mapGetters } from "vuex";

export default {
  name: "ChatTab",
  data() {
    return {
      newMessage: "",
    };
  },

  computed: {
    ...mapGetters("chats", ["getChats"]),
    chats() {
      return this.getChats;
    },
  },

  props: ["groupId"],

  mounted() {
    this.scrollToBottom();
  },
  updated() {
    this.scrollToBottom();
  },

  methods: {
    ...mapActions("chats", ["sendChat"]),
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) container.scrollTop = container.scrollHeight;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      return `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
    },

    async sendMessage() {
      const text = this.newMessage.trim();
      console.log("Messageeee::: ",text);
      
      if (!text) return;
      const message = {
        group_id: this.groupId,
        chatMessage: this.newMessage,
      };
      console.log("Mesageeeeeee: ", message);
      
      await this.sendChat(message);
      this.newMessage = "";
      this.$nextTick(this.scrollToBottom);
    },
  },
};
