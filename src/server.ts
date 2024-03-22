import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";
import { PubSub } from "graphql-subscriptions";
import { GqlContext } from "./GqlContext.js";
import { log } from "./Logger.js";

(async function () {
  const app = express();
  const httpServer = createServer(app);
  const pubsub = new PubSub(); // Publish and Subscribe, Publish -> everyone gets to hear it

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // ws Server
  const wsServer = new WebSocketServer({
    server: httpServer,

    path: "/graphql", // localhost:3000/graphql
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: GqlContext, msg, args) => ({
        // Returning an object will add that information to
        // contextValue, which all of our resolvers have access to.
        pubsub,
      }),
    },
    wsServer
  ); // dispose

  // apollo server
  const server = new ApolloServer({
    schema,

    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      log,
    ],
  });

  // start our server
  await server.start();

  // apply middlewares (cors, expressmiddlewares)
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }: any) => ({
        req,
        res,
        pubsub,
      }),
    })
  );

  // http server start
  httpServer.listen(4000, () => {
    console.log("Server running on http://localhost:" + "4000" + "/graphql");
  });
})();
