<template>
  <div class="friend-detail-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="friend-info-header">
        <div class="friend-avatar-large">
          {{ getInitials(friend ? friend.name : "N A") }}
        </div>
        <div>
          <h4 class="mb-1">{{ friend?.name }}</h4>
          <div class="balance-summary">
            <span v-if="friend?.owedToYou > 0" class="text-success-custom">
              owes you ₹{{ friend?.owedToYou.toFixed(2) }}
            </span>
            <span v-else-if="friend?.youOwe > 0" class="text-danger-custom">
              you owe ₹{{ friend?.youOwe.toFixed(2) }}
            </span>
            <span v-else class="text-muted">settled up</span>
          </div>
        </div>
      </div>
      <button class="btn-close-panel" @click="closeDetail">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
    <!-- Tabs -->
    <div class="tabs-container">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'expenses' }"
        @click="activeTab = 'expenses'"
      >
        <i class="fa-solid fa-receipt"></i> Expenses
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'chats' }"
        @click="activeTab = 'chats'"
      >
        <i class="fa-solid fa-comment"></i> Chats
      </button>
    </div>
    <!-- Content Area -->
    <div class="panel-content">
      <!-- Expenses Tab -->
      <div v-if="activeTab === 'expenses'" class="expenses-tab">
        <div v-if="expenses.length === 0" class="empty-state">
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
          >
            <div class="expense-icon">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <div class="expense-info">
              <h6 class="mb-1">{{ expense.description }}</h6>
              <span class="expense-date">{{ formatDate(expense.date) }}</span>
            </div>
            <div class="expense-amount" :class="expense.type">
              <span v-if="expense.type === 'owed'">+₹{{ expense.amount.toFixed(2) }}</span>
              <span v-else>-₹{{ expense.amount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Chats Tab -->
      <div v-if="activeTab === 'chats'" class="chats-tab">
        <div class="messages-container" ref="messagesContainer">
          <div v-if="chats?.length === 0" class="empty-state">
            <img
              src="https://img.icons8.com/color/64/chat.png"
              alt="No Messages"
              class="mb-2 opacity-50"
            />
            <p class="text-muted">No messages yet</p>
          </div>
          <div v-else class="messages-list">
            <div
              v-for="message in chats"
              :key="message.id"
              class="message-item"
              :class="{ 'message-sent': message.sentByYou, 'message-received': !message.sentByYou }"
            >
              <div class="message-bubble">
                <p class="message-text">{{ message.chatMessage }}</p>
                <span class="message-time">{{ formatDate(parseInt(message.createdAt)) }} {{ formatTime(parseInt(message.createdAt)) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Message Input -->
        <div class="message-input-container">
          <input
            v-model="newMessage"
            type="text"
            class="message-input"
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
          />
          <button class="btn-send" @click="sendMessage" :disabled="!newMessage.trim()">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- Action Buttons -->
    <div class="panel-footer">
      <button class="btn btn-settle" @click="settleUp">
        <i class="fa-solid fa-handshake"></i> Settle Up
      </button>
      <button class="btn btn-add-expense" @click="addExpense">
        <i class="fa-solid fa-plus"></i> Add Expense
      </button>
    </div>
  </div>
</template>

import friends from '@/store/modules/friends.js';

<script src="./Chats.js" />
<style src="./Chats.css" scoped />