<template>
    <h2>Landing Page</h2>
    <button @click="addExpense">Add expenses</button>
  </template>
  
  <script>
  export default {
    name: "LandingPage",
    methods:{
        addExpense(){
            this.$router.push('/register')
        }
    }
  };
  </script>
  