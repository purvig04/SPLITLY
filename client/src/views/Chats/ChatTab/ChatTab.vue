<template>
    <div class="messages-container" ref="messagesContainer">
      <div v-if="!chats?.length" class="empty-state">
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
          :class="{
            'message-sent': message.sentByYou,
            'message-received': !message.sentByYou,
          }"
        >
          <div class="message-bubble">
            <p class="message-text">{{ message.chatMessage }}</p>
            <span class="message-time">
              {{ formatDate(parseInt(message.createdAt)) }}
              {{ formatTime(parseInt(message.createdAt)) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-anchor" ref="bottomAnchor"></div>
    <div class="message-input-container">
      <input
        v-model="newMessage"
        type="text"
        class="message-input"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
      />
      <button
        class="btn-send"
        @click="sendMessage"
        :disabled="!newMessage.trim()"
      >
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
</template>

<script src="./ChatTab.js" />
<style src="./ChatTab.css" scoped />
