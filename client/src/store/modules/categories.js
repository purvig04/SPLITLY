import { fetchCategories } from "@/services/categories.service";

const state = () => ({
  categories: [],
  loading: false,
});

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
};

const actions = {
  async loadCategories({ commit }) {
    commit("SET_LOADING", true);

    try {
      const categories = await fetchCategories();
      commit("SET_CATEGORIES", categories);
    } catch (error) {
      console.error("Error loading categories: ", error);
      commit("SET_CATEGORIES", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  getCategories: (state) => {
    return state.categories;
  },
  isLoading: (state) => state.loading,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
