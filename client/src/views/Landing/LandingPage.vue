<template>
  <div class="main">
  <!-- Full-page container that centers its content -->
  <div class="d-flex align-items-center justify-content-center vh-100 p-3">
    <!-- Landing Section -->
    <section id="landing" class="landing-section">
      <div class="container">
        <div class="row align-items-center">
          <!-- Left Content: Headline + CTA -->
          <div class="col-md-6 intros text-white mb-4 mb-md-0">
            <h1 class="landing-title mb-4">
              <span>Expenses made simple.</span><br />
              <small class="landing-subtitle">
                Say goodbye to confusion and awkward money talks.The app makes expense sharing transparent,fair and hassle free-perfect for friends,family or colleagues. 
              </small>
            </h1>
            <button type="button" class="btn btn-lg rounded-pill landing-btn" @click="addExpense">
              Add Expenses <span><i class="fa-solid fa-plus"></i></span>
            </button>
          </div>
          <!-- Right Content: Illustration -->
          <div class="col-md-6 text-center text-md-end">
            <img
              src="../../assets/images/illustrations/landing_payment_illustartion.svg"
              alt="payment illustration"
              class="img-fluid landing-illustration"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</div>
</template>


<script src="./Landing.js" />
<style src="./Landing.css" scoped />
