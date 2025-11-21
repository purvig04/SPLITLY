import {
  getChats,
  sendChat,
  subscribeToMessage,
} from "@/services/chat.service";
import { getFriendById } from "@/services/friends.service";

const state = () => ({
  chats: [],
  loading: false,
  subscription: null,
  groupId: null,
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

  SET_GROUP_ID(state, id) {
    state.groupId = id;
  },
};

const actions = {
  async loadChats({ commit, state, dispatch }, payload) {
    commit("SET_LOADING", true);
    try {
      await dispatch("setGroupId", payload);

      if (state.groupId) {
        const chats = await getChats(state.groupId);
        commit("SET_CHATS", chats);
      } else {
        commit("SET_CHATS", []);
      }
    } catch (err) {
      console.log("An error occured:", err);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async sendChat({ commit, dispatch, state }, payload) {
    commit("SET_LOADING", true);
    try {
      if (state.groupId) {
        await sendChat({
          group_id: state.groupId,
          chatMessage: payload.chatMessage,
        });
        await dispatch("loadChats", { id: payload.id, type: payload.type });
      } else {
        console.log("Not a friend");
      }
    } catch (err) {
      console.log("An error occured:", err);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async subscribeToChats({ commit, state }) {
    if (state.groupId) {
      if (state.subscription) return;

      const subscription = subscribeToMessage(state.groupId, (newMessage) => {
        commit("ADD_CHAT", {
          ...newMessage,
          sentByYou:
            newMessage.senderId === sessionStorage.getItem("userId")
              ? true
              : false,
        });
      });

      commit("SET_SUBSCRIPTION", subscription);
    }
  },

  stopSubscription({ state, commit }) {
    if (state.subscription) {
      state.subscription.unsubscribe();
      commit("CLEAR_SUBSCRIPTION");
    }
  },

  async setGroupId({ commit }, payload) {
    const { id, type } = payload;
    if (type === "friends") {
      const f = await getFriendById(id);
      if (f) {
        commit("SET_GROUP_ID", f.groupId);
      } else {
        commit("SET_GROUP_ID", null);
      }
    } else {
      commit("SET_GROUP_ID", id);
    }
  },
};

const getters = {
  getChats: (state) => {
    console.log("Chats store:", state.chats);
    return state.chats;
  },
  getSubscription: (state) => state.subscription,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
