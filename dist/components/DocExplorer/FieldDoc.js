"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _Argument = require("./Argument");

var _Argument2 = _interopRequireDefault(_Argument);

var _MarkdownContent = require("./MarkdownContent");

var _MarkdownContent2 = _interopRequireDefault(_MarkdownContent);

var _TypeLink = require("./TypeLink");

var _TypeLink2 = _interopRequireDefault(_TypeLink);

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

var FieldDoc = (function(_React$Component) {
  _inherits(FieldDoc, _React$Component);

  function FieldDoc() {
    _classCallCheck(this, FieldDoc);

    return _possibleConstructorReturn(
      this,
      (FieldDoc.__proto__ || Object.getPrototypeOf(FieldDoc)).apply(
        this,
        arguments
      )
    );
  }

  _createClass(FieldDoc, [
    {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
      }
    },
    {
      key: "render",
      value: function render() {
        var _this2 = this;

        var field = this.props.field;

        var argsDef = void 0;
        if (field.args && field.args.length > 0) {
          argsDef = _react2.default.createElement(
            "div",
            { className: "doc-category" },
            _react2.default.createElement(
              "div",
              { className: "doc-category-title" },
              "arguments"
            ),
            field.args.map(function(arg) {
              return _react2.default.createElement(
                "div",
                { key: arg.name, className: "doc-category-item" },
                _react2.default.createElement(
                  "div",
                  null,
                  _react2.default.createElement(_Argument2.default, {
                    arg: arg,
                    onClickType: _this2.props.onClickType
                  })
                ),
                _react2.default.createElement(_MarkdownContent2.default, {
                  className: "doc-value-description",
                  markdown: arg.description
                })
              );
            })
          );
        }

        return _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(_MarkdownContent2.default, {
            className: "doc-type-description",
            markdown: field.description || "No Description"
          }),
          field.deprecationReason &&
            _react2.default.createElement(_MarkdownContent2.default, {
              className: "doc-deprecation",
              markdown: field.deprecationReason
            }),
          _react2.default.createElement(
            "div",
            { className: "doc-category" },
            _react2.default.createElement(
              "div",
              { className: "doc-category-title" },
              "type"
            ),
            _react2.default.createElement(_TypeLink2.default, {
              type: field.type,
              onClick: this.props.onClickType
            })
          ),
          argsDef
        );
      }
    }
  ]);

  return FieldDoc;
})(_react2.default.Component);

FieldDoc.propTypes = {
  field: _propTypes2.default.object,
  onClickType: _propTypes2.default.func
};
exports.default = FieldDoc;
