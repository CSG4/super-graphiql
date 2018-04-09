const express = require("express");
const app = express();   
const { graphqlExpress } = require('apollo-server-express');
const bodyParser = require("body-parser");  
const { makeExecutableSchema } = require('graphql-tools');
const path = require("path");  
const models = require('./models');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// port to run SuperGraphiQL, defaulted to localhost:9000
const PORT = 9000;

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

// Sequelize model synchronization
// Create tables if they don't exist in the database
// Then, Server starts to listen
models.sequelize.sync({}).then(
  app.listen(PORT, () => {
    console.log("Listening on port 9000");
  })
);
