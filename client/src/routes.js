import { createWebHistory, createRouter } from "vue-router";
import RegisterPage from "./components/RegisterPage.vue";
import LoginPage from "./components/LoginPage.vue";

const routes = [
  { name: "Register", path: "/register", component: RegisterPage },
  { name: "Login", path: "/login", component: LoginPage },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
