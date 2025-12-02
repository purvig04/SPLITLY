export const groupTypeDefs = `#graphql
    type Query {
      
        getGroupDetails(id:ID!):Group!
        getGroups(type: String): [Group!]!
        getPersonalGroupId(otherUserId: ID!): ID
    }

    type Mutation{
        createGroup(title:String!, type:GroupType,members:[String]):Group!
        addMemberToGroup(groupId:String!, emails:[String!]!):AddMemberToGroupResult!
        renameGroup(groupId:String! , title:String!):Group!
        deleteGroup(groupId:String! ):Boolean!
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
        currentCycleId:Int!
    }

    type GroupMember {
        id: ID!
        user:User!
        groupId:String!
        joinedAt:String!
    }
`;
