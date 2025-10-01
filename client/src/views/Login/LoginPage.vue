<template>
  <div class="login">
    <form>
      <h2>Login Page</h2>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" />
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" />
      <button type="button" @click="loginUser">Login</button>
      <p>
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </form>
  </div>
</template>
<script src="./Login.js" />
