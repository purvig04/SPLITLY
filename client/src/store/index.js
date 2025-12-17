import { createStore } from "vuex";
import auth from "./modules/auth";
import group from "./modules/group";
import friends from "./modules/friends";
import chats from "./modules/chats";
import categories from "./modules/categories";
import expenses from "./modules/expenses";

const store = createStore({
  modules: {
    auth,
    group,
    friends,
    chats,
    categories,
    expenses,
  },
});
export default store;
