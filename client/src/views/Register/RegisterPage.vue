<template>
  <div class="register">
    <form>
      <h3 class="heading">Continue to Splitly</h3>
      <GoogleLogin :callback="handleGoogleLogin" />
    </form>
  </div>
</template>
<script src="./Register.js" />
<style src="./Register.css" scoped />
