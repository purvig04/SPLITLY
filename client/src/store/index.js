import { createStore } from "vuex";
import auth from "./modules/auth"; 
import group from "./modules/group";
import friends from "./modules/friends";
import chats from "./modules/chats";

const store = createStore({
  modules: {
    auth,
    group,
    friends,
    chats
  },
});
export default store;