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
  async fetchGroups({ commit }) {
    commit("SET_LOADING", true);
    try {
      const { getGroups } = await groupService.getGroups();
      const grp = Object.values(getGroups);
      console.log("group in fethcgroup in store", grp);

      commit("SET_GROUPS", grp);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createGroup({dispatch},{title}){
    try{
        await groupService.createGroup(title);
        await dispatch("fetchGroups")
    }catch(e){
        console.log("failed to create group",e);
        
    }
  }
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
