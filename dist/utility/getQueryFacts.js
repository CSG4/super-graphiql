"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getQueryFacts;
exports.collectVariables = collectVariables;

var _graphql = require("graphql");

/**
 * Provided previous "queryFacts", a GraphQL schema, and a query document
 * string, return a set of facts about that query useful for GraphiQL features.
 *
 * If the query cannot be parsed, returns undefined.
 */
function getQueryFacts(schema, documentStr) {
  if (!documentStr) {
    return;
  }

  var documentAST = void 0;
  try {
    documentAST = (0, _graphql.parse)(documentStr);
  } catch (e) {
    return;
  }

  var variableToType = schema ? collectVariables(schema, documentAST) : null;

  // Collect operations by their names.
  var operations = [];
  documentAST.definitions.forEach(function (def) {
    if (def.kind === "OperationDefinition") {
      operations.push(def);
    }
  });

  return { variableToType: variableToType, operations: operations };
}

/**
 * Provided a schema and a document, produces a `variableToType` Object.
 */
/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

function collectVariables(schema, documentAST) {
  var variableToType = Object.create(null);
  documentAST.definitions.forEach(function (definition) {
    if (definition.kind === "OperationDefinition") {
      var variableDefinitions = definition.variableDefinitions;
      if (variableDefinitions) {
        variableDefinitions.forEach(function (_ref) {
          var variable = _ref.variable,
              type = _ref.type;

          var inputType = (0, _graphql.typeFromAST)(schema, type);
          if (inputType) {
            variableToType[variable.name.value] = inputType;
          }
        });
      }
    }
  });
  return variableToType;
}