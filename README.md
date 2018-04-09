<p align="center"><img src="https://imgur.com/FGT9yfC.png" width="350"></p>

<p align="center">Super-GraphiQL is a powerful yet simple GUI designed for testing your GraphQL API.</p>

With Super-GraphiQL users are able to quickly setup a series of tests for GraphQL API, better understand the execution of queries and save test cases for easy reuse.

<p align="center"><img src="https://imgur.com/oUNUTSW.png" width="750"></p>

## Getting Started
<b>Express Middleware</b> 
<p>To use Super-GraphiQL, install and incorporate the express middleware into your existing project with npm:</p>
```sh

$ npm install --save super-graphiql-express

```

To use the express middleware, simply import the package into your server file and specify the HTTP endpoint and / or websocket endpoint of your GraphQL server. The SuperGraphiQL IDE will automatically be rendered at the '/supergraphiql' route and include support for GraphQL subscriptions.

```sh

const { supergraphiqlExpress } = require('super-graphiql-express');

app.use('/supergraphiql', 
supergraphiqlExpress({
  endpointURL: "/graphql",
  subscriptionsEndpoint: "ws://localhost:9999/subscriptions"
}));

```

<b>React Component</b>
<p>You can incorporate Super-GraphiQL into your existing project with npm:</p>
```sh
$ npm install --save super-graphiql

```
SuperGraphiQL provides a React component responsible for rendering the GUI. The component must be provided with the graphQLFetcher function for fetching from GraphQL, we recommend using the [fetch](https://fetch.spec.whatwg.org/) standard API.
```sh
import React from 'react';
import ReactDOM from 'react-dom';
import SuperGraphiQL from 'super-graphiql';
import fetch from 'isomorphic-fetch';

function graphQLFetcher(graphQLParams) {
  return fetch(window.location.origin + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

ReactDOM.render(<SuperGraphiQL fetcher={graphQLFetcher} />, document.body);
```
Build the component into your existing project with [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/).
Include the necessary CSS and Font Awesome script on your page.
```sh
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/super-graphiql@latest/super-graphiql.min.css" />
```

## Features 
Super-GraphiQL leverages components of [GraphiQL](https://github.com/graphql/graphiql) under the hood but developed to be a more powerful and flexibile GraphQL IDE to enable a smooth and efficient testing workflow. Super-GraphiQL adds the following features to the GraphQL ecosystem:
  
  - Supports multiple GraphQL queries and mutations in one test script
  - Save and reuse test scripts including a searchable Query history
  - Includes real world examples with NoSQL and SQL databases.

## How to use?
- Build test scripts full of queries and test only the ones you need
<img src="https://imgur.com/3mqzuy6.gif" title="search-history" width="750"/>

- Search History to find the reusable queries
<img src="https://imgur.com/ogV6z6Q.gif" title="search-history" width="750"/>

## Packages
<p>[super-graphiql-express](https://www.npmjs.com/package/super-graphiql-express): Express middleware </p>
<p> [super-graphiql-react](https://www.npmjs.com/package/super-graphiql): Core of Super Graphiql built with ReactJS </p>

## Authors
[Albert Chen](https://github.com/ac3639) | [Marissa Lafontant](https://github.com/mlafontant) | [Eduardo Maillo](https://github.com/eduardomaillo) | [Angela Scerbo](https://github.com/angelascerbo)

## License
See LICENSE file
