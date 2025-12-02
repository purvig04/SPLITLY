<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content ">
      <!-- Close button -->
       <div class="d-flex justify-content-end">
      <button
        type="button"
        class="btn-close "
        aria-label="Close"
        @click="$emit('close')"
      ></button></div>

      <!-- Main message -->
      <p class="fw-bold text-center fs-5 mb-2">
        {{
          selectedUser.type === "owe"
            ? `You are settling ₹${selectedUser.amount.toFixed(
                2
              )} you owe to ${getUserName(selectedUser.person)}`
            : `You are settling ₹${selectedUser.amount.toFixed(2)} ${getUserName(
                selectedUser.person
              )}  owe you`
        }}
      </p>

      <p class="text-muted text-center mb-3">
        Once confirmed, this balance will be marked as fully settled.
      </p>

      <!-- Buttons -->
      <div class="d-flex justify-content-center gap-3">
        <button class="btn btn-outline-secondary px-4" @click="$emit('close')">
          Cancel
        </button>
        <button
          class="btn btn-success px-4 fw-semibold"
          @click="confirmSettlement"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script src="./ConfirmSettlement.js" />
<style src="./ConfirmSettlement.css" scoped />
