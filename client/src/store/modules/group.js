import { groupService } from "@/services/groups.service";

const state = () => ({
  groups: [],
  loading: false,
});
const mutations = {
  SET_GROUPS(state, g) {
    state.groups = g;
  },
  SET_LOADING(state, val) {
    state.loading = val;
  },
};
const actions = {
  async fetchGroups({ commit }, type) {
    commit("SET_LOADING", true);
    try {
      const groups = await groupService.getGroups(type);

      console.log("group in fethcgroup in store", groups);

      commit("SET_GROUPS", Array.isArray(groups) ? [...groups] : []);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createGroup({ dispatch }, payload) {
    try {
      const {title, type} = payload
      const created = await groupService.createGroup(title, type);
      console.log("Created Group: ", created);
      await dispatch("fetchGroups", type);
    } catch (e) {
      console.log("failed to create group", e);
    }
  },
};
const getters = {
  isLoading: (state) => state.loading,
  getGroups: (state) => state.groups,
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
