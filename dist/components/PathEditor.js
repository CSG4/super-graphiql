"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PathEditor = undefined;

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphql = require("graphql");

var _markdownIt = require("markdown-it");

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _normalizeWhitespace = require("../utility/normalizeWhitespace");

var _onHasCompletion = require("../utility/onHasCompletion");

var _onHasCompletion2 = _interopRequireDefault(_onHasCompletion);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

/**
 * PathEditor
 *
 * Allows the user to input a server path for the query
 *
 * Props:
 *
 *   - schema: A GraphQLSchema instance enabling editor linting and hinting.
 *   - value: The text of the editor.
 *   - onEdit: A function called when the editor changes, given the edited text.
 *   REMOVE - readOnly: Turns the editor to read-only mode.
 *
 */

//user a code mirror line to allow users to type into the field

var PathEditor = (exports.PathEditor = (function(_React$Component) {
  _inherits(PathEditor, _React$Component);

  function PathEditor(props) {
    _classCallCheck(this, PathEditor);

    return _possibleConstructorReturn(
      this,
      (PathEditor.__proto__ || Object.getPrototypeOf(PathEditor)).call(this)
    );
  }

  _createClass(PathEditor, [
    {
      key: "render",
      value: function render() {
        return _react2.default.createElement(
          "div",
          {
            className: "path-editor"
          },
          "Path:",
          _react2.default.createElement("input", {
            className: "path-input",
            placeholder: "http://localhost:8000/"
          })
        );
      }
    }
  ]);

  return PathEditor;
})(_react2.default.Component));

PathEditor.propTypes = {
  schema: _propTypes2.default.instanceOf(_graphql.GraphQLSchema),
  value: _propTypes2.default.string,
  onEdit: _propTypes2.default.func,
  readOnly: _propTypes2.default.bool,
  onHintInformationRender: _propTypes2.default.func,
  onClickReference: _propTypes2.default.func,
  onPrettifyQuery: _propTypes2.default.func,
  onRunQuery: _propTypes2.default.func,
  editorTheme: _propTypes2.default.string
};
