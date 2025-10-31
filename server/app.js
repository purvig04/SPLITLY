import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";

import { schema } from "./graphQL/schema.js";
import { context } from "./graphQL/context.js";

const app = express();

const server = new ApolloServer({
  schema,
});

await server.start();

app.use(
  `/graphql`,
  cors({ origin: `http://localhost:${process.env.PORT}`, credentials: true }),
  express.json(),
  cookieParser(),
  expressMiddleware(server, { context })
);

app.listen(3001, () => {
  console.log("server is listening on port 3001");
});
