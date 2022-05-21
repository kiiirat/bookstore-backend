import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import { buildSchema, AuthChecker, Authorized } from "type-graphql";
import { PrismaClient } from "@prisma/client";

import {
  resolvers,
  ResolversEnhanceMap,
  applyResolversEnhanceMap,
} from "@generated/type-graphql";
import { CustomUserResolver } from "./resolvers/user";
import { customAuthChecker } from "./middlewares/authChecker";
import { MyContext } from "./types";

const prisma = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("error", (e) => {
  console.log(e);
});

async function startApolloServer() {
  const resolversEnhanceMap: ResolversEnhanceMap = {
    Book: {
      books: [Authorized()],
      book: [Authorized()],
      createBook: [Authorized()],
      updateBook: [Authorized()],
      deleteBook: [Authorized()],
    },
  };

  applyResolversEnhanceMap(resolversEnhanceMap);

  const schema = await buildSchema({
    resolvers: [...resolvers, CustomUserResolver],
    authChecker: customAuthChecker,
    validate: false,
  });

  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => ({
      prisma,
      req,
      res,
    }),
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
