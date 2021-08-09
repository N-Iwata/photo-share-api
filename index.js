const { MongoClient } = require("mongodb");
const { ApolloServer } = require(`apollo-server-express`);
const expressPlayground = require("graphql-playground-middleware-express").default;
const express = require("express");
const { readFileSync } = require("fs");

require("dotenv").config();

const app = express();
const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const resolvers = require("./resolvers");

async function startApolloServer() {
  const MONGO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });
  const db = client.db();

  const context = async ({ req }) => {
    const githubToken = req.headers.authorization;
    const currentUser = await db.collection("users").findOne({ githubToken });
    return { db, currentUser };
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

  await server.start();

  server.applyMiddleware({ app });

  app.get("/", (req, res) => {
    res.send("Welcome to the PhotoShare API");
  });

  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running on @ http://localhost:4000${server.graphqlPath}`);
  });
}
startApolloServer();
