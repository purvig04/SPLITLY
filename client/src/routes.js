import { createWebHistory, createRouter } from "vue-router";
import RegisterPage from "./components/RegisterPage.vue";
import LoginPage from "./components/LoginPage.vue";
import HomePage from "./components/HomePage.vue";
import LandingPage from "./components/LandingPage.vue";

const routes = [
  { name: "Register", path: "/register", component: RegisterPage },
  { name: "Login", path: "/login", component: LoginPage },
  { name: "Home", path: "/home", component: HomePage },
  { name: "Landing", path: "/landing", component: LandingPage },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
