import apolloClient from "@/apollo";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
const state = () => ({
  userLoggedIn: !!localStorage.getItem("userLoggedIn"),
  userId: localStorage.getItem("userId") || null,
  user: null,
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
  SET_USER_DATA(state, user) {
    state.user = user;
  },
  RESET_AUTH(state) {
    state.userLoggedIn = false;
    state.userId = null;
    state.user = null;
    state.error = null;
  },
};
const actions = {
  async login({ commit }, { email, password }) {
    commit("SET_ERROR", null);

    try {
      const { user } = await authService.login(email, password);

      if (!user?.id) throw new Error("Invalid login response");

      commit("SET_USER_ID", user.id);
      commit("SET_USER_LOGGED_IN", true);
      commit("SET_USER_DATA", user); //after logging in user is fetched from here

      localStorage.setItem("userId", user.id);
      localStorage.setItem("userLoggedIn", "true");



      return user;
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

      localStorage.removeItem("userId");
      localStorage.removeItem("userLoggedIn");

      apolloClient.clearStore();
      commit("RESET_AUTH");
    } catch (err) {
      commit("SET_ERROR", err);

      throw err;
    }
  },
  async fetchUser({ commit, state }) {
    //when page refresh user is fetched from here
    try {
      const { getUser } = await userService.getUser();
      if (state.userId && getUser) {
        commit("SET_USER_DATA", getUser);
      }
    } catch (err) {
      commit("SET_ERROR", err);
      console.error("Failed to fetch user data:", err);
    }
  },
};
const getters = {
  isLoggedIn: (state) => state.userLoggedIn,
  getUserId: (state) => state.userId,
  getUser: (state) => state.user,
  getError: (state) => state.error,
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
