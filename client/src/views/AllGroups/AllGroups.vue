<template>
  <div class="main">
    <div class="container my-4">
      <button
        class="btn btn-link text-muted p-0 mb-3"
        @click="goBack"
        title="Groups"
      >
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Groups</h2>
        <button @click="openModal" class="btn create-group-button">
          Create Group
        </button>
      </div>
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading groups...</p>
      </div>
      <!-- Groups List -->
      <div
        v-else-if="groups && groups.length"
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
      >
        <div
          class="col"
          v-for="group in groups"
          :key="group.id"
          @click="goToGroup(group.id)"
        >
          <div class="card h-100 shadow-sm border-0 rounded-3 group-card">
            <div class="card-body d-flex align-items-center gap-3">
              <!-- Group Icon -->
              <i class="bi bi-people-fill text fs-4"></i>
              <!-- Group Title -->
              <h5 class="card-title mb-0 text-dark fw-semibold">
                {{ group.title }}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-muted text-center mt-4">No groups found yet.</p>
      <!-- Create Group Modal -->
      <div
        class="modal fade"
        id="createGroupModal"
        tabindex="-1"
        aria-labelledby="createGroupModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="handleCreateGroup">
              <div class="modal-header">
                <h5 class="modal-title">
                  Create New Group
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  @click="closeModal"
                ></button>
              </div>
              <div class="modal-body">
                <input
                  type="text"
                  v-model="newGroupTitle"
                  class="form-control"
                  placeholder="Enter group title"
                  required
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn create-group-button close-button"
                  @click="closeModal"
                >
                  Close
                </button>
                <button type="submit" class="btn create-group-button">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./AllGroups.js" />
<style src="./AllGroups.css" scoped />
