import { getChats, sendChat } from "@/services/chat.service";

const state = () => ({
  chats: [],
  loading: false,
});

const mutations = {
  SET_CHATS(state, chats) {
    state.chats = chats;
  },

  SET_LOADING(state, status) {
    state.loading = status;
  },
};

const actions = {
  async loadChats({ commit }, group_id) {
    commit("SET_LOADING", true);
    try {
      const chats = await getChats(group_id);
      chats.sort((a, b) => a.createdAt - b.createdAt);
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
      const chat = await sendChat(payload);
      console.log("Sent Chat:", chat);
      
      await dispatch("loadChats", payload.group_id);
    } catch (err) {
      console.log("An error occured:", err);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  getChats: (state) => state.chats,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
