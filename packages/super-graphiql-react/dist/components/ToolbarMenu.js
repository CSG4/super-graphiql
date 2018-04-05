"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.ToolbarMenuItem = ToolbarMenuItem;

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
 * ToolbarMenu
 *
 * A menu style button to use within the Toolbar.
 */
var ToolbarMenu = exports.ToolbarMenu = function (_React$Component) {
  _inherits(ToolbarMenu, _React$Component);

  function ToolbarMenu(props) {
    _classCallCheck(this, ToolbarMenu);

    var _this = _possibleConstructorReturn(this, (ToolbarMenu.__proto__ || Object.getPrototypeOf(ToolbarMenu)).call(this, props));

    _this.handleOpen = function (e) {
      preventDefault(e);
      _this.setState({ visible: true });
      _this._subscribe();
    };

    _this.state = { visible: false };
    return _this;
  }

  _createClass(ToolbarMenu, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._release();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var visible = this.state.visible;
      return _react2.default.createElement(
        "a",
        {
          className: "toolbar-menu toolbar-button",
          onClick: this.handleOpen.bind(this),
          onMouseDown: preventDefault,
          ref: function ref(node) {
            _this2._node = node;
          },
          title: this.props.title
        },
        this.props.label,
        _react2.default.createElement(
          "svg",
          { width: "14", height: "8" },
          _react2.default.createElement("path", { fill: "#666", d: "M 5 1.5 L 14 1.5 L 9.5 7 z" })
        ),
        _react2.default.createElement(
          "ul",
          { className: "toolbar-menu-items" + (visible ? " open" : "") },
          this.props.children
        )
      );
    }
  }, {
    key: "_subscribe",
    value: function _subscribe() {
      if (!this._listener) {
        this._listener = this.handleClick.bind(this);
        document.addEventListener("click", this._listener);
      }
    }
  }, {
    key: "_release",
    value: function _release() {
      if (this._listener) {
        document.removeEventListener("click", this._listener);
        this._listener = null;
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      if (this._node !== e.target) {
        preventDefault(e);
        this.setState({ visible: false });
        this._release();
      }
    }
  }]);

  return ToolbarMenu;
}(_react2.default.Component);

ToolbarMenu.propTypes = {
  title: _propTypes2.default.string,
  label: _propTypes2.default.string
};
function ToolbarMenuItem(_ref) {
  var onSelect = _ref.onSelect,
      title = _ref.title,
      label = _ref.label;

  return _react2.default.createElement(
    "li",
    {
      onMouseOver: function onMouseOver(e) {
        e.target.className = "hover";
      },
      onMouseOut: function onMouseOut(e) {
        e.target.className = null;
      },
      onMouseDown: preventDefault,
      onMouseUp: onSelect,
      title: title
    },
    label
  );
}

ToolbarMenuItem.propTypes = {
  onSelect: _propTypes2.default.func,
  title: _propTypes2.default.string,
  label: _propTypes2.default.string
};

function preventDefault(e) {
  e.preventDefault();
}