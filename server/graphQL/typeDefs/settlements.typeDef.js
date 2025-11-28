export const settlementsTypeDefs = `#graphql

    type Settlement{
        id:String!
        group_id:String!
        payer_id:String!
        receiver_id:String!
        amount:Float!
        created_at:DateTime!
        created_by:String!
        cycleId:Int!

        group:Group!
        payer:User!
        receiver:User!
        settlementCreator:User!
    }

    input CreateSettlementInput{
        group_id:String!
        payer_id:String!
        receiver_id:String!
        amount:Float!
    
    }
  
    type Mutation{
        createSettlement(input:CreateSettlementInput!):Settlement!
    }

    type Query{
         getSettlementsByGroup(group_id: String!): [Settlement!]!
    }

`;
