<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

    <div class="d-flex flex-column flex-shrink-0 pt-3 sidebar" :class="{ collapsed: isCollapsed }">
        <ul class="nav flex-column mb-auto">
            <li class="nav-item sidebar-icon" @click="toggleSidebar()">
                <i :class="isCollapsed ? 'bi bi-layout-sidebar' : 'bi bi-layout-sidebar-inset'"></i><span
                    class="nav-text">&nbsp; Close</span>
            </li>
            <li class="nav-item">
                <router-link to="/home" :class="{ active: activeItem === 'Home' }" @click="setActive('Home')">
                    <i class="fa-solid fa-house"></i><span class="nav-text">&nbsp; Home</span>
                </router-link>
            </li>
            <li>
                <router-link to="#" :class="{ active: activeItem === 'Friends' }" @click="setActive('Friends')">
                    <i class="fa-solid fa-user-group"></i><span class="nav-text">&nbsp; Friends</span>
                </router-link>
            </li>
            <li>
                <router-link to="#" :class="{ active: activeItem === 'Groups' }" @click="setActive('Groups')">
                    <i class="fa-solid fa-people-group"></i><span class="nav-text">&nbsp; Groups</span>
                </router-link>
            </li>
        </ul>
        <div class="profile">
            <router-link to="#" class="d-flex align-items-center link-dark text-decoration-none" aria-expanded="false">
                <img src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="" width="32" height="32"
                    class="rounded-circle me-2">
                <strong>User</strong>
            </router-link>
        </div>
    </div>

</template>

<script src="./SideBar.js" />
<style src="./SideBar.css" scoped />