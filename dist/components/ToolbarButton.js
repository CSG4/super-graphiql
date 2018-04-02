"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

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

/**
 * ToolbarButton
 *
 * A button to use within the Toolbar.
 */
var ToolbarButton = exports.ToolbarButton = function (_React$Component) {
  _inherits(ToolbarButton, _React$Component);

  function ToolbarButton(props) {
    _classCallCheck(this, ToolbarButton);

    var _this = _possibleConstructorReturn(this, (ToolbarButton.__proto__ || Object.getPrototypeOf(ToolbarButton)).call(this, props));

    _this.handleClick = function (e) {
      e.preventDefault();
      try {
        _this.props.onClick();
        _this.setState({ error: null });
      } catch (error) {
        _this.setState({ error: error });
      }
    };

    _this.state = { error: null };
    return _this;
  }

  _createClass(ToolbarButton, [{
    key: "render",
    value: function render() {
      var error = this.state.error;

      return _react2.default.createElement(
        "a",
        {
          className: "toolbar-button" + (error ? " error" : "") + (this.props.label === "Schema" ? " schema-button" : ""),
          onMouseDown: preventDefault,
          onClick: this.handleClick,
          title: error ? error.message : this.props.title
        },
        this.props.label
      );
    }
  }]);

  return ToolbarButton;
}(_react2.default.Component);

ToolbarButton.propTypes = {
  onClick: _propTypes2.default.func,
  title: _propTypes2.default.string,
  label: _propTypes2.default.string
};


function preventDefault(e) {
  e.preventDefault();
}