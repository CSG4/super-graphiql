const express = require("express");
//const graphqlHTTP = require("express-graphql");
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const { graphql, execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const schema = require("./schema");
const studentController = require("./../Controllers/studentController");
const subjectController = require("./../Controllers/subjectController");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const ws = createServer(app);

ws.listen(9999, () => {
  console.log("Websocket is now running on ws://localhost:9999");

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: ws,
      path: "/subscriptions"
    }
  );
});

const mongoose = require("mongoose");
const myURI = "mongodb://user:pw1@ds113169.mlab.com:13169/graphql-test";
const uri = process.env.MONGO_URI || myURI;
mongoose.connect(uri);
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/*/graphiql.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./../../../graphiql.css"));
});

app.use(express.static(__dirname + "./../../"));

//------ To test database using Postman ------//

app.use("/newStudent", studentController.addStudent);
app.use("/removeStudent", studentController.rmStudent);
app.use("/newSubject", subjectController.addSubject);
app.use("/removeSubject", subjectController.rmSubject);

//------ Original GraphiQL implementation can be seen at route /graphql ------//

// SWITCH BACK TO THIS???
//app.use("/graphiql", graphqlHTTP({ schema, graphiql: true }));

// graphql-server-express middlewear for rendering GraphiQL
// see https://github.com/apollographql/subscriptions-transport-ws
// Where it says: If you are using older version, or another GraphQL server, start by modifying GraphiQL static HTML, and add this package and it's fetcher from CDN...
// graphql-server-express is doing this under the hood
// this function is sending a long HTML string to render GraphiQL

// function graphiqlExpress(options) {
//     return function (req, res, next) {
//         var query = req.url && url.parse(req.url, true).query;
//         GraphiQL.resolveGraphiQLString(query, options, req).then(function (graphiqlString) {
//             res.setHeader('Content-Type', 'text/html');
//             res.write(graphiqlString);
//             res.end();
//         }, function (error) { return next(error); });
//     };
// }

// see here: https://github.com/apollographql/apollo-server/blob/5d15abc681ffc43c2ce1d68d728814b8dbcf91b8/packages/apollo-server-module-graphiql/src/renderGraphiQL.ts
// **** Note this file says ****
// TODO: in the future, build the GraphiQL app on the server, so it does not
// depend on any CDN and can be run offline.
// a GH repo trying this: https://github.com/digitalnatives/graphiql-server

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:9999/subscriptions" // subscriptions endpoint.
  })
);

//------ To test your GraphQL schema/server using Postman ------//

// A get request to retrieve the result of a query using HTTP, via a query string
app.get("/get", (req, res) => {
  let { query } = req.query;
  graphql(schema, query).then(response => {
    res.send(response);
  });
});

// A post request to retrieve the resutl of a query using HTTP, via specifying the query in a json in the body of the message
app.use("/graphql", (req, res) => {
  graphql(schema, req.body.query.toString()).then(response => {
    res.send(response);
  });
});

app.listen(9000, () => {
  console.log("listening on 9000");
});
