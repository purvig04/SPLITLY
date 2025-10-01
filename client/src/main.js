import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/js/all.min.js";

import { createApp } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import apolloClient from "./apollo"; 
import App from "./App.vue";
import router from "./router/routes";
import store from "./store"; 

const app = createApp(App);

app
  .provide(DefaultApolloClient, apolloClient)
  .use(store)
  .use(router)
  .mount("#app");
