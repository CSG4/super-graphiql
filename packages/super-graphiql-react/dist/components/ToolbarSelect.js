"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarSelect = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.ToolbarSelectOption = ToolbarSelectOption;

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
 * ToolbarSelect
 *
 * A select-option style button to use within the Toolbar.
 *
 */

var ToolbarSelect = exports.ToolbarSelect = function (_React$Component) {
  _inherits(ToolbarSelect, _React$Component);

  function ToolbarSelect(props) {
    _classCallCheck(this, ToolbarSelect);

    var _this = _possibleConstructorReturn(this, (ToolbarSelect.__proto__ || Object.getPrototypeOf(ToolbarSelect)).call(this, props));

    _this.handleOpen = function (e) {
      preventDefault(e);
      _this.setState({ visible: true });
      _this._subscribe();
    };

    _this.state = { visible: false };
    return _this;
  }

  _createClass(ToolbarSelect, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._release();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var selectedChild = void 0;
      var visible = this.state.visible;
      var optionChildren = _react2.default.Children.map(this.props.children, function (child, i) {
        if (!selectedChild || child.props.selected) {
          selectedChild = child;
        }
        var onChildSelect = child.props.onSelect || _this2.props.onSelect && _this2.props.onSelect.bind(null, child.props.value, i);
        return _react2.default.createElement(ToolbarSelectOption, _extends({}, child.props, { onSelect: onChildSelect }));
      });
      return _react2.default.createElement(
        "a",
        {
          className: "toolbar-select toolbar-button",
          onClick: this.handleOpen.bind(this),
          onMouseDown: preventDefault,
          ref: function ref(node) {
            _this2._node = node;
          },
          title: this.props.title
        },
        selectedChild.props.label,
        _react2.default.createElement(
          "svg",
          { width: "13", height: "10" },
          _react2.default.createElement("path", { fill: "#666", d: "M 5 5 L 13 5 L 9 1 z" }),
          _react2.default.createElement("path", { fill: "#666", d: "M 5 6 L 13 6 L 9 10 z" })
        ),
        _react2.default.createElement(
          "ul",
          { className: "toolbar-select-options" + (visible ? " open" : "") },
          optionChildren
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

  return ToolbarSelect;
}(_react2.default.Component);

ToolbarSelect.propTypes = {
  title: _propTypes2.default.string,
  label: _propTypes2.default.string,
  onSelect: _propTypes2.default.func
};
function ToolbarSelectOption(_ref) {
  var onSelect = _ref.onSelect,
      label = _ref.label,
      selected = _ref.selected;

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
      onMouseUp: onSelect
    },
    label,
    selected && _react2.default.createElement(
      "svg",
      { width: "13", height: "13" },
      _react2.default.createElement("polygon", {
        points: "4.851,10.462 0,5.611 2.314,3.297 4.851,5.835 10.686,0 13,2.314 4.851,10.462"
      })
    )
  );
}

ToolbarSelectOption.propTypes = {
  onSelect: _propTypes2.default.func,
  selected: _propTypes2.default.bool,
  label: _propTypes2.default.string,
  value: _propTypes2.default.any
};

function preventDefault(e) {
  e.preventDefault();
}