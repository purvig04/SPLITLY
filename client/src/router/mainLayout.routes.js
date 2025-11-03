import MainLayout from "@/layouts/MainLayout.vue";
import HomePage from "../views/Home/HomePage.vue";

import FriendsPage from "@/views/Friends/FriendsPage.vue";
import ChatsPage from "@/views/Chats/ChatsPage.vue";
import AllGroups from "@/views/AllGroups/AllGroups.vue";
import GroupPage from "@/views/SingleGroup/GroupPage.vue";
import EditGroup from "@/views/EditGroup/EditGroup.vue";

export default {
  path: "/home",
  component: MainLayout,
  children: [
    { name: "Home", path: "/home", component: HomePage },

    {
      name: "Friends",
      path: "/friends",
      component: FriendsPage,
      children: [
        { name: "Chats", path: "chats/:friendId", component: ChatsPage },
      ],
    },
    { name: "Groups", path: "/groups", component: AllGroups },
    { name: "Group", path: "/group/:id", component: GroupPage, props: true },
    {
      name: "EditGroup",
      path: "/group/:id/edit",
      component: EditGroup,
      props: true,
    },
    //   { name: "Friends", path: "/friends", component: FriendsPage },
  ],
};
