<template>
  <div class="register">
    <form>
      <h2>Register Page</h2>

      <label for="name">Name*</label>
      <input type="text" id="name" v-model="name" />
      <p v-if="errors.name" class="error">{{ errors.name }}</p>

      <label for="email">Email*</label>
      <input type="email" id="email" v-model="email" />
      <p v-if="errors.email" class="error">{{ errors.email }}</p>

      <label for="password">Password*</label>
      <input type="password" id="password" v-model="password" />
      <p v-if="errors.password" class="error">{{ errors.password }}</p>

      <label for="confPassword">Confirm Password:</label>
      <input type="password" id="confPassword" v-model="confPassword" />
      <p v-if="errors.confPassword" class="error">{{ errors.confPassword }}</p>

      <label for="contact">Phone no.:</label>
      <input type="tel" id="contact" v-model="contact" />
      <p v-if="errors.contact" class="error">{{ errors.contact }}</p>

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
      id
      email
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
      confPassword: "",
      contact: "",
      errors: {},
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      this.errors.name = !this.name
        ? "Name is required"
        : /\d/.test(this.name)
        ? "Name cannot contain numbers"
        : this.name.length > 25
        ? "Max 25 characters allowed"
        : "";

      this.errors.email = !this.email
        ? "Email is required"
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
        ? ""
        : "Enter valid email";

      this.errors.password = !this.password
        ? "Password is required"
        : /\s/.test(this.password)
        ? "Password cannot contain spaces"
        : "";

      this.errors.confPassword =
        this.confPassword === this.password ? "" : "Passwords do not match";

      this.errors.contact =
        this.contact === "" || /^\d{10}$/.test(this.contact)
          ? ""
          : "Contact must have exactly 10 digits";

      console.log(this.errors);

      const b= (Object.values(this.errors).every(err =>!err)) 
      return b;
    },
    async register() {
      console.log("in registeer functionnnnnnnnnn before validating");

      if (!this.validateForm()) {
        console.log("inside validating form");
        return;
      }
      console.log("in registeer functionnnnnnnnnn");

      try {
        const { data } = await this.registerMutation({
          name: this.name,
          email: this.email,
          password: this.password,
          contact: this.contact,
        });
        console.log(data);

        if (data && data.register && data.register.id) {
          console.log("Registration successful for user:", data.register.email);
          this.$router.push("/login");
        } else {
          console.error("Registration failed: Invalid response from server.");
        }
      } catch (error) {
        console.log("REgister failed from frontendddddd", error);
      }
    },
  },
};
</script>
