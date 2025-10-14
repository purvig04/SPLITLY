<template>
  <div class="main">
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Groups</h2>
        <button class="btn btn-primary" @click="showModal = true">
          Create Group
        </button>
      </div>
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading groups...</p>
      </div>
      <!-- Groups List -->
      <div v-else>
        <div
          class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
          v-if="groups.length"
        >
          <div class="col" v-for="group in groups" :key="group.id">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">{{ group.title }}</h5>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="text-muted text-center mt-4">No groups found yet.</p>
      </div>
      <!-- Create Group Modal -->
      <div
        v-if="showModal"
        class="modal fade show"
        tabindex="-1"
        style="display: block; background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="handleCreateGroup">
              <div class="modal-header">
                <h5 class="modal-title" id="createGroupModalLabel">
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
                  class="btn btn-secondary"
                  @click="closeModal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Group.js" />
<style src="./Group.css" scoped />
