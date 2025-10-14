export const friendsTypeDefs = `#graphql
    type Query {
        getPersonalGroups: [PersonalGroup!]!
    }

    type PersonalGroup {
        id: ID
        name: String
        email: String
        phone: String
        groupTitle: String
        groupType: String
        owedToYou: Float
        youOwe: Float
    }
`;
