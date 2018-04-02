"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var HistoryQuery = function (_React$Component) {
  _inherits(HistoryQuery, _React$Component);

  function HistoryQuery(props) {
    _classCallCheck(this, HistoryQuery);

    var _this = _possibleConstructorReturn(this, (HistoryQuery.__proto__ || Object.getPrototypeOf(HistoryQuery)).call(this, props));

    var visibility = _this.props.pinned ? "visible" : "hidden";
    _this.state = { visibility: visibility };
    return _this;
  }

  _createClass(HistoryQuery, [{
    key: "render",
    value: function render() {
      if (this.props.pinned && this.state.visibility === "hidden") {
        this.setState({ visibility: "visible" });
      }
      var bmStyles = {
        float: "left",
        marginLeft: "7px",
        visibility: this.state.visibility
      };

      var binStyles = {
        float: "right",
        marginLeft: "7px",
        visibility: this.state.visibility
      };

      var displayName = this.props.operationName || this.props.query.split("\n").filter(function (line) {
        return line.indexOf("#") !== 0;
      }).join("");
      var bookmark = this.props.pinned ? "fa fa-bookmark" : "fa fa-bookmark-o";
      return _react2.default.createElement(
        "div",
        {
          className: "history-query",
          onClick: this.handleClick.bind(this),
          onMouseEnter: this.handleMouseEnter.bind(this),
          onMouseLeave: this.handleMouseLeave.bind(this)
        },
        _react2.default.createElement(
          "span",
          { onClick: this.handlePinClick.bind(this), style: bmStyles },
          _react2.default.createElement("i", { className: bookmark, "aria-hidden": "true" })
        ),
        _react2.default.createElement(
          "span",
          null,
          displayName
        )
      );
    }
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter() {
      if (!this.props.pinned) {
        this.setState({ visibility: "visible" });
      }
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave() {
      if (!this.props.pinned) {
        this.setState({ visibility: "hidden" });
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      this.props.onSelect(this.props.query, this.props.variables);
    }
  }, {
    key: "handlePinClick",
    value: function handlePinClick(e) {
      e.stopPropagation();
      this.props.handleTogglePinned(this.props.query, this.props.variables, this.props.operationName, this.props.pinned);
    }
  }]);

  return HistoryQuery;
}(_react2.default.Component);

HistoryQuery.propTypes = {
  pinned: _propTypes2.default.bool,
  favoriteSize: _propTypes2.default.number,
  handleTogglePinned: _propTypes2.default.func,
  operationName: _propTypes2.default.string,
  onSelect: _propTypes2.default.func,
  query: _propTypes2.default.string
};
exports.default = HistoryQuery;