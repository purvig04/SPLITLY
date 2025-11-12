export const categoriesTypeDefs = `#graphql

    type Category{
        id:String!
        name:String!
        icon:String!
    }

    type Query{
        getAllCategories:[Category!]!
    }

`