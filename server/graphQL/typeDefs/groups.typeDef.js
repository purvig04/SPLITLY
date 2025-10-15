export const groupTypeDefs = `#graphql
    type Query {
      
        getGroupDetails(id:ID!):Group!
        getGroups(type: String): [Group!]!
    }

    type Mutation{
        createGroup(title:String!, type:GroupType,members:[String]):Group!
        addMemberToGroup(groupId:String!, emails:[String!]!):AddMemberToGroupResult!
    }

    type AddMemberToGroupResult {
        added: [String!]!
        invited: [String!]!
        alreadyMembers: [String!]!
        updatedGroup: Group!
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
`;
