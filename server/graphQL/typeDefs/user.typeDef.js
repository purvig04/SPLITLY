export const userTypeDefs = `#graphql
    type User{
        id: ID!
        name:String!
        email:String!
        contact:String!
        createdAt:String!
        updatedAt:String!
        }
    
    type Query{
        getUser:User
    }


    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation{
        register( name:String! password:String! email:String! contact:String! ):User!
        login(password:String! email:String! ):AuthPayload
        logout:Boolean!
    }
`;
