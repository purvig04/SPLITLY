export const expensesTypeDefs = `#graphql

scalar JSON
scalar DateTime

    type Expense{
        id:String!
        title: String!
        description: String!
        groupId: String!
        totalAmount: Float!
        categoryId: String!
        paid_by:JSON
        shared_amounts:JSON
        created_by: String!
        is_settled:Boolean
        createdAt: DateTime!
        updatedAt: DateTime!

        category: Category!
        group: Group!
        createdByUser: User!
    }

    

    input CreateExpenseInput {
        title: String!
        description: String
        groupId: String!
        totalAmount: Float
        categoryId: String!
        paid_by: JSON
        shared_amounts: JSON
    }
    input UpdateExpenseInput {
        title: String
        description: String
        totalAmount: Float
        categoryId: String
        paid_by: JSON
        shared_amounts: JSON
        is_settled: Boolean
    }
    type Query {
        getExpensesByGroup(groupId: String!): [Expense!]!
        getExpenseById(id: String!): Expense!
    }
    type Mutation {
        createExpense(input: CreateExpenseInput!): Expense!
        updateExpense(id: String!, input: UpdateExpenseInput!): Expense!
        deleteExpense(id: Int!): Boolean!
    }
`;
