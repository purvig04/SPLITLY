import { createWebHistory, createRouter } from "vue-router";
import RegisterPage from "../views/Register/RegisterPage.vue";
import LoginPage from "../views/Login/LoginPage.vue";
import LandingPage from "../views/Landing/LandingPage.vue";
import MainLayoutRoutes from "@/router/mainLayout.routes";

const routes = [
  { name: "Register", path: "/register", component: RegisterPage },
  { name: "Login", path: "/login", component: LoginPage },
  { name: "Landing", path: "/", component: LandingPage },
  MainLayoutRoutes,
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
