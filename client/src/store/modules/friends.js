import { fetchPersonalGroups } from "@/services/friends.service";

const state = () => ({
  friends: [],
  loading: false,
});

const mutations = {
  SET_FRIENDS(state, friends) {
    state.friends = friends;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
};

const actions = {
  async loadFriends({ commit }) {
    commit("SET_LOADING", true);

    try {
      const friends = await fetchPersonalGroups();
      commit("SET_FRIENDS", friends);
    } catch (error) {
      console.error("Error loading friends: ", error);
      commit("SET_FRIENDS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  getFriends: (state) => state.friends,
  isLoading: (state) => state.loading,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
