<template>
  <div class="login">
    <form>
      <h2>Login Page</h2>

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" />

      <button type="button" @click="login">Login</button>

      <p>
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const LOGIN_MUTATION = gql`
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      token
    }
  }
`;

export default {
  name: "LoginPage",
  setup() {
    const { mutate: loginMutation } = useMutation(LOGIN_MUTATION);
    return { loginMutation };
  },
  data() {
    return {
      email: "",
      password: "",
      // errors:{}
    };
  },
  methods: {
    async login() {
      try {
        await this.loginMutation({
          email: this.email,
          password: this.password,
        });
        console.log("Login sucessful");

        this.$router.push("/home");
      } catch (error) {
        console.log("Login failed from frontendddddd", error);
      }
    },
  },
};
</script>
