<template>
  <div class="main-layout">
    <SideBar/>
    <div v-if="sidebarState" :class="sidebarState.isCollapsed?'content':'expanded'"><router-view /></div>
  </div>
</template>

<script src="./MainLayout.js" />
<style src="./MainLayout.css" scoped />


