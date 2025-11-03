export const friendsTypeDefs = `#graphql
    type Query {
        getFriends: [Friend!]!
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
`;
