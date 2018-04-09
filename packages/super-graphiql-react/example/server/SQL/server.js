const express = require("express");   
const bodyParser = require("body-parser");  
const path = require("path");  
const models = require('./models');
const { graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/*/graphiql.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./../../graphiql.css"));
});

app.use(express.static(__dirname + "./../"));

app.use("/graphql", bodyParser.json(),
graphqlExpress({
  schema,
  context: {
    models,
  },
}),
);

models.sequelize.sync({}).then(
  app.listen(9000, () => {
    console.log("listening on port 9000");
  })
)
