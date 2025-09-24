import express from "express";
const app = express();
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";


app.get("/", (req, res) => {
  res.send("WORKING SPLITLY");
});

const resolvers = {
  Query: {
    getUser(_, args) {
      return;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log("server is listening on port 3000");
