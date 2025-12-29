import { createWebHistory, createRouter } from "vue-router";
import RegisterPage from "../views/Register/RegisterPage.vue";
import LoginPage from "../views/Login/LoginPage.vue";
import LandingPage from "../views/Landing/LandingPage.vue";
import MainLayoutRoutes from "@/router/mainLayout.routes";
import store from "@/store";

const routes = [
  { name: "Register", path: "/register", component: RegisterPage },
  { name: "Login", path: "/login", component: LoginPage },
  { name: "Landing", path: "/", component: LandingPage },
  MainLayoutRoutes,
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to, from, next) => {
  const auth = store.state.auth;

  if (!auth.checked) {
    await store.dispatch("auth/fetchUser");
  }

  const isPublic =
    to.name === "Login" || to.name === "Register" || to.name === "Landing";

  if (!auth.user && !isPublic) {
    return next({ name: "Login" });
  }

  if (auth.user && isPublic) {
    return next({ name: "Home" });
  }

  next();
});

export default router;
