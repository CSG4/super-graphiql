"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResultViewer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

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
 * ResultViewer
 *
 * Maintains an instance of CodeMirror for viewing a GraphQL response.
 *
 * Props:
 *
 *   - value: The text of the editor.
 *
 */
var ResultViewer = exports.ResultViewer = function (_React$Component) {
  _inherits(ResultViewer, _React$Component);

  function ResultViewer() {
    _classCallCheck(this, ResultViewer);

    return _possibleConstructorReturn(this, (ResultViewer.__proto__ || Object.getPrototypeOf(ResultViewer)).call(this));
  }

  _createClass(ResultViewer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // Lazily require to ensure requiring GraphiQL outside of a Browser context
      // does not produce an error.
      var CodeMirror = require("codemirror");
      require("codemirror/addon/fold/foldgutter");
      require("codemirror/addon/fold/brace-fold");
      require("codemirror/addon/dialog/dialog");
      require("codemirror/addon/search/search");
      require("codemirror/addon/search/searchcursor");
      require("codemirror/addon/search/jump-to-line");
      require("codemirror/keymap/sublime");
      require("codemirror-graphql/results/mode");

      if (this.props.ResultsTooltip) {
        require("codemirror-graphql/utils/info-addon");
        var tooltipDiv = document.createElement("div");
        CodeMirror.registerHelper("info", "graphql-results", function (token, options, cm, pos) {
          var Tooltip = _this2.props.ResultsTooltip;
          _reactDom2.default.render(_react2.default.createElement(Tooltip, { pos: pos }), tooltipDiv);
          return tooltipDiv;
        });
      }

      this.viewer = CodeMirror(this._node, {
        lineWrapping: true,
        value: this.props.value || "",
        readOnly: true,
        theme: this.props.editorTheme || "graphiql",
        mode: "graphql-results",
        keyMap: "sublime",
        foldGutter: {
          minFoldSize: 4
        },
        gutters: ["CodeMirror-foldgutter"],
        info: Boolean(this.props.ResultsTooltip),
        extraKeys: {
          // Persistent search box in Query Editor
          "Cmd-F": "findPersistent",
          "Ctrl-F": "findPersistent",

          // Editor improvements
          "Ctrl-Left": "goSubwordLeft",
          "Ctrl-Right": "goSubwordRight",
          "Alt-Left": "goGroupLeft",
          "Alt-Right": "goGroupRight"
        }
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.value !== nextProps.value;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.viewer.setValue(this.props.value || "");
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.viewer = null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement("div", {
        className: "result-window",
        ref: function ref(node) {
          _this3._node = node;
        }
      });
    }

    /**
     * Public API for retrieving the CodeMirror instance from this
     * React component.
     */

  }, {
    key: "getCodeMirror",
    value: function getCodeMirror() {
      return this.viewer;
    }

    /**
     * Public API for retrieving the DOM client height for this component.
     */

  }, {
    key: "getClientHeight",
    value: function getClientHeight() {
      return this._node && this._node.clientHeight;
    }
  }]);

  return ResultViewer;
}(_react2.default.Component);

ResultViewer.propTypes = {
  value: _propTypes2.default.string,
  editorTheme: _propTypes2.default.string,
  ResultsTooltip: _propTypes2.default.any
};