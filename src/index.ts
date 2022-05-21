import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import { buildSchema } from "type-graphql";
import { context } from "./context";

import { resolvers } from "@generated/type-graphql";
import { CustomUserResolver } from "./resolvers/user";

async function startApolloServer() {
  const schema = await buildSchema({
    resolvers: [...resolvers, CustomUserResolver],
    validate: false,
  });
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: "*",
    },
  });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer().catch((error) => console.log(error));
