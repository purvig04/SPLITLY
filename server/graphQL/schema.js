export const typeDefs = `#graphql
    type User{
        id: ID!
        name:String!
        password:String!
        email:String!
        contact:String!
        createdAt:String!
        updatedAt:String!
        }
    
    type Query{
        getUser:User
    }

    type Mutation{
        register( name:String! password:String! email:String! contact:String! ):AuthPayload
        login(password:String! email:String! ):AuthPayload


    }

    type AuthPayload {
        token: String!
        user: User!
    }

`;
