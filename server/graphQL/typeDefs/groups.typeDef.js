export const groupTypeDefs = `#graphql
    type Query {
      
        getGroupDetails(id:ID!):Group!
        getGroups(type: String): [Group!]!
        getPersonalGroupId(otherUserId: ID!): ID
        getCommonGroups(friendId: String!): [Group!]!
    }

    type Mutation{
        createGroup(title:String!, type:GroupType,members:[String]):Group!
        addMemberToGroup(groupId:String!, emails:[String!]!):AddMemberToGroupResult!
        renameGroup(groupId:String! , title:String!):Group!
        deleteGroup(groupId:String! ):Boolean!
        getOrCreateNonGroup(memberIds: [ID!]!) : Group!
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
        createdById: String!
        members: [GroupMember!]!
        currentCycleId:Int!
        profilePic: String
        profilePicVersion: String
    }

    type GroupMember {
        id: ID!
        user:User!
        groupId:String!
        joinedAt:String!
    }
`;
