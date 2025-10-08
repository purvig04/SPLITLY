export const typeDefs = `#graphql
    type User{
        id: ID!
        name:String!
        email:String!
        contact:String!
        createdAt:String!
        updatedAt:String!
        }

    enum GroupType{
        PERSONAL
        NON_GROUP
        GROUP
    }

    type Group {
        id:ID!
        title: String!
        type:GroupType!
        createdById : String!
        members : [GroupMember!]!
    }

    type GroupMember {
        id: ID!
        user:User!
        groupId:String!
        joinedAt:String!
    }

    type Query{
        getUser:User
        getGroups:[Group!]!
    }

    type Mutation{
        register( name:String! password:String! email:String! contact:String! ):User!
        login(password:String! email:String! ):AuthPayload
        logout:Boolean!
        createGroup(title:String!, type:GroupType,members:[String]):Group!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

`;
