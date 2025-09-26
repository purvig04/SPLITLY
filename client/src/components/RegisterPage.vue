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
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const REGISTER_MUTATION = gql`
  mutation Register(
    $password: String!
    $email: String!
    $contact: String!
    $name: String!
  ) {
    register(
      password: $password
      email: $email
      contact: $contact
      name: $name
    ) {
      token
    }
  }
`;

export default {
  name: "RegisterPage",
  setup() {
    const { mutate: registerMutation } = useMutation(REGISTER_MUTATION);
    return { registerMutation };
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      contact: "",
      // errors: {}
    };
  },
  methods: {
    async register() {
      try {
        await this.registerMutation({
          name: this.name,
          email: this.email,
          password: this.password,
          contact: this.contact,
        });
        console.log("Registration sucessful");

        this.$router.push("/login");
      } catch (error) {
        console.log("REgister failed from frontendddddd",error);
      }
    },
  },
};
</script>
