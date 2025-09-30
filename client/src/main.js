import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/routes";
import apolloClient from "./services/apollo";
import { DefaultApolloClient } from "@vue/apollo-composable/dist";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/js/all.min.js';


createApp(App).provide(DefaultApolloClient, apolloClient).use(router).mount("#app");
