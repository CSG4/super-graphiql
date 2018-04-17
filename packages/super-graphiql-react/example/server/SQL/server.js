/* eslint-disable */

const path = require("path");
const express = require("express");
const { createServer } = require('http');
const app = express();  
const ws = createServer(app); 
const bodyParser = require("body-parser"); 
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { graphqlExpress } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const joinMonsterJoins = require('./joinMonsterJoins');
const joinMonsterAdapt = require('join-monster-graphql-tools-adapter'); 
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const models = require('./models');
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const schema = makeExecutableSchema({typeDefs, resolvers});

joinMonsterAdapt(schema, joinMonsterJoins);

// ports to run SuperGraphiQL and susbscriptions (websockets)
const HTTP_PORT = 7777;
const WS_PORT = 8888

// Serve Super-Graphiql static files (i.e. HTML)
app.use("/supergraphiql", express.static(path.join(__dirname, "./../../")));

// Serve the bundled React application
app.use("/*/webpack-bundle.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./../../../dist/webpack-bundle.js"));
});

// Serve the bundled css file
app.use("/*/app.bundle.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./../../../dist/app.bundle.css"));
});

// HttpEndpoint to access SQL graphql schema
app.use("/graphql", bodyParser.json(),
graphqlExpress({
  schema,
  context: {
    models,
  },
}),
);

// Create tables if they don't exist in the database
// Then Express server starts to listen 
models.sequelize.sync({}).then(
  app.listen(HTTP_PORT, () => {
    console.log("Listening on port 7777");
  })
);

// Run websocket on port 8888
ws.listen(WS_PORT, () => {
  console.log("Websocket is running on ws://localhost:8888");
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});
