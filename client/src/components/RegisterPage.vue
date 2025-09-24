<template>
  <div class="register">
    <form>
      <h2>Register Page</h2>

      <label for="name">Name:</label>
      <input type="text" id="name" v-model="name" />

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" />

      <label for="contact">Phone no.:</label>
      <input type="tel" id="contact" v-model="contact" />

      <button type="button" @click="register">Register</button>

      <p>
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      contact: "",
      // errors: {}
    };
  },
};
</script>
