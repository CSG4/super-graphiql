"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = onHasCompletion;

var _graphql = require("graphql");

var _markdownIt = require("markdown-it");

var _markdownIt2 = _interopRequireDefault(_markdownIt);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var md = new _markdownIt2.default();

/**
 * Render a custom UI for CodeMirror's hint which includes additional info
 * about the type and description for the selected context.
 */
function onHasCompletion(cm, data, onHintInformationRender) {
  var CodeMirror = require("codemirror");

  var information = void 0;
  var deprecation = void 0;

  // When a hint result is selected, we augment the UI with information.
  CodeMirror.on(data, "select", function(ctx, el) {
    // Only the first time (usually when the hint UI is first displayed)
    // do we create the information nodes.
    if (!information) {
      var hintsUl = el.parentNode;

      // This "information" node will contain the additional info about the
      // highlighted typeahead option.
      information = document.createElement("div");
      information.className = "CodeMirror-hint-information";
      hintsUl.appendChild(information);

      // This "deprecation" node will contain info about deprecated usage.
      deprecation = document.createElement("div");
      deprecation.className = "CodeMirror-hint-deprecation";
      hintsUl.appendChild(deprecation);

      // When CodeMirror attempts to remove the hint UI, we detect that it was
      // removed and in turn remove the information nodes.
      var _onRemoveFn = void 0;
      hintsUl.addEventListener(
        "DOMNodeRemoved",
        (_onRemoveFn = function onRemoveFn(event) {
          if (event.target === hintsUl) {
            hintsUl.removeEventListener("DOMNodeRemoved", _onRemoveFn);
            information = null;
            deprecation = null;
            _onRemoveFn = null;
          }
        })
      );
    }

    // Now that the UI has been set up, add info to information.
    var description = ctx.description
      ? md.render(ctx.description)
      : "Self descriptive.";
    var type = ctx.type
      ? '<span class="infoType">' + renderType(ctx.type) + "</span>"
      : "";

    information.innerHTML =
      '<div class="content">' +
      (description.slice(0, 3) === "<p>"
        ? "<p>" + type + description.slice(3)
        : type + description) +
      "</div>";

    if (ctx.isDeprecated) {
      var reason = ctx.deprecationReason
        ? md.render(ctx.deprecationReason)
        : "";
      deprecation.innerHTML =
        '<span class="deprecation-label">Deprecated</span>' + reason;
      deprecation.style.display = "block";
    } else {
      deprecation.style.display = "none";
    }

    // Additional rendering?
    if (onHintInformationRender) {
      onHintInformationRender(information);
    }
  });
}

function renderType(type) {
  if (type instanceof _graphql.GraphQLNonNull) {
    return renderType(type.ofType) + "!";
  }
  if (type instanceof _graphql.GraphQLList) {
    return "[" + renderType(type.ofType) + "]";
  }
  return '<a class="typeName">' + type.name + "</a>";
}
