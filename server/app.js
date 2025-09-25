import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { typeDefs } from "./graphQL/schema.js";
import { resolvers } from "./graphQL/resolvers.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

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

await server.start();

app.use(
  `/graphql`,
  cors({ origin: "http://localhost:8081", credentials: true }),
  express.json(),
  cookieParser(),
  expressMiddleware(server,{
    context: async ({ req }) => {
        const token = req.cookies.token; // Read token from cookies
        const user = await findUser(token);
        return { prisma, user };}
  })
);


app.listen(3000,()=>
{
    console.log("server is listening on port 3000");

})
