"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryEditor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _graphql = require("graphql");

var _markdownIt = require("markdown-it");

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _normalizeWhitespace = require("../utility/normalizeWhitespace");

var _onHasCompletion = require("../utility/onHasCompletion");

var _onHasCompletion2 = _interopRequireDefault(_onHasCompletion);

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

var md = new _markdownIt2.default();
var AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

/**
 * QueryEditor
 *
 * Maintains an instance of CodeMirror responsible for editing a GraphQL query.
 *
 * Props:
 *
 *   - schema: A GraphQLSchema instance enabling editor linting and hinting.
 *   - value: The text of the editor.
 *   - onEdit: A function called when the editor changes, given the edited text.
 *   - readOnly: Turns the editor to read-only mode.
 *
 */

var QueryEditor = exports.QueryEditor = function (_React$Component) {
  _inherits(QueryEditor, _React$Component);

  function QueryEditor(props) {
    _classCallCheck(this, QueryEditor);

    // Keep a cached version of the value, this cache will be updated when the
    // editor is updated, which can later be used to protect the editor from
    // unnecessary updates during the update lifecycle.
    var _this = _possibleConstructorReturn(this, (QueryEditor.__proto__ || Object.getPrototypeOf(QueryEditor)).call(this));

    _this._onKeyUp = function (cm, event) {
      if (AUTO_COMPLETE_AFTER_KEY.test(event.key)) {
        _this.editor.execCommand("autocomplete");
      }
    };

    _this._onEdit = function () {
      if (!_this.ignoreChangeEvent) {
        _this.cachedValue = _this.editor.getValue();
        if (_this.props.onEdit) {
          _this.props.onEdit(_this.cachedValue, _this.props.editorId);
        }
      }
    };

    _this._onHasCompletion = function (cm, data) {
      (0, _onHasCompletion2.default)(cm, data, _this.props.onHintInformationRender);
    };

    _this.cachedValue = props.value || "";
    return _this;
  }

  _createClass(QueryEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // Lazily require to ensure requiring SuperGraphiQL outside of a Browser context
      // does not produce an error.
      var CodeMirror = require("codemirror");
      require("codemirror/addon/hint/show-hint");
      require("codemirror/addon/comment/comment");
      require("codemirror/addon/edit/matchbrackets");
      require("codemirror/addon/edit/closebrackets");
      require("codemirror/addon/fold/foldgutter");
      require("codemirror/addon/fold/brace-fold");
      require("codemirror/addon/search/search");
      require("codemirror/addon/search/searchcursor");
      require("codemirror/addon/search/jump-to-line");
      require("codemirror/addon/dialog/dialog");
      require("codemirror/addon/lint/lint");
      require("codemirror/keymap/sublime");
      require("codemirror-graphql/hint");
      require("codemirror-graphql/lint");
      require("codemirror-graphql/info");
      require("codemirror-graphql/jump");
      require("codemirror-graphql/mode"); // specify language

      this.editor = CodeMirror(this._node, {
        value: this.cachedValue,
        lineNumbers: true,
        tabSize: 2,
        mode: "graphql",
        theme: this.props.editorTheme || "graphiql",
        keyMap: "sublime",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        readOnly: this.props.readOnly ? "nocursor" : false,
        foldGutter: {
          minFoldSize: 4
        },
        lint: {
          schema: this.props.schema
        },
        hintOptions: {
          schema: this.props.schema,
          closeOnUnfocus: false,
          completeSingle: false
        },
        info: {
          schema: this.props.schema,
          renderDescription: function renderDescription(text) {
            return md.render(text);
          },
          onClick: function onClick(reference) {
            return _this2.props.onClickReference(reference);
          }
        },
        jump: {
          schema: this.props.schema,
          onClick: function onClick(reference) {
            return _this2.props.onClickReference(reference);
          }
        },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
          "Cmd-Space": function CmdSpace() {
            return _this2.editor.showHint({ completeSingle: true });
          },
          "Ctrl-Space": function CtrlSpace() {
            return _this2.editor.showHint({ completeSingle: true });
          },
          "Alt-Space": function AltSpace() {
            return _this2.editor.showHint({ completeSingle: true });
          },
          "Shift-Space": function ShiftSpace() {
            return _this2.editor.showHint({ completeSingle: true });
          },

          "Cmd-Enter": function CmdEnter() {
            if (_this2.props.onRunQuery) {
              _this2.props.onRunQuery();
            }
          },
          "Ctrl-Enter": function CtrlEnter() {
            if (_this2.props.onRunQuery) {
              _this2.props.onRunQuery();
            }
          },

          "Shift-Ctrl-P": function ShiftCtrlP() {
            if (_this2.props.onPrettifyQuery) {
              _this2.props.onPrettifyQuery();
            }
          },

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

      this.editor.on("change", this._onEdit);
      this.editor.on("keyup", this._onKeyUp);
      this.editor.on("hasCompletion", this._onHasCompletion);
      this.editor.on("beforeChange", this._onBeforeChange);
      this.editor.on("cursorActivity", this._onEdit);

      if (!this.props.checked) {
        document.getElementById("checkbox_" + this.props.editorId).checked = false;
      }

      this.manageHintsBox();
      this.setFocus();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var CodeMirror = require("codemirror");

      // Ensure the changes caused by this update are not interpretted as
      // user-input changes which could otherwise result in an infinite
      // event loop.
      this.ignoreChangeEvent = true;
      if (this.props.schema !== prevProps.schema) {
        this.editor.options.lint.schema = this.props.schema;
        this.editor.options.hintOptions.schema = this.props.schema;
        this.editor.options.info.schema = this.props.schema;
        this.editor.options.jump.schema = this.props.schema;
        CodeMirror.signal(this.editor, "change", this.editor);
      }
      if (this.props.value !== prevProps.value && this.props.value !== this.cachedValue) {
        this.cachedValue = this.props.value;
        this.editor.setValue(this.props.value);
      }
      this.ignoreChangeEvent = false;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setFocus(1);

      this.editor.off("change", this._onEdit);
      this.editor.off("keyup", this._onKeyUp);
      this.editor.off("hasCompletion", this._onHasCompletion);
      this.editor = null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        "div",
        { className: "query-editor-container" },
        _react2.default.createElement(
          "div",
          {
            className: "query-editor",
            id: this.props.editorId,
            ref: function ref(node) {
              _this3._node = node;
            }
          },
          _react2.default.createElement(
            "div",
            { className: "query-editor-top-actions" },
            _react2.default.createElement(
              "label",
              { className: "checkbox-container" },
              _react2.default.createElement("input", {
                type: "checkbox",
                defaultChecked: true,
                className: "run-query-check",
                id: "checkbox_" + this.props.editorId,
                value: "select",
                title: "Select",
                onChange: function onChange(e) {
                  _this3.props.onCheckToRun(_this3.props.editorId, e.target.checked);
                }
              }),
              _react2.default.createElement("span", { className: "checkmark" })
            ),
            _react2.default.createElement(
              "button",
              {
                title: "Delete",
                className: "action-button delete-query",
                id: this.props.editorId,
                onClick: function onClick() {
                  _this3.props.onClickDeleteButton(_this3.props.editorId);
                }
              },
              _react2.default.createElement("i", { className: "fa fa-trash", "aria-hidden": "true" })
            )
          )
        ),
        _react2.default.createElement(
          "button",
          {
            title: "Add",
            className: "action-button add-query",
            onClick: function onClick() {
              _this3.props.onAddNewQueryEditor();
            }
          },
          _react2.default.createElement("i", { className: "fa fa-plus", "aria-hidden": "true" })
        )
      );
    }
  }, {
    key: "setFocus",
    value: function setFocus(action) {
      var textAreas = document.getElementsByTagName("textarea");
      if (textAreas.length === 1 || action === 1) {
        textAreas[0].focus();
      } else if (textAreas[textAreas.length - 3] !== undefined) {
        textAreas[textAreas.length - 3].focus();
      }
    }
  }, {
    key: "manageHintsBox",
    value: function manageHintsBox() {
      var _this4 = this;

      var currentEditor = document.getElementById(this.props.editorId);
      if (currentEditor) {
        currentEditor.addEventListener("click", function () {
          if (_this4.props.value.trim() && _this4.editor.getCursor().ch === _this4.props.value.length) {
            _this4.editor.execCommand("autocomplete");
          }
        });
        currentEditor.addEventListener("focusout", function () {
          var openHints = document.getElementsByClassName("CodeMirror-hints");
          if (openHints[0]) {
            setTimeout(function () {
              if (openHints[0]) openHints[0].remove();
            }, 200);
          }
        });
      }
    }

    /**
     * Public API for retrieving the CodeMirror instance from this
     * React component.
     */

  }, {
    key: "getCodeMirror",
    value: function getCodeMirror() {
      return this.editor;
    }

    /**
     * Public API for retrieving the DOM client height for this component.
     */

  }, {
    key: "getClientHeight",
    value: function getClientHeight() {
      return this._node && this._node.clientHeight;
    }

    /**
     * Render a custom UI for CodeMirror's hint which includes additional info
     * about the type and description for the selected context.
     */

  }, {
    key: "_onBeforeChange",
    value: function _onBeforeChange(instance, change) {
      // The update function is only present on non-redo, non-undo events.
      if (change.origin === "paste") {
        var text = change.text.map(_normalizeWhitespace.normalizeWhitespace);
        change.update(change.from, change.to, text);
      }
    }
  }]);

  return QueryEditor;
}(_react2.default.Component);

QueryEditor.propTypes = {
  schema: _propTypes2.default.instanceOf(_graphql.GraphQLSchema),
  editorId: _propTypes2.default.number,
  value: _propTypes2.default.string,
  checked: _propTypes2.default.bool,
  onEdit: _propTypes2.default.func,
  readOnly: _propTypes2.default.bool,
  onCheckToRun: _propTypes2.default.func,
  onHintInformationRender: _propTypes2.default.func,
  onClickReference: _propTypes2.default.func,
  onClickDeleteButton: _propTypes2.default.func,
  onPrettifyQuery: _propTypes2.default.func,
  onRunQuery: _propTypes2.default.func,
  editorTheme: _propTypes2.default.string,
  onAddNewQueryEditor: _propTypes2.default.func
};