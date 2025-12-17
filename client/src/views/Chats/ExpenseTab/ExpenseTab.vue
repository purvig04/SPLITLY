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
    <div
      v-for="expense in expenses"
      :key="expense.id"
      class="expense-item"
      @click="openExpenseModal(expense.id)"
    >
      <div class="expense-icon">
        <i :class="expense.category.icon"></i>
      </div>
      <div class="expense-info">
        <h6 class="mb-1">{{ expense.title }}</h6>
        <span class="expense-date">{{ formatDate(expense.date) }}</span>
      </div>
      <div class="expense-amount-wrapper">
        <div class="expense-total-amount">
          <h6>₹{{ expense.totalAmount.toFixed(2) }}</h6>
        </div>
        <div class="expense-amount" :class="expense.type">
          <span v-if="expense.type === 'owed'">
            + ₹{{ expense.amount.toFixed(2) }}
          </span>
          <span v-else-if="expense.type === 'owe'"
            >- ₹{{ Math.abs(expense.amount).toFixed(2) }}
          </span>
          <span v-else>Not Involved</span>
        </div>
      </div>
    </div>
    <ExpenseDetail
      v-if="showExpenseModal"
      :expense="selectedExpense"
      @close="closeExpenseModal"
    />
  </div>
  <!-- Footer Actions -->
  <div class="panel-footer">
    <button
      class="btn btn-settle"
      @click="showSettleUpModal"
      title="Settle your balances"
    >
      <i class="fa-solid fa-handshake"></i> Settle Up
    </button>
    <PersonalSettlement
      v-if="isShowSettleUpModal"
      :friendId="id"
      @close="closeSettleUpModal"
    />
    <button class="btn btn-add-expense" @click="goToAddExpense">
      <i class="fa-solid fa-plus"></i> Add Expense
    </button>
  </div>
</template>

<script src="./ExpenseTab.js" />
<style src="./ExpenseTab.css" scoped />
