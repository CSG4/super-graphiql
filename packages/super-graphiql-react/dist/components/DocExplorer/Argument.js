"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Argument;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TypeLink = require("./TypeLink");

var _TypeLink2 = _interopRequireDefault(_TypeLink);

var _DefaultValue = require("./DefaultValue");

var _DefaultValue2 = _interopRequireDefault(_DefaultValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

function Argument(_ref) {
  var arg = _ref.arg,
      onClickType = _ref.onClickType,
      showDefaultValue = _ref.showDefaultValue;

  return _react2.default.createElement(
    "span",
    { className: "arg" },
    _react2.default.createElement(
      "span",
      { className: "arg-name" },
      arg.name
    ),
    ": ",
    _react2.default.createElement(_TypeLink2.default, { type: arg.type, onClick: onClickType }),
    showDefaultValue !== false && _react2.default.createElement(_DefaultValue2.default, { field: arg })
  );
}

Argument.propTypes = {
  arg: _propTypes2.default.object.isRequired,
  onClickType: _propTypes2.default.func.isRequired,
  showDefaultValue: _propTypes2.default.bool
};