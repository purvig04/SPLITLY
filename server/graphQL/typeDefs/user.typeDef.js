export const userTypeDefs = `#graphql
    type User {
        id: ID!
        name:String!
        email:String!
        contact:String!
        createdAt:String!
        updatedAt:String!
        profilePic: String
        profilePicVersion: String
    }
    
    type Query {
        getUser:User
        checkUserExists(email:String!):Boolean!
        getUserById(userId: ID!): User
    }


    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation {
        register( name:String! password:String! email:String! contact:String! ):User!
        login(password:String! email:String! ):AuthPayload
        logout:Boolean!
        updateUserDetails(input: UserInput!): User!
    }

    input UserInput {
        name: String
        contact: String
        profilePic: String
        profilePicVersion: String
    }
`;
