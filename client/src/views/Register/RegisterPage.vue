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
      <button type="button" @click="registerUser">Register</button>
      <p>
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </form>
  </div>
</template>
<script src="./Register.js" />
