import { mapActions, mapGetters } from "vuex";

export default {
  name: "ChatTab",
  props: ["groupId"],

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

  watch: {
    chats: {
      handler() {
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollToBottom({ smooth: true });
            // console.log("watch timeout");
          }, 1);
        });
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions("chats", [
      "loadChats",
      "sendChat",
      "subscribeToChats",
      "stopSubscription",
    ]),

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

      if (!text) return;
      const message = {
        group_id: this.groupId,
        chatMessage: this.newMessage,
      };

      await this.sendChat(message);
      this.newMessage = "";

      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollToBottom({ smooth: true });
          // console.log("sendmessage timeout");
        }, 30);
      });
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const bottomAnchor = this.$refs.bottomAnchor;
        if (bottomAnchor) {
          bottomAnchor.scrollIntoView({ behavior: "smooth" }); // Smooth scrolling
        }
      });
    },
  },

  async mounted() {
    this._previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    await this.loadChats(this.groupId);

    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollToBottom({ instant: true });
        // console.log("mounted timeout");
      }, 30);
    });

    this.subscribeToChats(this.groupId);
  },

  beforeUnmount() {
    document.body.style.overflow = this._previousBodyOverflow || "";
    this.stopSubscription();
  },
};
