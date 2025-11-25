export const friendsTypeDefs = `#graphql
    type Query {
        getAllFriends: [Friend!]!
        getFriendById(friendId: ID!): PersonalFriend
    }

    type Friend {
        id: ID
        name: String
        email: String
        phone: String
        groupId: String
        groupTitle: String
        groupType: String
        owedToYou: Float
        youOwe: Float
    }

    type PersonalFriend {
        groupId: ID
        name: String
    }
`;
