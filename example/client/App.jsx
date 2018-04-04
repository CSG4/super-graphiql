import React from 'react';
import { render } from 'react-dom';
import { SuperGraphiQL } from './../../src/components/SuperGraphiQL';
import fetch from 'isomorphic-fetch';

// Defines a GraphQL fetcher using the fetch API. You're not required to
// use fetch, and could instead implement graphQLFetcher however you like,
// as long as it returns a Promise or Observable.
function graphQLFetcher(graphQLParams) {
  // This example expects a GraphQL server at the path /graphql.
  // Change this to point wherever you host your GraphQL server.
  return new Promise((resolve, reject) => {
    fetch('/graphql', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    
    credentials: 'include', 
    }).then(function (response) {
      return response.text();
    })
    .then(function (responseBody) {
      try {
        resolve(JSON.parse(responseBody));
      } catch (error) {
        resolve(responseBody);
      }
    });
  });
}

render((
    <div>
      <SuperGraphiQL
        fetcher={graphQLFetcher}
      />
    </div>
), document.getElementById('contents'));
