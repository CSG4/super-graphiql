"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TypeLink = require("./TypeLink");

var _TypeLink2 = _interopRequireDefault(_TypeLink);

var _MarkdownContent = require("./MarkdownContent");

var _MarkdownContent2 = _interopRequireDefault(_MarkdownContent);

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

// Render the top level Schema
var SchemaDoc = function (_React$Component) {
  _inherits(SchemaDoc, _React$Component);

  function SchemaDoc() {
    _classCallCheck(this, SchemaDoc);

    return _possibleConstructorReturn(this, (SchemaDoc.__proto__ || Object.getPrototypeOf(SchemaDoc)).apply(this, arguments));
  }

  _createClass(SchemaDoc, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.schema !== nextProps.schema;
    }
  }, {
    key: "render",
    value: function render() {
      var schema = this.props.schema;
      var queryType = schema.getQueryType();
      var mutationType = schema.getMutationType && schema.getMutationType();
      var subscriptionType = schema.getSubscriptionType && schema.getSubscriptionType();

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_MarkdownContent2.default, {
          className: "doc-type-description",
          markdown: "A GraphQL schema provides a root type for each kind of operation."
        }),
        _react2.default.createElement(
          "div",
          { className: "doc-category" },
          _react2.default.createElement(
            "div",
            { className: "doc-category-title" },
            "root types"
          ),
          _react2.default.createElement(
            "div",
            { className: "doc-category-item" },
            _react2.default.createElement(
              "span",
              { className: "keyword" },
              "query"
            ),
            ": ",
            _react2.default.createElement(_TypeLink2.default, { type: queryType, onClick: this.props.onClickType })
          ),
          mutationType && _react2.default.createElement(
            "div",
            { className: "doc-category-item" },
            _react2.default.createElement(
              "span",
              { className: "keyword" },
              "mutation"
            ),
            ": ",
            _react2.default.createElement(_TypeLink2.default, { type: mutationType, onClick: this.props.onClickType })
          ),
          subscriptionType && _react2.default.createElement(
            "div",
            { className: "doc-category-item" },
            _react2.default.createElement(
              "span",
              { className: "keyword" },
              "subscription"
            ),
            ": ",
            _react2.default.createElement(_TypeLink2.default, {
              type: subscriptionType,
              onClick: this.props.onClickType
            })
          )
        )
      );
    }
  }]);

  return SchemaDoc;
}(_react2.default.Component);

SchemaDoc.propTypes = {
  schema: _propTypes2.default.object,
  onClickType: _propTypes2.default.func
};
exports.default = SchemaDoc;