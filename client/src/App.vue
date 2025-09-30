<template>
  <NavBar />
  <!-- <SideBar /> -->
  <router-view></router-view>
</template>

<script>
import NavBar from './views/NavBar/NavBar.vue'
// import SideBar from './views/SideBar/SideBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    // SideBar
  }
}
</script>

<style src="./assets/styles/global.css" />
