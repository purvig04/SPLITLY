<template>
  <div class="friend-detail-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="friend-info-header">
        <div class="avatar-large" @click="goToDetails">
          {{ getInitial(friend ? friend.name : group ? group.title : "N A") }}
        </div>
        <div>
          <h4 class="mb-1">
            {{ friend ? friend.name : group ? group.title : "N A" }}
          </h4>
          <div class="balance-summary">
            <span v-if="friend?.owedToYou > 0" class="text-success-custom">
              you are owed ₹{{ friend?.owedToYou.toFixed(2) }}
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
    <!-- Tab Content -->
    <div class="panel-content">
      <ExpenseTab
        v-if="activeTab === 'expenses'"
        :friendId="id"
        :page="group ? 'groups' : 'friends'"
      />
      <ChatTab v-else :id="id" :page="group ? 'groups' : 'friends'" />
    </div>
  </div>
</template>

import group from '@/store/modules/group.js'; import group from
'@/store/modules/group.js';

<script src="./Chats.js" />
<style src="./Chats.css" scoped />
