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

var _markdownIt = require("markdown-it");

var _markdownIt2 = _interopRequireDefault(_markdownIt);

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

var md = new _markdownIt2.default();

var MarkdownContent = (function(_React$Component) {
  _inherits(MarkdownContent, _React$Component);

  function MarkdownContent() {
    _classCallCheck(this, MarkdownContent);

    return _possibleConstructorReturn(
      this,
      (
        MarkdownContent.__proto__ || Object.getPrototypeOf(MarkdownContent)
      ).apply(this, arguments)
    );
  }

  _createClass(MarkdownContent, [
    {
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate(nextProps) {
        return this.props.markdown !== nextProps.markdown;
      }
    },
    {
      key: "render",
      value: function render() {
        var markdown = this.props.markdown;
        if (!markdown) {
          return _react2.default.createElement("div", null);
        }

        return _react2.default.createElement("div", {
          className: this.props.className,
          dangerouslySetInnerHTML: { __html: md.render(markdown) }
        });
      }
    }
  ]);

  return MarkdownContent;
})(_react2.default.Component);

MarkdownContent.propTypes = {
  markdown: _propTypes2.default.string,
  className: _propTypes2.default.string
};
exports.default = MarkdownContent;
