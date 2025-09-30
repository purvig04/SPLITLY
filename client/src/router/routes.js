import { createWebHistory, createRouter } from "vue-router";
import RegisterPage from "../views/Register/RegisterPage.vue";
import LoginPage from "../views/Login/LoginPage.vue";
import HomePage from "../views/Home/HomePage.vue";
import LandingPage from "../views/Landing/LandingPage.vue";

const routes = [
  { name: "Register", path: "/register", component: RegisterPage },
  { name: "Login", path: "/login", component: LoginPage },
  { name: "Home", path: "/home", component: HomePage },
  { name: "Landing", path: "/", component: LandingPage },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
