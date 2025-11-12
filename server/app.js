import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import { createServer } from "http";

import { schema } from "./graphQL/schema.js";
import { context } from "./graphQL/context.js";
import { setupWebSocket } from "./websocket.js";

const app = express();
const httpServer = createServer(app);

const server = new ApolloServer({
  schema,
});

await server.start();

app.use(
  `/graphql`,
  cors({
    origin: [
      `https://j7zkqf80-${process.env.PORT}.inc1.devtunnels.ms`,
      `http://localhost:${process.env.PORT}`,
    ],
    credentials: true,
  }),
  express.json(),
  cookieParser(),
  expressMiddleware(server, { context })
);

setupWebSocket(httpServer, schema);

httpServer.listen(3001, () => {
  console.log("server is listening on port 3001");
});
