import {
  getChats,
  sendChat,
  subscribeToMessage,
} from "@/services/chat.service";

const state = () => ({
  chats: [],
  loading: false,
  subscription: null,
});

const mutations = {
  SET_CHATS(state, chats) {
    state.chats = chats;
  },

  ADD_CHAT(state, chat) {
    state.chats.push(chat);
  },

  SET_LOADING(state, status) {
    state.loading = status;
  },

  SET_SUBSCRIPTION(state, sub) {
    state.subscription = sub;
  },

  CLEAR_SUBSCRIPTION(state) {
    state.subscription = null;
  },
};

const actions = {
  async loadChats({ commit }, group_id) {
    commit("SET_LOADING", true);
    try {
      const chats = await getChats(group_id);
      // chats.sort((a, b) => a.createdAt - b.createdAt);
      commit("SET_CHATS", chats);
    } catch (err) {
      console.log("An error occured:", err);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async sendChat({ commit, dispatch }, payload) {
    commit("SET_LOADING", true);
    try {
      await sendChat(payload);
      // console.log("Sent Chat:", chat);
      await dispatch("loadChats", payload.group_id);
    } catch (err) {
      console.log("An error occured:", err);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  subscribeToChats({ commit, state }, group_id) {
    if (state.subscription) return;

    const subscription = subscribeToMessage(group_id, (newMessage) => {
      commit("ADD_CHAT", {
        ...newMessage,
        sentByYou:
          newMessage.senderId === sessionStorage.getItem("userId")
            ? true
            : false,
      });
    });

    commit("SET_SUBSCRIPTION", subscription);
  },

  stopSubscription({ state, commit }) {
    if (state.subscription) {
      state.subscription.unsubscribe();
      commit("CLEAR_SUBSCRIPTION");
    }
  },
};

const getters = {
  getChats: (state) => state.chats,
  getSubscription: (state) => state.subscription,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
