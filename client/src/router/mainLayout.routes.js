import MainLayout from "@/layouts/MainLayout.vue";
import HomePage from "../views/Home/HomePage.vue";
import GroupPage from "@/views/Groups/GroupPage.vue";

export default {
  path: "/home",
  component: MainLayout,
  children: [
    { name: "Home", path: "/home", component: HomePage },
    { name: "Groups", path: "/groups", component: GroupPage },
    //   { name: "Friends", path: "/friends", component: FriendsPage },
  ],
};