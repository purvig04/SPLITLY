<template>
  <div class="main">
     <div class="modal-backdrop" @click.self="$emit('close')">
       <div class="modal-content p-4"> 
         <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="$emit('close')"
          ></button>
        </div>
         <!-- Top Row: Icon, Title, and Amount   -->
         <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center">
            <i
              :class="expense.category.icon"
              class="fs-2 me-3 text-primary"
            ></i>
            <div>
              <h4 class="mb-0">{{ expense.title }}</h4>
              <small class="text-muted d-block mb-2" v-if="expense.description">
                {{ expense.description }}
              </small>
            </div>
          </div>
          <h4 class="mb-0 align-items-center text-success">
            ₹{{ expense.totalAmount }}
          </h4>
        </div>
        <p class="mb-1 text-muted">
          Added by <strong>{{ expense.createdByUser.name }}</strong> on
          {{ formatDate(expense.createdAt) }}
        </p>
        <p class="text-muted mb-0" v-if="expense.updatedAt">
          Updated by   on {{ formatDate(expense.updatedAt) }}
        </p>

         <!-- People Section  -->
          <div class="people-diagram mt-4">
          <div class="total-amount text-success fw-bold">
            ₹{{ expense.totalAmount }} 
           </div> 
           <div class="connections">
            <div
              v-for="person in peopleSummary"
              :key="person.id"
              class="connection-item"
            >
              <div class="line"></div>
              <div class="person-dot"></div>
              <div class="person-info">
                <strong>{{ person.name }}</strong> 
                Paid ₹{{ person.paid }} and
                {{
                  person.net > 0
                    ? `Owe ₹${Math.abs(person.net)}`
                    : person.net < 0
                    ? `Owes ₹${Math.abs(person.net)}`
                    : "Settled"
                }}
              </div> 
            </div>
           </div>
        </div>  
        <!-- Action Buttons -->
        <div class="mt-4 d-flex justify-content-end gap-2">
          <button class="btn btn-outline-primary btn-sm" @click="editExpense">
            Edit
          </button>
          <button class="btn btn-outline-danger btn-sm" @click="deleteExpense">
            Delete
          </button>
        </div> 
       </div> 
    </div> 
  </div> 
</template>
<script src="./ExpenseDetail.js" />
<style src="./ExpenseDetail.css" scoped />
