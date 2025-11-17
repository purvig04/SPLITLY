<template>
  <div v-if="!expenses.length" class="empty-state">
    <img
      src="https://img.icons8.com/color/64/receipt.png"
      alt="No Expenses"
      class="mb-2 opacity-50"
    />
    <p class="text-muted">No expenses yet</p>
  </div>
  <div v-else class="expenses-list">
    <div v-for="expense in expenses" :key="expense.id" class="expense-item">
      <div class="expense-icon">
        <i class="fa-solid fa-receipt"></i>
      </div>
      <div class="expense-info">
        <h6 class="mb-1">{{ expense.description }}</h6>
        <span class="expense-date">{{ formatDate(expense.date) }}</span>
      </div>
      <div class="expense-amount" :class="expense.type">
        <span v-if="expense.type === 'owed'">
          +₹{{ expense.amount.toFixed(2) }}
        </span>
        <span v-else> -₹{{ expense.amount.toFixed(2) }} </span>
      </div>
    </div>
  </div>
  <!-- Footer Actions -->
    <div class="panel-footer">
      <button class="btn btn-settle" @click="settleUp">
        <i class="fa-solid fa-handshake"></i> Settle Up
      </button>
      <button class="btn btn-add-expense" @click="goToAddExpense">
        <i class="fa-solid fa-plus"></i> Add Expense
      </button>
    </div>
</template>

<script src="./ExpenseTab.js" />
<style src="./ExpenseTab.css" scoped />
