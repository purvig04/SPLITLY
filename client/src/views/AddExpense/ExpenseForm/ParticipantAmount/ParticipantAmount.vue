<template>
  <div class="participant-amount-container">
    <!-- Equal Split -->
    <div v-if="splitMethod === 'equal'" class="amount-display">
      <span v-if="isExcluded" class="excluded-text">Not included</span>
      <span v-else>₹{{ formatAmount(amount) }}</span>
    </div>

    <!-- Unequal Split -->
    <div v-else-if="splitMethod === 'unequal'" class="amount-input-wrapper">
      <span class="currency-prefix">₹</span>
      <input
        :value="displayValue"
        type="number"
        step="0.01"
        class="amount-input"
        @focus="handleFocus"
        @input="handleInput"
        @blur="handleBlur"
        placeholder="0.00"
      />
    </div>

    <!-- Percentage Split -->
    <div v-else-if="splitMethod === 'percentage'" class="percentage-container">
      <div class="percentage-input-wrapper">
        <input
          :value="displayValue"
          type="number"
          min="0"
          max="100"
          step="0.01"
          class="amount-input"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleUpdate($event.target.value)"
          placeholder="0.00"
        />
        <span class="percentage-symbol">%</span>
      </div>
      <div class="calculated-amount">
        ₹{{ formatAmount(calculatePercentageAmount) }}
      </div>
    </div>

    <!-- Shares Split -->
    <div v-else-if="splitMethod === 'shares'" class="shares-container">
      <div class="shares-control">
        <button class="share-btn" @click="decrementShare" type="button">
          −
        </button>
        <input
          :value="Math.round(amount) || 1"
          type="number"
          min="1"
          class="share-input"
          @input="handleUpdate($event.target.value)"
        />
        <button class="share-btn" @click="incrementShare" type="button">
          +
        </button>
      </div>
      <div class="calculated-amount">
        ₹{{ formatAmount(calculateShareAmount) }}
      </div>
    </div>
  </div>
</template>

<script src="./ParticipantAmount.js"></script>
<style src="./ParticipantAmount.css"></style>