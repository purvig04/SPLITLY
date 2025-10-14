import { createStore } from "vuex";
import auth from "./modules/auth"; 
import group from "./modules/group";
import friends from "./modules/friends";

const store = createStore({
  modules: {
    auth,
    group,
    friends
  },
});
export default store;