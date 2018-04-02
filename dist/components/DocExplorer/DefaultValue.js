"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DefaultValue;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DefaultValue(_ref) {
  var field = _ref.field;
  var type = field.type,
      defaultValue = field.defaultValue;

  if (defaultValue !== undefined) {
    return _react2.default.createElement(
      "span",
      null,
      " = ",
      _react2.default.createElement(
        "span",
        { className: "arg-default-value" },
        (0, _graphql.print)((0, _graphql.astFromValue)(defaultValue, type))
      )
    );
  }

  return null;
} /**
   *  Copyright (c) Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the license found in the
   *  LICENSE file in the root directory of this source tree.
   */

DefaultValue.propTypes = {
  field: _propTypes2.default.object.isRequired
};