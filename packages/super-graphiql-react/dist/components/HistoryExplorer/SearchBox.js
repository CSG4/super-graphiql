"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _debounce = require("../../utility/debounce");

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBox = function (_React$Component) {
  _inherits(SearchBox, _React$Component);

  function SearchBox(props) {
    _classCallCheck(this, SearchBox);

    var _this = _possibleConstructorReturn(this, (SearchBox.__proto__ || Object.getPrototypeOf(SearchBox)).call(this, props));

    _this.handleChange = function (event) {
      var value = event.target.value;
      _this.setState({ value: value });
      _this.debouncedOnSearch(value);
    };

    _this.handleClear = function () {
      _this.setState({ value: "" });
      _this.props.onSearch("");
    };

    _this.state = { value: props.value || "" };
    _this.debouncedOnSearch = (0, _debounce2.default)(200, _this.props.onSearch);
    return _this;
  }

  _createClass(SearchBox, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "label",
        { className: "search-box" },
        _react2.default.createElement("input", {
          value: this.state.value,
          onChange: this.handleChange,
          type: "text",
          placeholder: this.props.placeholder
        }),
        this.state.value && _react2.default.createElement(
          "div",
          { className: "search-box-clear", onClick: this.handleClear },
          "\u2715"
        )
      );
    }
  }]);

  return SearchBox;
}(_react2.default.Component);

SearchBox.propTypes = {
  value: _propTypes2.default.string,
  placeholder: _propTypes2.default.string,
  onSearch: _propTypes2.default.func
};
exports.default = SearchBox;