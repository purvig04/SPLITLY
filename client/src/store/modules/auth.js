import apolloClient from "@/apollo";
import { authService } from "@/services/auth.service";
import { updateUserDetails, userService } from "@/services/user.service";
const state = () => ({
  userLoggedIn: !!sessionStorage.getItem("userLoggedIn"),
  userId: sessionStorage.getItem("userId") || null,
  user: null,
  error: null,
  loading: false,
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
  SET_LOADING(state, val) {
    state.loading = val;
  },
};
const actions = {
  async login({ commit }, { email, password }) {
    commit("SET_ERROR", null);
    commit("SET_LOADING", true);
    try {
      const { user } = await authService.login(email, password);

      if (!user?.id) throw new Error("Invalid login response");

      commit("SET_USER_ID", user.id);
      commit("SET_USER_LOGGED_IN", true);
      commit("SET_USER_DATA", user); //after logging in user is fetched from here

      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("userLoggedIn", "true");

      return user;
    } catch (err) {
      commit("SET_ERROR", err);

      throw err;
    } finally {
      commit("SET_LOADING", false);
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

      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userLoggedIn");

      apolloClient.clearStore();
      commit("RESET_AUTH");
    } catch (err) {
      commit("SET_ERROR", err);

      throw err;
    }
  },
  async fetchUser({ commit, state }) {
    const authToken = sessionStorage.getItem("userLoggedIn");
    if (!authToken) {
      return; // Exit early if not authenticated
    }

    //when page refresh user is fetched from here
    try {
      const { getUser } = await userService.getUser();
      if (state.userId && getUser) {
        commit("SET_USER_DATA", getUser);
      }
      // console.log("User Store:", getUser);
    } catch (err) {
      commit("SET_ERROR", err);
      console.error("Failed to fetch user data:", err);
    }
  },

  async updateUserProfile({ dispatch /*getters*/ }, input) {
    try {
      // console.log("Store Input:", input);

      const user = await updateUserDetails(input);

      // console.log("User Details Updated:", user);
      // console.log("Before Fetch:", getters.getUser);

      await dispatch("fetchUser");
      // console.log("After Fetch:", getters.getUser);

      return user;
    } catch (error) {
      console.log("Updating user unsuccessful:", error);
      throw error;
    }
  },
};
const getters = {
  isLoggedIn: (state) => state.userLoggedIn,
  getUserId: (state) => state.userId,
  getUser: (state) => state.user,
  getError: (state) => state.error,
  isLoading: (state) => state.loading,
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
