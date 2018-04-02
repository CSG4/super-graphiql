const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const { graphql, execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const path = require("path");
const { renderGraphiQL } = require("./../render-superGraphiQL");
const schema = require("./schema");
const bodyParser = require("body-parser");
const app = express();
const ws = createServer(app);


app.use("/*/app.bundle.css", (req, res) => {
  console.log('css');
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "./../../dist/app.bundle.css"));
});

app.use('/*/webpack-bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, "./../../dist/webpack-bundle.js"));
});

app.use('/graphiql.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, "./../../../graphiql.min.js"));
});
// app.use("/*/graphiql.css", (req, res) => {
//   res.sendFile(path.join(__dirname, "./../../../graphiql.css"));
// });

// app.use(express.static(__dirname + "./../../"));

app.use('/test', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(renderGraphiQL({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:9999/subscriptions"
  }));
  res.end();
})

app.use("/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql",
    subscriptionsEndpoint: "ws://localhost:9999/subscriptions" // subscriptions endpoint.
  })
);

// HTTP Request endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

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


app.use("/graphqlHttp", (req, res) => {
  const queryObj = {
    schema, 
    source: req.method === 'POST' ? req.body.query.toString() : req.query
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
          