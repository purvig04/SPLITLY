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
        getUser(id:ID!):User
    }
`;
