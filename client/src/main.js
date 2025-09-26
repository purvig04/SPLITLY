import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import apolloClient from "./apollo";
import { DefaultApolloClient } from "@vue/apollo-composable/dist";

createApp(App).provide(DefaultApolloClient, apolloClient).use(router).mount("#app");
