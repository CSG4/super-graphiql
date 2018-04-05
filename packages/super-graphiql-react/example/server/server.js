const express = require("express");
const app = express();
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql-schema");
const bodyParser = require("body-parser");
const path = require("path");

// port to run SuperGraphiQL, defaulted to localhost:8000
const PORT = 8000;

// Serve Super-Graphiql static files (i.e. HTML)
app.use("/supergraphiql", express.static(path.join(__dirname, "./../")));

// Serve the bundled React application
app.use("/*/webpack-bundle.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./../../dist/webpack-bundle.js"));
});

// Serve the bundled css file
app.use("/*/app.bundle.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./../../dist/app.bundle.css"));
});

// HttpEndpoint to access graphql schema
app.use("/graphql", bodyParser.json(), graphqlHTTP({ schema }));


app.listen(PORT, () => { console.log("listening on 8000"); });