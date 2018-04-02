"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Argument = require("./Argument");

var _Argument2 = _interopRequireDefault(_Argument);

var _TypeLink = require("./TypeLink");

var _TypeLink2 = _interopRequireDefault(_TypeLink);

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

var SearchResults = function (_React$Component) {
  _inherits(SearchResults, _React$Component);

  function SearchResults() {
    _classCallCheck(this, SearchResults);

    return _possibleConstructorReturn(this, (SearchResults.__proto__ || Object.getPrototypeOf(SearchResults)).apply(this, arguments));
  }

  _createClass(SearchResults, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.schema !== nextProps.schema || this.props.searchValue !== nextProps.searchValue;
    }
  }, {
    key: "render",
    value: function render() {
      var searchValue = this.props.searchValue;
      var withinType = this.props.withinType;
      var schema = this.props.schema;
      var onClickType = this.props.onClickType;
      var onClickField = this.props.onClickField;

      var matchedWithin = [];
      var matchedTypes = [];
      var matchedFields = [];

      var typeMap = schema.getTypeMap();
      var typeNames = Object.keys(typeMap);

      // Move the within type name to be the first searched.
      if (withinType) {
        typeNames = typeNames.filter(function (n) {
          return n !== withinType.name;
        });
        typeNames.unshift(withinType.name);
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var typeName = _step.value;

          if (matchedWithin.length + matchedTypes.length + matchedFields.length >= 100) {
            return "break";
          }

          var type = typeMap[typeName];
          if (withinType !== type && isMatch(typeName, searchValue)) {
            matchedTypes.push(_react2.default.createElement(
              "div",
              { className: "doc-category-item", key: typeName },
              _react2.default.createElement(_TypeLink2.default, { type: type, onClick: onClickType })
            ));
          }

          if (type.getFields) {
            var fields = type.getFields();
            Object.keys(fields).forEach(function (fieldName) {
              var field = fields[fieldName];
              var matchingArgs = void 0;

              if (!isMatch(fieldName, searchValue)) {
                if (field.args && field.args.length) {
                  matchingArgs = field.args.filter(function (arg) {
                    return isMatch(arg.name, searchValue);
                  });
                  if (matchingArgs.length === 0) {
                    return;
                  }
                } else {
                  return;
                }
              }

              var match = _react2.default.createElement(
                "div",
                { className: "doc-category-item", key: typeName + "." + fieldName },
                withinType !== type && [_react2.default.createElement(_TypeLink2.default, { key: "type", type: type, onClick: onClickType }), "."],
                _react2.default.createElement(
                  "a",
                  {
                    className: "field-name",
                    onClick: function onClick(event) {
                      return onClickField(field, type, event);
                    }
                  },
                  field.name
                ),
                matchingArgs && ["(", _react2.default.createElement(
                  "span",
                  { key: "args" },
                  matchingArgs.map(function (arg) {
                    return _react2.default.createElement(_Argument2.default, {
                      key: arg.name,
                      arg: arg,
                      onClickType: onClickType,
                      showDefaultValue: false
                    });
                  })
                ), ")"]
              );

              if (withinType === type) {
                matchedWithin.push(match);
              } else {
                matchedFields.push(match);
              }
            });
          }
        };

        for (var _iterator = typeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

          if (_ret === "break") break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (matchedWithin.length + matchedTypes.length + matchedFields.length === 0) {
        return _react2.default.createElement(
          "span",
          { className: "doc-alert-text" },
          "No results found."
        );
      }

      if (withinType && matchedTypes.length + matchedFields.length > 0) {
        return _react2.default.createElement(
          "div",
          null,
          matchedWithin,
          _react2.default.createElement(
            "div",
            { className: "doc-category" },
            _react2.default.createElement(
              "div",
              { className: "doc-category-title" },
              "other results"
            ),
            matchedTypes,
            matchedFields
          )
        );
      }

      return _react2.default.createElement(
        "div",
        null,
        matchedWithin,
        matchedTypes,
        matchedFields
      );
    }
  }]);

  return SearchResults;
}(_react2.default.Component);

SearchResults.propTypes = {
  schema: _propTypes2.default.object,
  withinType: _propTypes2.default.object,
  searchValue: _propTypes2.default.string,
  onClickType: _propTypes2.default.func,
  onClickField: _propTypes2.default.func
};
exports.default = SearchResults;


function isMatch(sourceText, searchValue) {
  try {
    var escaped = searchValue.replace(/[^_0-9A-Za-z]/g, function (ch) {
      return "\\" + ch;
    });
    return sourceText.search(new RegExp(escaped, "i")) !== -1;
  } catch (e) {
    return sourceText.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
  }
}