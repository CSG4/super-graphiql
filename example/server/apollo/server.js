const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const { graphql, execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const path = require("path");
const { renderGraphiQL, supergraphiqlExpress } = require("./../render-superGraphiQL");
const schema = require("./schema");
const bodyParser = require("body-parser");
const app = express();
const ws = createServer(app);

app.use('/*.css',(req, res) => {
  res.setHeader('Content-Type','text/css');
  res.sendFile(path.join(__dirname, './../../../super-graphiql.min.css'));
});

app.use('/*/webpack-bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, "./../../dist/webpack-bundle.js"));
});

app.use('/super-graphiql.js', (req, res) => {
  res.sendFile(path.join(__dirname, "./../../../super-graphiql.js"));
});

app.use('/test', 
// supergraphiqlExpress({
//   endpointURL: "/graphql",
//   subscriptionsEndpoint: "ws://localhost:9999/subscriptions"
// }));
(req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(renderGraphiQL({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:9999/subscriptions"
  }));
  res.end();
});

app.use("/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:9999/subscriptions" // subscriptions endpoint.
  })
);

// HTTP Request endpoint
app.use('/graphql', bodyParser.json(), (req, res, next) => {
  console.log(req.body);
  next();
}, graphqlExpress({ schema }));

// Websocket endpoint
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

//------ To test your GraphQL schema/server using Postman ------//

  // // A post request to retrieve the results of a query using HTTP, via specifying the query in a json in the body of the message


app.use("/graphqlHttp", bodyParser.json(), (req, res) => {
  const queryObj = {
    schema, 
    source: req.body.query.toString()
  }
  
  if (req.body.variables) {
    queryObj['variableValues'] = JSON.parse(req.body.variables);
  }
  
  graphql(queryObj).then(response => {
    res.send(response);
  });
});
    
app.listen(9000, () => {
  console.log("listening on 9000");
});