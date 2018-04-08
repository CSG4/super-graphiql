<h1 align="center">Super GraphiQL</h1>
<p align="center">Super-GraphiQL is a powerful yet simple GUI designed for testing your GraphQL API.</p>

With Super-GraphiQL users are able to quickly setup a series of tests for GraphQL API, better understand the execution of queries and save test cases for easy reuse.

[![Build Status](https://travis-ci.org/graphql/graphiql.svg?branch=master)](https://travis-ci.org/graphql/graphiql)
[![CDNJS](https://img.shields.io/cdnjs/v/graphiql.svg)](https://cdn.jsdelivr.net/npm/super-graphiql@latest/super-graphiql.min.js) 
[![npm](https://img.shields.io/npm/v/graphiql.svg)](https://www.npmjs.com/package/super-graphiql) 

## Getting Started
<b>React Component</b>
You can incorporate Super-GraphiQL into your existing project with npm:
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

<b>Express Middleware</b> 
```sh

$ npm install --save super-graphiql-express

```
## Features 
Super-GraphiQL leverages components of [GraphiQL](https://github.com/graphql/graphiql) under the hood but developed to be a more powerful and flexibile GraphQL IDE to enable a smooth and efficient testing workflow. Super-GraphiQL adds the following features to the GraphQL ecosystem:
  
  - Supports multiple GraphQL queries and mutations in one test script
  - Intuitive visualization of test results
  - Save and reuse test scripts
  - Searchable Query history
  - Context-aware autocompletion & error highlighting
  - Supports real-time GraphQL Subscriptions
  
## Techstack
<b>Built with</b>
- [React]()
- [Flow]()
- [Apollo]()
- [Express]()
- [MongoDB]()
- [Postgres]()

## How to use?
- Make mulitple queries in one script
- Build a full test script of queries and test only the ones you need

## Packages
[super-graphiql-express](https://www.npmjs.com/package/super-graphiql-express): Express middleware
[super-graphiql-react](https://www.npmjs.com/package/super-graphiql): Core of Super Graphiql built with ReactJS


## Authors

<!-- [![Albert Chen](https://avatars3.githubusercontent.com/u/23642624?s=400&v=4?raw=true)](https://github.com/ac3639) | 
[![Marissa Lafontant](https://avatars3.githubusercontent.com/u/31493327?s=460&v=4?raw=true)](https://github.com/mlafontant) | 
[![Eduardo Maillo](https://avatars2.githubusercontent.com/u/33046720?s=400&v=4?raw=true)](https://github.com/eduardomaillo) | 
[![Angela Scerbo](https://avatars2.githubusercontent.com/u/11137912?s=400&v=4?raw=true)](https://github.com/angelascerbo)
---|---|---|--- -->
[Albert Chen](https://github.com/ac3639) | [Marissa Lafontant](https://github.com/mlafontant) | [Eduardo Maillo](https://github.com/eduardomaillo) | [Angela Scerbo](https://github.com/angelascerbo)


## License
See LICENSE file
MIT ©

