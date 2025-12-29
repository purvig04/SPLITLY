<template>
  <div class="shared-profile-overlay">
    <div class="shared-profile-container">
      <!-- Close -->
      <button class="close-btn" @click="closeModal">
        <i class="fas fa-times"></i>
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
      </div>

      <!-- Profile Content -->
      <template v-else-if="user">
        <!-- Avatar -->
        <div class="profile-avatar">
          <img v-if="profilePicUrl" :src="profilePicUrl" :alt="user.name" />
          <span v-else>{{ initials }}</span>
        </div>

        <!-- Details -->
        <div class="profile-details">
          <div class="profile-name">{{ user.name }}</div>
          <div class="profile-meta">{{ user.email }}</div>
          <div v-if="user.contact" class="profile-meta">
            {{ user.contact }}
          </div>
        </div>

        <!-- Spacer -->
        <!-- <div class="profile-content"></div> -->

        <!-- Add Friend -->
        <button v-if="!isFriend" class="add-friend-btn" @click="addFriend">
          <i class="fas fa-user-plus"></i>
        </button>
        <div v-else class="friend-status">
          <i class="fas fa-check-circle"></i>
          <span>Already Friends</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script src="./SharedProfile.js"></script>
<style scoped src="./SharedProfile.css"></style>
