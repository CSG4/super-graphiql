"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocExplorer = undefined;

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

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

var _FieldDoc = require("./DocExplorer/FieldDoc");

var _FieldDoc2 = _interopRequireDefault(_FieldDoc);

var _SchemaDoc = require("./DocExplorer/SchemaDoc");

var _SchemaDoc2 = _interopRequireDefault(_SchemaDoc);

var _SearchBox = require("./DocExplorer/SearchBox");

var _SearchBox2 = _interopRequireDefault(_SearchBox);

var _SearchResults = require("./DocExplorer/SearchResults");

var _SearchResults2 = _interopRequireDefault(_SearchResults);

var _TypeDoc = require("./DocExplorer/TypeDoc");

var _TypeDoc2 = _interopRequireDefault(_TypeDoc);

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
} /**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var initialNav = {
  name: "Schema",
  title: "Schema Explorer"
};

/**
 * DocExplorer
 *
 * Shows documentations for GraphQL definitions from the schema.
 *
 * Props:
 *
 *   - schema: A required GraphQLSchema instance that provides GraphQL document
 *     definitions.
 *
 * Children:
 *
 *   - Any provided children will be positioned in the right-hand-side of the
 *     top bar. Typically this will be a "close" button for temporary explorer.
 *
 */

var DocExplorer = (exports.DocExplorer = (function(_React$Component) {
  _inherits(DocExplorer, _React$Component);

  function DocExplorer() {
    _classCallCheck(this, DocExplorer);

    var _this = _possibleConstructorReturn(
      this,
      (DocExplorer.__proto__ || Object.getPrototypeOf(DocExplorer)).call(this)
    );

    _this.handleNavBackClick = function() {
      if (_this.state.navStack.length > 1) {
        _this.setState({ navStack: _this.state.navStack.slice(0, -1) });
      }
    };

    _this.handleClickTypeOrField = function(typeOrField) {
      _this.showDoc(typeOrField);
    };

    _this.handleSearch = function(value) {
      _this.showSearch(value);
    };

    _this.state = { navStack: [initialNav] };
    return _this;
  }

  _createClass(DocExplorer, [
    {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps, nextState) {
        return (
          this.props.schema !== nextProps.schema ||
          this.state.navStack !== nextState.navStack
        );
      }
    },
    {
      key: "render",
      value: function render() {
        var schema = this.props.schema;
        var navStack = this.state.navStack;
        var navItem = navStack[navStack.length - 1];

        var content = void 0;
        if (schema === undefined) {
          // Schema is undefined when it is being loaded via introspection.
          content = _react2.default.createElement(
            "div",
            { className: "spinner-container" },
            _react2.default.createElement("div", { className: "spinner" })
          );
        } else if (!schema) {
          // Schema is null when it explicitly does not exist, typically due to
          // an error during introspection.
          content = _react2.default.createElement(
            "div",
            { className: "error-container" },
            "No Schema Available",
            _react2.default.createElement("br", null),
            "(Enter Route in Path field)"
          );
        } else if (navItem.search) {
          content = _react2.default.createElement(_SearchResults2.default, {
            searchValue: navItem.search,
            withinType: navItem.def,
            schema: schema,
            onClickType: this.handleClickTypeOrField,
            onClickField: this.handleClickTypeOrField
          });
        } else if (navStack.length === 1) {
          content = _react2.default.createElement(_SchemaDoc2.default, {
            schema: schema,
            onClickType: this.handleClickTypeOrField
          });
        } else if ((0, _graphql.isType)(navItem.def)) {
          content = _react2.default.createElement(_TypeDoc2.default, {
            schema: schema,
            type: navItem.def,
            onClickType: this.handleClickTypeOrField,
            onClickField: this.handleClickTypeOrField
          });
        } else {
          content = _react2.default.createElement(_FieldDoc2.default, {
            field: navItem.def,
            onClickType: this.handleClickTypeOrField
          });
        }

        var shouldSearchBoxAppear =
          navStack.length === 1 ||
          ((0, _graphql.isType)(navItem.def) && navItem.def.getFields);

        var prevName = void 0;
        if (navStack.length > 1) {
          prevName = navStack[navStack.length - 2].name;
        }

        return _react2.default.createElement(
          "div",
          { className: "doc-explorer", key: navItem.name },
          _react2.default.createElement(
            "div",
            { className: "doc-explorer-title-bar" },
            prevName &&
              _react2.default.createElement(
                "div",
                {
                  className: "doc-explorer-back",
                  onClick: this.handleNavBackClick
                },
                prevName
              ),
            _react2.default.createElement(
              "div",
              { className: "doc-explorer-title" },
              navItem.title || navItem.name
            ),
            _react2.default.createElement(
              "div",
              { className: "doc-explorer-rhs" },
              this.props.children
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "doc-explorer-contents" },
            shouldSearchBoxAppear &&
              _react2.default.createElement(_SearchBox2.default, {
                value: navItem.search,
                placeholder: "Search " + navItem.name + "...",
                onSearch: this.handleSearch
              }),
            content
          )
        );
      }

      // Public API
    },
    {
      key: "showDoc",
      value: function showDoc(typeOrField) {
        var navStack = this.state.navStack;
        var topNav = navStack[navStack.length - 1];
        if (topNav.def !== typeOrField) {
          this.setState({
            navStack: navStack.concat([
              {
                name: typeOrField.name,
                def: typeOrField
              }
            ])
          });
        }
      }

      // Public API
    },
    {
      key: "showDocForReference",
      value: function showDocForReference(reference) {
        if (reference.kind === "Type") {
          this.showDoc(reference.type);
        } else if (reference.kind === "Field") {
          this.showDoc(reference.field);
        } else if (reference.kind === "Argument" && reference.field) {
          this.showDoc(reference.field);
        } else if (reference.kind === "EnumValue" && reference.type) {
          this.showDoc(reference.type);
        }
      }

      // Public API
    },
    {
      key: "showSearch",
      value: function showSearch(search) {
        var navStack = this.state.navStack.slice();
        var topNav = navStack[navStack.length - 1];
        navStack[navStack.length - 1] = _extends({}, topNav, {
          search: search
        });
        this.setState({ navStack: navStack });
      }
    },
    {
      key: "reset",
      value: function reset() {
        this.setState({ navStack: [initialNav] });
      }
    }
  ]);

  return DocExplorer;
})(_react2.default.Component));

DocExplorer.propTypes = {
  schema: _propTypes2.default.instanceOf(_graphql.GraphQLSchema)
};
