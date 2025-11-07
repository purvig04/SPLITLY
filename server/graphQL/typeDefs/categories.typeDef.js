export const categoriesTypeDefs = `#graphql

    type Category{
        id:String!
        name:String!
    }

    type Query{
        getAllCategories:[Category!]!
    }

`