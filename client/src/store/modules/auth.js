import { authService } from "@/services/auth.service";
const state = () => ({
  userLoggedIn: !!localStorage.getItem("userLoggedIn"),
  userId: localStorage.getItem("userId") || null,
  error: null,
});
const mutations = {
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_USER_LOGGED_IN(state, val) {
    state.userLoggedIn = val;
  },
  SET_USER_ID(state, id) {
    state.userId = id;
  },
  RESET_AUTH(state) {
    state.userLoggedIn = false;
    state.userId = null;
    state.error = null;
  },
};
const actions = {
  async login({ commit }, { email, password }) {
    commit("SET_ERROR", null);

    try {
      const data = await authService.login(email, password);
      const userId = data?.login?.user?.id;
      if (!userId) throw new Error("Invalid login response");

      commit("SET_USER_ID", userId);
      commit("SET_USER_LOGGED_IN", true);

      localStorage.setItem("userId", userId);
      localStorage.setItem("userLoggedIn", "true");

      return data;
    } catch (err) {
      commit("SET_ERROR", err);

      throw err;
    }
  },
  async register({ commit }, { name, email, password, contact }) {
    commit("SET_ERROR", null);
    try {
      const data = await authService.register(name, email, password, contact);

      return data;
    } catch (err) {
      commit("SET_ERROR", err);

      throw err;
    }
  },
  async logout({ commit }) {
    commit("SET_ERROR", null);

    try {
      try {
        await authService.logout();
      } catch (e) {
        console.warn("Backend logout failed:", e);
      }
      commit("RESET_AUTH");

      localStorage.removeItem("userId");
      localStorage.removeItem("userLoggedIn");
    } catch (err) {
      commit("SET_ERROR", err);

      throw err;
    }
  },
};
const getters = {
  isLoggedIn: (state) => state.userLoggedIn,
  getUserId: (state) => state.userId,
  getError: (state) => state.error,
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
