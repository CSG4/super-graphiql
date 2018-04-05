/*
 * Mostly taken straight from express-graphql, so see their licence
 * (https://github.com/graphql/express-graphql/blob/master/LICENSE)
 */

const SUBSCRIPTIONS_TRANSPORT_VERSION = '0.8.2';
// Ensures string values are safe to be used within a <script> tag.
const superGraphiql = {};

superGraphiql.supergraphiqlExpress = function (data) {
  return (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.write(superGraphiql.renderGraphiQL(data));
    res.end();
    next();
  };
};


superGraphiql.renderGraphiQL = function (data) {
  // if(!(data instanceof GraphiQLData)) {
  //   throw new Error("invalid param passed");
  // }
  const endpointURL = data.endpointURL;
  const endpointWs =
    endpointURL.startsWith('ws://') || endpointURL.startsWith('wss://');
  const subscriptionsEndpoint = data.subscriptionsEndpoint;
  const usingHttp = !endpointWs;
  const usingWs = endpointWs || Boolean(subscriptionsEndpoint);
  const endpointURLWs =
    usingWs && (endpointWs ? endpointURL : subscriptionsEndpoint);
  const passHeader = data.passHeader ? data.passHeader : '';
  const websocketConnectionParams = data.websocketConnectionParams || null;

  return `<!DOCTYPE html> 
  <html>
    <head>
      <meta charset="UTF-8">
        <title>Super GraphiQL</title>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/super-graphiql@latest/super-graphiql.min.css" />
        <script src="http://unpkg.com/react@15.6.1/dist/react.min.js"></script>
        <script src="http://unpkg.com/react-dom@15.6.1/dist/react-dom.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/super-graphiql@latest/super-graphiql.min.js"></script>
        <script src="https://use.fontawesome.com/992e44b468.js"></script>
        ${usingHttp ? `<script src="//cdn.jsdelivr.net/fetch/2.0.1/fetch.min.js"></script>` : ''}
        ${usingWs ? `<script src="//unpkg.com/subscriptions-transport-ws@${SUBSCRIPTIONS_TRANSPORT_VERSION}/browser/client.js"></script>` : ''}
        ${usingWs && usingHttp ? '<script src="//unpkg.com/graphiql-subscriptions-fetcher@0.0.2/browser/client.js"></script>' : ''}
    </head>
    <body>
    <div id="content"> </div>
      <script>
        ${
          usingWs
            ? `
          var subscriptionsClient = new window.SubscriptionsTransportWs.SubscriptionClient('${endpointURLWs}', {
            reconnect: true${
            websocketConnectionParams
              ? `,
            connectionParams: ${JSON.stringify(websocketConnectionParams)}`
              : ''
            }
          });
          var graphQLWSFetcher = subscriptionsClient.request.bind(subscriptionsClient);
          `
            : ''
        }
        ${
          usingHttp
            ? `
            // We don't use safe-serialize for location, because it's not client input.
            var fetchURL = "${endpointURL}";
            function graphQLHttpFetcher(graphQLParams) {

                return fetch(fetchURL, {
                  method: 'post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ${passHeader}
                  },
                  body: JSON.stringify(graphQLParams),
                  credentials: 'same-origin',
                }).then(function (response) {
                  return response.text();
                }).then(function (responseBody) {
                  try {
                    return JSON.parse(responseBody);
                  } catch (error) {
                    return responseBody;
                  }
                });
            }
          `
            : ''
        }
        ${
          usingWs && usingHttp
            ? `
            var fetcher =
              window.GraphiQLSubscriptionsFetcher.graphQLFetcher(subscriptionsClient, graphQLHttpFetcher);
          `
            : `
            var fetcher = ${usingWs ? 'graphQLWSFetcher' : 'graphQLHttpFetcher'};
          `
        }
         // Render <GraphiQL /> into the body.
         ReactDOM.render(
          React.createElement(GraphiQL, {
            fetcher: fetcher,
          }),
          document.getElementById("content")
        );
      </script>
    </body>
  </html>`
};

module.exports = superGraphiql;