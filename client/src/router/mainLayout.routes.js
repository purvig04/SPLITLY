import MainLayout from "@/layouts/MainLayout.vue";
import HomePage from "../views/Home/HomePage.vue";

export default {
    path: "/home",
    component: MainLayout,
    children: [
      { name: "Home", path: "/home", component: HomePage },
    //   { name: "Friends", path: "/groups", component: FriendsPage },
    //   { name: "Groups", path: "/friends", component: GroupsPage },
    ],
}