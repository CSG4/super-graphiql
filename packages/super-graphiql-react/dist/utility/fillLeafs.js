"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillLeafs = fillLeafs;

var _graphql = require("graphql");

/**
 * Given a document string which may not be valid due to terminal fields not
 * representing leaf values (Spec Section: "Leaf Field Selections"), and a
 * function which provides reasonable default field names for a given type,
 * this function will attempt to produce a schema which is valid after filling
 * in selection sets for the invalid fields.
 *
 * Note that there is no guarantee that the result will be a valid query, this
 * utility represents a "best effort" which may be useful within IDE tools.
 */
function fillLeafs(schema, docString, getDefaultFieldNames) {
  var insertions = [];

  if (!schema) {
    return { insertions: insertions, result: docString };
  }

  var ast = void 0;
  try {
    ast = (0, _graphql.parse)(docString);
  } catch (error) {
    return { insertions: insertions, result: docString };
  }

  var fieldNameFn = getDefaultFieldNames || defaultGetDefaultFieldNames;
  var typeInfo = new _graphql.TypeInfo(schema);
  (0, _graphql.visit)(ast, {
    leave: function leave(node) {
      typeInfo.leave(node);
    },
    enter: function enter(node) {
      typeInfo.enter(node);
      if (node.kind === "Field" && !node.selectionSet) {
        var fieldType = typeInfo.getType();
        var selectionSet = buildSelectionSet(fieldType, fieldNameFn);
        if (selectionSet) {
          var indent = getIndentation(docString, node.loc.start);
          insertions.push({
            index: node.loc.end,
            string: " " + (0, _graphql.print)(selectionSet).replace(/\n/g, "\n" + indent)
          });
        }
      }
    }
  });

  // Apply the insertions, but also return the insertions metadata.
  return {
    insertions: insertions,
    result: withInsertions(docString, insertions)
  };
}

// The default function to use for producing the default fields from a type.
// This function first looks for some common patterns, and falls back to
// including all leaf-type fields.
/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

function defaultGetDefaultFieldNames(type) {
  // If this type cannot access fields, then return an empty set.
  if (!type.getFields) {
    return [];
  }

  var fields = type.getFields();

  // Is there an `id` field?
  if (fields["id"]) {
    return ["id"];
  }

  // Is there an `edges` field?
  if (fields["edges"]) {
    return ["edges"];
  }

  // Is there an `node` field?
  if (fields["node"]) {
    return ["node"];
  }

  // Include all leaf-type fields.
  var leafFieldNames = [];
  Object.keys(fields).forEach(function (fieldName) {
    if ((0, _graphql.isLeafType)(fields[fieldName].type)) {
      leafFieldNames.push(fieldName);
    }
  });
  return leafFieldNames;
}

// Given a GraphQL type, and a function which produces field names, recursively
// generate a SelectionSet which includes default fields.
function buildSelectionSet(type, getDefaultFieldNames) {
  // Unwrap any non-null or list types.
  var namedType = (0, _graphql.getNamedType)(type);

  // Unknown types and leaf types do not have selection sets.
  if (!type || (0, _graphql.isLeafType)(type)) {
    return;
  }

  // Get an array of field names to use.
  var fieldNames = getDefaultFieldNames(namedType);

  // If there are no field names to use, return no selection set.
  if (!Array.isArray(fieldNames) || fieldNames.length === 0) {
    return;
  }

  // Build a selection set of each field, calling buildSelectionSet recursively.
  return {
    kind: "SelectionSet",
    selections: fieldNames.map(function (fieldName) {
      var fieldDef = namedType.getFields()[fieldName];
      var fieldType = fieldDef ? fieldDef.type : null;
      return {
        kind: "Field",
        name: {
          kind: "Name",
          value: fieldName
        },
        selectionSet: buildSelectionSet(fieldType, getDefaultFieldNames)
      };
    })
  };
}

// Given an initial string, and a list of "insertion" { index, string } objects,
// return a new string with these insertions applied.
function withInsertions(initial, insertions) {
  if (insertions.length === 0) {
    return initial;
  }
  var edited = "";
  var prevIndex = 0;
  insertions.forEach(function (_ref) {
    var index = _ref.index,
        string = _ref.string;

    edited += initial.slice(prevIndex, index) + string;
    prevIndex = index;
  });
  edited += initial.slice(prevIndex);
  return edited;
}

// Given a string and an index, look backwards to find the string of whitespace
// following the next previous line break.
function getIndentation(str, index) {
  var indentStart = index;
  var indentEnd = index;
  while (indentStart) {
    var c = str.charCodeAt(indentStart - 1);
    // line break
    if (c === 10 || c === 13 || c === 0x2028 || c === 0x2029) {
      break;
    }
    indentStart--;
    // not white space
    if (c !== 9 && c !== 11 && c !== 12 && c !== 32 && c !== 160) {
      indentEnd = indentStart;
    }
  }
  return str.substring(indentStart, indentEnd);
}