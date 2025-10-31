  <template>
    <div class="main" :class="{ 'modal-open': isModalOpen || isShowMembersOpen }">
      <div class="container my-4">
        <div class="whole-section mt-4 pt-3 border-top">
          <!-- Group Header Card -->
          <div class="group-header-card">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="flex-grow-1">
                <!-- Back Button -->
                <button
                  class="btn btn-link text-muted p-0 mb-3"
                  @click="goBack"
                  title="Groups"
                >
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 class="mb-2">{{ group?.title }}</h2>
                <p class="text-muted mb-2" v-if="group?.description">
                  {{ group.description }}
                </p>
              </div>
              <!-- Action Buttons -->
              <div class="d-flex gap-2 align-items-center">
                <button
                  class="btn btn-action"
                  @click="isModalOpen = true"
                  title="Add Member"
                >
                  <i class="fa-solid fa-user-plus"></i>
                </button>
                <button
                  class="btn btn-action"
                  title="View Members"
                  @click="isShowMembersOpen = true"
                >
                  <i class="fa-solid fa-users"></i>
                  <span class="member-count">{{ group?.members.length }}</span>
                </button>
                <button class="btn btn-action" @click="editGroup" title="Edit Group">
                  <i class="fa-solid fa-edit"></i>
                </button>
              </div>
            </div>
            <!-- Balances Section -->
            <div class="balances-section mb-4">
              <div v-if="totalOwed > 0" class="text-success fw-bold">
                <div v-for="balance in owedToYou" :key="balance.userId">
                  <span>{{ balance.userName }} owes you ₹{{ balance.amount }}</span>
                </div>
              </div>
              <div v-if="totalYouOwe > 0" class="text-danger fw-bold">
                <div v-for="balance in youOwe" :key="balance.userId">
                  <span>You owe {{ balance.userName }} ₹{{ balance.amount }}</span>
                </div>
              </div>
              <div v-if="totalOwed === 0 && totalYouOwe === 0" class="text-muted">
                You are all settled up in this group.
              </div>
            </div>
            <!-- Expenses Section -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Expenses</h5>
              <button class="btn rounded-pill add-expense-button" @click="addExpense">
                <i class="fa-solid fa-plus"></i> Add Expense
              </button>
            </div>
            <!-- Expenses List -->
            <div class="expenses-list">
              <div
                v-for="expense in hardcodedExpenses"
                :key="expense.id"
                class="expense-card mb-3"
                @click="viewExpense(expense.id)"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-2">
                      <div class="expense-icon me-3">
                        <i :class="expense.icon"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 expense-title">{{ expense.title }}</h6>
                        <small class="text-muted">
                          Paid by <span class="fw-semibold">{{ expense.paidBy }}</span>
                        </small>
                      </div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="expense-amount">₹{{ expense.amount }}</div>
                    <div
                      class="expense-share mt-1"
                      :class="getShareClass(expense.yourShare)"
                    >
                      {{ getYourShareText(expense.yourShare) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Show Members Modal -->
      <div v-if="isShowMembersOpen" class="custom-modal-backdrop" @click.self="isShowMembersOpen = false">
        <div class="custom-modal">
          <div class="modal-header">
            <h5 class="modal-title">Members</h5>
            <button type="button" class="btn-close" @click="isShowMembersOpen = false"></button>
          </div>
          <div class="modal-body">
            <ul class="list">
              <li v-for="member in group?.members" :key="member.id">
                {{ member.user.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Add Member Modal -->
      <div v-if="isModalOpen" class="custom-modal-backdrop" @click.self="isModalOpen = false">
        <div class="custom-modal large">
          <div class="modal-header">
            <h5 class="modal-title">Add Members</h5>
            <button type="button" class="btn-close" @click="isModalOpen = false"></button>
          </div>
          <div class="modal-body">
            <!-- Search/Add by Email -->
            <div class="mb-3">
              <label class="form-label fw-bold">Add by Email</label>
              <div class="input-group">
                <input
                  v-model="emailInput"
                  type="email"
                  class="form-control"
                  placeholder="Enter email address"
                  @input="checkUserExists"
                />
                <button
                  v-if="emailInput"
                  class="btn"
                  :class="userExists ? 'btn-success' : 'btn-primary'"
                  type="button"
                  @click="addByEmail"
                  :disabled="!isValidEmail(emailInput)"
                >
                  <i
                    class="fa-solid"
                    :class="userExists ? 'fa-user-plus' : 'fa-envelope'"
                  ></i>
                  {{ userExists ? "Add" : "Send Invite" }}
                </button>
              </div>
              <small
                v-if="emailInput && !isValidEmail(emailInput)"
                class="text-danger"
              >
                Please enter a valid email
              </small>
              <small v-else-if="userExists === true" class="text-success">
                <i class="fa-solid fa-check"></i> User found
              </small>
              <small v-else-if="userExists === false" class="text-warning">
                <i class="fa-solid fa-info-circle"></i> User not found. Will send invite.
              </small>
            </div>
            <!-- Suggested Friends -->
            <div v-if="suggestedFriends.length > 0" >
              <label class="form-label fw-bold">Suggested 
                
              </label>
              <div class="suggested-friends-list">
                <div
                  v-for="friend in suggestedFriends"
                  :key="friend.id"
                  class="friend-item card mb-6"
                  :class="{ selected: isSelected(friend.email) }"
                >
                  <div class="card-body p-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="friend.email"
                        v-model="selectedFriends"
                        :id="'friend-' + friend.id"
                      />
                      <label
                        class="form-check-label d-flex align-items-center"
                        :for="'friend-' + friend.id"
                      >
                        <div>
                          <div class="fw-bold">{{ friend.name }}</div>
                          <small class="text-muted">{{ friend.email }}</small>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Selected Members Preview -->
            <div v-if="selectedFriends.length > 0" >
              <label class="form-label fw-bold">
                Selected ({{ selectedFriends.length }})
              </label>
              <div class="d-flex flex-wrap gap-2">
                <span
                  v-for="email in selectedFriends"
                  :key="email"
                  class="badge bg-primary fs-6"
                >
                  {{ email }}
                  <button
                    class="removeSelectedEmail-btn"
                    @click="removeSelectedEmail(email)"
                  >
                    <i class="fa-solid fa-times ms-1"></i>
                  </button>
                </span>
              </div>
            </div>
            <!-- Result Message -->
            <div v-if="addMemberResult" class="alert" :class="addMemberResultClass">
              {{ addMemberResult }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="isModalOpen = false">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleAddMembers"
              :disabled="selectedFriends.length === 0 || addingMembers"
            >
              {{ addingMembers ? "Adding..." : `Add ${selectedFriends.length} Member(s)` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script src="./Group.js"></script>
  <style src="./Group.css" scoped />