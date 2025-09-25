import express from "express";
const app = express();
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphQL/schema.js";
import { resolvers } from "./graphQL/resolvers.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import "dotenv/config";
import cors from "cors";

// app.use(`/graphql`, cors(), express.json());

const findUser = async (token) => {
  if (!token) {
    console.log("no token is found");

    return null;
  }
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    console.error("Error verifying the user from jwt:", error);
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const user = await findUser(token);
    return { prisma, user };
  },
});

console.log("server is listening on port 3000", url);
