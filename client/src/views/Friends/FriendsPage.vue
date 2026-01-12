<template>
  <div class="main" :class="{ 'has-chat-panel': hasChatPanel }">
    <div class="container">
      <!-- Top Row: Header Card -->
      <div class="row mb-4 g-4">
        <div class="col-12">
          <div class="card welcome-card">
            <div class="card-body text-center py-4 friends-header">
              <h2 class="mb-2">Friends</h2>
              <!-- <p class="text-muted">View balances with your friends</p> -->
              <div class="friends-actions">
                <button
                  class="add-friend-btn rounded-pill"
                  @click="openAddFriendModal"
                >
                  <i class="fa-solid fa-user-plus"></i>
                  <span>Add Friend</span>
                </button>

                <button
                  class="add-expense-btn rounded-pill"
                  @click="goToAddExpense"
                >
                  <i class="fa-solid fa-plus"></i>
                  <span>Add Expense</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Friends List -->
      <div class="row g-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <div v-if="loading" class="text-center py-5">
                <p>Loading friends...</p>
              </div>
              <div v-else-if="friends?.length === 0" class="text-center py-5">
                <img
                  src="https://img.icons8.com/color/96/group.png"
                  alt="No Friends"
                  class="mb-3 opacity-50"
                />
                <p class="text-muted">
                  No friends yet. Start adding expenses to see your friends
                  here!
                </p>
              </div>
              <div v-else class="friends-list">
                <div
                  v-for="friend in friends"
                  :key="friend.id"
                  class="friend-item hover-card"
                  :class="{ 'active-friend': selectedFriendId === friend.id }"
                  @click="goToFriendChat(friend.id)"
                >
                  <div class="friend-info">
                    <div class="friend-avatar">
                      <div v-if="friend.profilePic">
                        <img :src="profileUrl(friend)" alt="Profile" />
                      </div>
                      <div v-else>
                        {{ getInitials(friend.name) }}
                      </div>
                    </div>
                    <div class="friend-name">
                      <h5 class="mb-0">{{ friend.name }}</h5>
                    </div>
                  </div>
                  <div class="friend-balances">
                    <div v-if="friend.owedToYou > 0" class="balance-item owed">
                      <span class="balance-label">owes you</span>
                      <span class="balance-amount"
                        >₹{{ friend.owedToYou.toFixed(2) }}</span
                      >
                    </div>
                    <div v-if="friend.youOwe > 0" class="balance-item owe">
                      <span class="balance-label">you owe</span>
                      <span class="balance-amount"
                        >₹{{ friend.youOwe.toFixed(2) }}</span
                      >
                    </div>
                    <div
                      v-if="friend.owedToYou === 0 && friend.youOwe === 0"
                      class="balance-item settled"
                    >
                      <span class="balance-label">settled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Child Route View (Chats Panel) -->
    <router-view></router-view>
  </div>
</template>
<script src="./Friends.js" />
<style src="./Friends.css" scoped />
