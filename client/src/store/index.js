import { createStore } from "vuex";
import auth from "./modules/auth"; 
import group from "./modules/group";

const store = createStore({
  modules: {
    auth,
    group
  },
});
export default store;