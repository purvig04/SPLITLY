import { fetchFriends } from "@/services/friends.service";
import { groupService } from "@/services/groups.service";
import { getUserById } from "@/services/user.service";

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
      const friends = await fetchFriends();
      commit("SET_FRIENDS", friends);
    } catch (error) {
      console.error("Error loading friends: ", error);
      commit("SET_FRIENDS", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async createFriend(_, friendId) {
    try {
      const { name: friendName, email } = await getUserById(friendId);
      const { name } = await getUserById(sessionStorage.getItem("userId"));

      const title = `${name.split(" ")[0]}_${friendName.split(" ")[0]}`;
      const { createGroup } = await groupService.createGroup(title, "PERSONAL");
      const groupId = createGroup.id;

      await groupService.addMemberToGroup(groupId, [email]);

      return groupId
    } catch (error) {
      console.log("Error creating Friend", error);
    }
  },
};

const getters = {
  getFriends: (state) => state.friends,
  isLoading: (state) => state.loading,

  getFriendsByIds: (state) => (idArray) => {
    if (!idArray || idArray?.length === 0) return [];
    else {
      const selectedFriends = idArray.map((id) => {
        return state.friends.find((friend) => friend.id === id);
      });

      return selectedFriends;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
