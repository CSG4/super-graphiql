const express = require("express");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { graphqlExpress } = require("graphql-server-express");
const { execute, subscribe } = require("graphql");
const app = express();
const ws = createServer(app);
const bodyParser = require("body-parser");
const path = require("path");
const { supergraphiqlExpress } = require("./index");
const schema = require("./schema");

app.use('/supergraphiql', 
supergraphiqlExpress({
  endpointURL: "/graphql",
  subscriptionsEndpoint: "ws://localhost:9999/subscriptions"
}));

// HTTP Request endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/super-graphiql.js', (req, res) => {
  res.sendFile(path.join(__dirname, './../../super-graphiql-react/super-graphiql.js'));
})
// run main application on port 9000    
app.listen(9000, () => {
  console.log("listening on 9000");
});

// run websocket on port 9999
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
