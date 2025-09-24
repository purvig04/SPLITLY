import { createWebHistory, createRouter } from "vue-router";
import RegisterPage from "./components/RegisterPage.vue";

const routes = [
  { name: "Register", path: "/register", component: RegisterPage },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
