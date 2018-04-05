"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphql = require("graphql");

var _Argument = require("./Argument");

var _Argument2 = _interopRequireDefault(_Argument);

var _MarkdownContent = require("./MarkdownContent");

var _MarkdownContent2 = _interopRequireDefault(_MarkdownContent);

var _TypeLink = require("./TypeLink");

var _TypeLink2 = _interopRequireDefault(_TypeLink);

var _DefaultValue = require("./DefaultValue");

var _DefaultValue2 = _interopRequireDefault(_DefaultValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Copyright (c) Facebook, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  This source code is licensed under the license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var TypeDoc = function (_React$Component) {
  _inherits(TypeDoc, _React$Component);

  function TypeDoc(props) {
    _classCallCheck(this, TypeDoc);

    var _this = _possibleConstructorReturn(this, (TypeDoc.__proto__ || Object.getPrototypeOf(TypeDoc)).call(this, props));

    _this.handleShowDeprecated = function () {
      return _this.setState({ showDeprecated: true });
    };

    _this.state = { showDeprecated: false };
    return _this;
  }

  _createClass(TypeDoc, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.type !== nextProps.type || this.props.schema !== nextProps.schema || this.state.showDeprecated !== nextState.showDeprecated;
    }
  }, {
    key: "render",
    value: function render() {
      var schema = this.props.schema;
      var type = this.props.type;
      var onClickType = this.props.onClickType;
      var onClickField = this.props.onClickField;

      var typesTitle = void 0;
      var types = void 0;
      if (type instanceof _graphql.GraphQLUnionType) {
        typesTitle = "possible types";
        types = schema.getPossibleTypes(type);
      } else if (type instanceof _graphql.GraphQLInterfaceType) {
        typesTitle = "implementations";
        types = schema.getPossibleTypes(type);
      } else if (type instanceof _graphql.GraphQLObjectType) {
        typesTitle = "implements";
        types = type.getInterfaces();
      }

      var typesDef = void 0;
      if (types && types.length > 0) {
        typesDef = _react2.default.createElement(
          "div",
          { className: "doc-category" },
          _react2.default.createElement(
            "div",
            { className: "doc-category-title" },
            typesTitle
          ),
          types.map(function (subtype) {
            return _react2.default.createElement(
              "div",
              { key: subtype.name, className: "doc-category-item" },
              _react2.default.createElement(_TypeLink2.default, { type: subtype, onClick: onClickType })
            );
          })
        );
      }

      // InputObject and Object
      var fieldsDef = void 0;
      var deprecatedFieldsDef = void 0;
      if (type.getFields) {
        var fieldMap = type.getFields();
        var fields = Object.keys(fieldMap).map(function (name) {
          return fieldMap[name];
        });
        fieldsDef = _react2.default.createElement(
          "div",
          { className: "doc-category" },
          _react2.default.createElement(
            "div",
            { className: "doc-category-title" },
            "fields"
          ),
          fields.filter(function (field) {
            return !field.isDeprecated;
          }).map(function (field) {
            return _react2.default.createElement(Field, {
              key: field.name,
              type: type,
              field: field,
              onClickType: onClickType,
              onClickField: onClickField
            });
          })
        );

        var deprecatedFields = fields.filter(function (field) {
          return field.isDeprecated;
        });
        if (deprecatedFields.length > 0) {
          deprecatedFieldsDef = _react2.default.createElement(
            "div",
            { className: "doc-category" },
            _react2.default.createElement(
              "div",
              { className: "doc-category-title" },
              "deprecated fields"
            ),
            !this.state.showDeprecated ? _react2.default.createElement(
              "button",
              { className: "show-btn", onClick: this.handleShowDeprecated },
              "Show deprecated fields..."
            ) : deprecatedFields.map(function (field) {
              return _react2.default.createElement(Field, {
                key: field.name,
                type: type,
                field: field,
                onClickType: onClickType,
                onClickField: onClickField
              });
            })
          );
        }
      }

      var valuesDef = void 0;
      var deprecatedValuesDef = void 0;
      if (type instanceof _graphql.GraphQLEnumType) {
        var values = type.getValues();
        valuesDef = _react2.default.createElement(
          "div",
          { className: "doc-category" },
          _react2.default.createElement(
            "div",
            { className: "doc-category-title" },
            "values"
          ),
          values.filter(function (value) {
            return !value.isDeprecated;
          }).map(function (value) {
            return _react2.default.createElement(EnumValue, { key: value.name, value: value });
          })
        );

        var deprecatedValues = values.filter(function (value) {
          return value.isDeprecated;
        });
        if (deprecatedValues.length > 0) {
          deprecatedValuesDef = _react2.default.createElement(
            "div",
            { className: "doc-category" },
            _react2.default.createElement(
              "div",
              { className: "doc-category-title" },
              "deprecated values"
            ),
            !this.state.showDeprecated ? _react2.default.createElement(
              "button",
              { className: "show-btn", onClick: this.handleShowDeprecated },
              "Show deprecated values..."
            ) : deprecatedValues.map(function (value) {
              return _react2.default.createElement(EnumValue, { key: value.name, value: value });
            })
          );
        }
      }

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_MarkdownContent2.default, {
          className: "doc-type-description",
          markdown: type.description || "No Description"
        }),
        type instanceof _graphql.GraphQLObjectType && typesDef,
        fieldsDef,
        deprecatedFieldsDef,
        valuesDef,
        deprecatedValuesDef,
        !(type instanceof _graphql.GraphQLObjectType) && typesDef
      );
    }
  }]);

  return TypeDoc;
}(_react2.default.Component);

TypeDoc.propTypes = {
  schema: _propTypes2.default.instanceOf(_graphql.GraphQLSchema),
  type: _propTypes2.default.object,
  onClickType: _propTypes2.default.func,
  onClickField: _propTypes2.default.func
};
exports.default = TypeDoc;


function Field(_ref) {
  var type = _ref.type,
      field = _ref.field,
      onClickType = _ref.onClickType,
      onClickField = _ref.onClickField;

  return _react2.default.createElement(
    "div",
    { className: "doc-category-item" },
    _react2.default.createElement(
      "a",
      {
        className: "field-name",
        onClick: function onClick(event) {
          return onClickField(field, type, event);
        }
      },
      field.name
    ),
    field.args && field.args.length > 0 && ["(", _react2.default.createElement(
      "span",
      { key: "args" },
      field.args.map(function (arg) {
        return _react2.default.createElement(_Argument2.default, { key: arg.name, arg: arg, onClickType: onClickType });
      })
    ), ")"],
    ": ",
    _react2.default.createElement(_TypeLink2.default, { type: field.type, onClick: onClickType }),
    _react2.default.createElement(_DefaultValue2.default, { field: field }),
    field.description && _react2.default.createElement(_MarkdownContent2.default, {
      className: "field-short-description",
      markdown: field.description
    }),
    field.deprecationReason && _react2.default.createElement(_MarkdownContent2.default, {
      className: "doc-deprecation",
      markdown: field.deprecationReason
    })
  );
}

Field.propTypes = {
  type: _propTypes2.default.object,
  field: _propTypes2.default.object,
  onClickType: _propTypes2.default.func,
  onClickField: _propTypes2.default.func
};

function EnumValue(_ref2) {
  var value = _ref2.value;

  return _react2.default.createElement(
    "div",
    { className: "doc-category-item" },
    _react2.default.createElement(
      "div",
      { className: "enum-value" },
      value.name
    ),
    _react2.default.createElement(_MarkdownContent2.default, {
      className: "doc-value-description",
      markdown: value.description
    }),
    value.deprecationReason && _react2.default.createElement(_MarkdownContent2.default, {
      className: "doc-deprecation",
      markdown: value.deprecationReason
    })
  );
}

EnumValue.propTypes = {
  value: _propTypes2.default.object
};