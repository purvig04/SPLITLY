<template>
  <NavBar />
  <router-view></router-view>
</template>

<script>
import NavBar from './views/NavBar/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style src="./assets/styles/global.css" />
