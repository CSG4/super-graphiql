"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphiQL = undefined;

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _graphql = require("graphql");

var _ExecuteButton = require("./ExecuteButton");

var _ToolbarButton = require("./ToolbarButton");

var _ToolbarGroup = require("./ToolbarGroup");

var _ToolbarMenu = require("./ToolbarMenu");

var _ToolbarSelect = require("./ToolbarSelect");

var _QueryEditor = require("./QueryEditor");

var _VariableEditor = require("./VariableEditor");

var _ResultViewer = require("./ResultViewer");

var _DocExplorer = require("./DocExplorer");

var _QueryHistory = require("./QueryHistory");

var _CodeMirrorSizer = require("../utility/CodeMirrorSizer");

var _CodeMirrorSizer2 = _interopRequireDefault(_CodeMirrorSizer);

var _StorageAPI = require("../utility/StorageAPI");

var _StorageAPI2 = _interopRequireDefault(_StorageAPI);

var _getQueryFacts = require("../utility/getQueryFacts");

var _getQueryFacts2 = _interopRequireDefault(_getQueryFacts);

var _getSelectedOperationName = require("../utility/getSelectedOperationName");

var _getSelectedOperationName2 = _interopRequireDefault(
  _getSelectedOperationName
);

var _debounce = require("../utility/debounce");

var _debounce2 = _interopRequireDefault(_debounce);

var _find = require("../utility/find");

var _find2 = _interopRequireDefault(_find);

var _fillLeafs2 = require("../utility/fillLeafs");

var _elementPosition = require("../utility/elementPosition");

var _introspectionQueries = require("../utility/introspectionQueries");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
} /**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var DEFAULT_DOC_EXPLORER_WIDTH = 350;

/**
 * The top-level React component for GraphiQL, intended to encompass the entire
 * browser viewport.
 *
 * @see https://github.com/graphql/graphiql#usage
 */

var GraphiQL = (exports.GraphiQL = (function(_React$Component) {
  _inherits(GraphiQL, _React$Component);

  function GraphiQL(props) {
    _classCallCheck(this, GraphiQL);

    // Ensure props are correct
    var _this = _possibleConstructorReturn(
      this,
      (GraphiQL.__proto__ || Object.getPrototypeOf(GraphiQL)).call(this, props)
    );

    _initialiseProps.call(_this);

    if (typeof props.fetcher !== "function") {
      throw new TypeError("GraphiQL requires a fetcher function.");
    }

    // Cache the storage instance
    _this._storage = new _StorageAPI2.default(props.storage);

    // Determine the initial query to display.
    var query =
      props.query !== undefined
        ? props.query
        : _this._storage.get("query") !== null
          ? _this._storage.get("query")
          : props.defaultQuery !== undefined
            ? props.defaultQuery
            : defaultQuery;

    // Get the initial query facts.
    var queryFacts = (0, _getQueryFacts2.default)(props.schema, query);

    // Determine the initial variables to display.
    var variables =
      props.variables !== undefined
        ? props.variables
        : _this._storage.get("variables");

    // Determine the initial operationName to use.
    var operationName =
      props.operationName !== undefined
        ? props.operationName
        : (0, _getSelectedOperationName2.default)(
            null,
            _this._storage.get("operationName"),
            queryFacts && queryFacts.operations
          );

    // Initialize state
    _this.state = _extends(
      {
        schema: props.schema,
        query: query,
        variables: variables,
        operationName: operationName,
        response: props.response,
        editorFlex: Number(_this._storage.get("editorFlex")) || 1,
        variableEditorOpen: Boolean(variables),
        variableEditorHeight:
          Number(_this._storage.get("variableEditorHeight")) || 200,
        docExplorerOpen:
          _this._storage.get("docExplorerOpen") === "true" || false,
        historyPaneOpen:
          _this._storage.get("historyPaneOpen") === "true" || false,
        docExplorerWidth:
          Number(_this._storage.get("docExplorerWidth")) ||
          DEFAULT_DOC_EXPLORER_WIDTH,
        isWaitingForResponse: false,
        subscription: null
      },
      queryFacts
    );

    // Ensure only the last executed editor query is rendered.
    _this._editorQueryID = 0;

    // Subscribe to the browser window closing, treating it as an unmount.
    if (
      (typeof window === "undefined" ? "undefined" : _typeof(window)) ===
      "object"
    ) {
      window.addEventListener("beforeunload", function() {
        return _this.componentWillUnmount();
      });
    }
    return _this;
  }

  _createClass(GraphiQL, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        // Only fetch schema via introspection if a schema has not been
        // provided, including if `null` was provided.
        if (this.state.schema === undefined) {
          this._fetchSchema();
        }

        // Utility for keeping CodeMirror correctly sized.
        this.codeMirrorSizer = new _CodeMirrorSizer2.default();

        global.g = this;
      }
    },
    {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        var nextSchema = this.state.schema;
        var nextQuery = this.state.query;
        var nextVariables = this.state.variables;
        var nextOperationName = this.state.operationName;
        var nextResponse = this.state.response;

        if (nextProps.schema !== undefined) {
          nextSchema = nextProps.schema;
        }
        if (nextProps.query !== undefined) {
          nextQuery = nextProps.query;
        }
        if (nextProps.variables !== undefined) {
          nextVariables = nextProps.variables;
        }
        if (nextProps.operationName !== undefined) {
          nextOperationName = nextProps.operationName;
        }
        if (nextProps.response !== undefined) {
          nextResponse = nextProps.response;
        }
        if (
          nextSchema !== this.state.schema ||
          nextQuery !== this.state.query ||
          nextOperationName !== this.state.operationName
        ) {
          var updatedQueryAttributes = this._updateQueryFacts(
            nextQuery,
            nextOperationName,
            this.state.operations,
            nextSchema
          );

          if (updatedQueryAttributes !== undefined) {
            nextOperationName = updatedQueryAttributes.operationName;

            this.setState(updatedQueryAttributes);
          }
        }

        // If schema is not supplied via props and the fetcher changed, then
        // remove the schema so fetchSchema() will be called with the new fetcher.
        if (
          nextProps.schema === undefined &&
          nextProps.fetcher !== this.props.fetcher
        ) {
          nextSchema = undefined;
        }

        this.setState(
          {
            schema: nextSchema,
            query: nextQuery,
            variables: nextVariables,
            operationName: nextOperationName,
            response: nextResponse
          },
          function() {
            if (_this2.state.schema === undefined) {
              _this2.docExplorerComponent.reset();
              _this2._fetchSchema();
            }
          }
        );
      }
    },
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        // If this update caused DOM nodes to have changed sizes, update the
        // corresponding CodeMirror instance sizes to match.
        this.codeMirrorSizer.updateSizes([
          this.queryEditorComponent,
          this.variableEditorComponent,
          this.resultComponent
        ]);
      }

      // When the component is about to unmount, store any persistable state, such
      // that when the component is remounted, it will use the last used values.
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this._storage.set("query", this.state.query);
        this._storage.set("variables", this.state.variables);
        this._storage.set("operationName", this.state.operationName);
        this._storage.set("editorFlex", this.state.editorFlex);
        this._storage.set(
          "variableEditorHeight",
          this.state.variableEditorHeight
        );
        this._storage.set("docExplorerWidth", this.state.docExplorerWidth);
        this._storage.set("docExplorerOpen", this.state.docExplorerOpen);
        this._storage.set("historyPaneOpen", this.state.historyPaneOpen);
      }
    },
    {
      key: "render",
      value: function render() {
        var _this3 = this;

        var children = _react2.default.Children.toArray(this.props.children);

        var logo =
          (0, _find2.default)(children, function(child) {
            return child.type === GraphiQL.Logo;
          }) || _react2.default.createElement(GraphiQL.Logo, null);

        var toolbar =
          (0, _find2.default)(children, function(child) {
            return child.type === GraphiQL.Toolbar;
          }) ||
          _react2.default.createElement(
            GraphiQL.Toolbar,
            null,
            _react2.default.createElement(_ToolbarButton.ToolbarButton, {
              onClick: this.handlePrettifyQuery,
              title: "Prettify Query (Shift-Ctrl-P)",
              label: "Prettify"
            }),
            _react2.default.createElement(_ToolbarButton.ToolbarButton, {
              onClick: this.handleToggleHistory,
              title: "Show History",
              label: "History"
            })
          );

        var footer = (0, _find2.default)(children, function(child) {
          return child.type === GraphiQL.Footer;
        });

        var queryWrapStyle = {
          WebkitFlex: this.state.editorFlex,
          flex: this.state.editorFlex
        };

        var docWrapStyle = {
          display: this.state.docExplorerOpen ? "block" : "none",
          width: this.state.docExplorerWidth
        };
        var docExplorerWrapClasses =
          "docExplorerWrap" +
          (this.state.docExplorerWidth < 200 ? " doc-explorer-narrow" : "");

        var historyPaneStyle = {
          display: this.state.historyPaneOpen ? "block" : "none",
          width: "230px",
          zIndex: "7"
        };

        var variableOpen = this.state.variableEditorOpen;
        var variableStyle = {
          height: variableOpen ? this.state.variableEditorHeight : null
        };

        return _react2.default.createElement(
          "div",
          { className: "graphiql-container" },
          _react2.default.createElement(
            "div",
            { className: "historyPaneWrap", style: historyPaneStyle },
            _react2.default.createElement(
              _QueryHistory.QueryHistory,
              {
                operationName: this.state.operationName,
                query: this.state.query,
                variables: this.state.variables,
                onSelectQuery: this.handleSelectHistoryQuery,
                storage: this._storage,
                queryID: this._editorQueryID
              },
              _react2.default.createElement(
                "div",
                {
                  className: "docExplorerHide",
                  onClick: this.handleToggleHistory
                },
                "\u2715"
              )
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "editorWrap" },
            _react2.default.createElement(
              "div",
              { className: "topBarWrap" },
              _react2.default.createElement(
                "div",
                { className: "topBar" },
                logo,
                _react2.default.createElement(_ExecuteButton.ExecuteButton, {
                  isRunning: Boolean(this.state.subscription),
                  onRun: this.handleRunQuery,
                  onStop: this.handleStopQuery,
                  operations: this.state.operations
                }),
                toolbar
              ),
              !this.state.docExplorerOpen &&
                _react2.default.createElement(
                  "button",
                  {
                    className: "docExplorerShow",
                    onClick: this.handleToggleDocs
                  },
                  "Docs"
                )
            ),
            _react2.default.createElement(
              "div",
              {
                ref: function ref(n) {
                  _this3.editorBarComponent = n;
                },
                className: "editorBar",
                onDoubleClick: this.handleResetResize,
                onMouseDown: this.handleResizeStart
              },
              _react2.default.createElement(
                "div",
                { className: "queryWrap", style: queryWrapStyle },
                _react2.default.createElement(_QueryEditor.QueryEditor, {
                  ref: function ref(n) {
                    _this3.queryEditorComponent = n;
                  },
                  schema: this.state.schema,
                  value: this.state.query,
                  onEdit: this.handleEditQuery,
                  onHintInformationRender: this.handleHintInformationRender,
                  onClickReference: this.handleClickReference,
                  onPrettifyQuery: this.handlePrettifyQuery,
                  onRunQuery: this.handleEditorRunQuery,
                  editorTheme: this.props.editorTheme
                }),
                _react2.default.createElement(
                  "div",
                  { className: "variable-editor", style: variableStyle },
                  _react2.default.createElement(
                    "div",
                    {
                      className: "variable-editor-title",
                      style: {
                        cursor: variableOpen ? "row-resize" : "n-resize"
                      },
                      onMouseDown: this.handleVariableResizeStart
                    },
                    "Query Variables"
                  ),
                  _react2.default.createElement(
                    _VariableEditor.VariableEditor,
                    {
                      ref: function ref(n) {
                        _this3.variableEditorComponent = n;
                      },
                      value: this.state.variables,
                      variableToType: this.state.variableToType,
                      onEdit: this.handleEditVariables,
                      onHintInformationRender: this.handleHintInformationRender,
                      onPrettifyQuery: this.handlePrettifyQuery,
                      onRunQuery: this.handleEditorRunQuery,
                      editorTheme: this.props.editorTheme
                    }
                  )
                )
              ),
              _react2.default.createElement(
                "div",
                { className: "resultWrap" },
                this.state.isWaitingForResponse &&
                  _react2.default.createElement(
                    "div",
                    { className: "spinner-container" },
                    _react2.default.createElement("div", {
                      className: "spinner"
                    })
                  ),
                _react2.default.createElement(_ResultViewer.ResultViewer, {
                  ref: function ref(c) {
                    _this3.resultComponent = c;
                  },
                  value: this.state.response,
                  editorTheme: this.props.editorTheme,
                  ResultsTooltip: this.props.ResultsTooltip
                }),
                footer
              )
            )
          ),
          _react2.default.createElement(
            "div",
            { className: docExplorerWrapClasses, style: docWrapStyle },
            _react2.default.createElement("div", {
              className: "docExplorerResizer",
              onDoubleClick: this.handleDocsResetResize,
              onMouseDown: this.handleDocsResizeStart
            }),
            _react2.default.createElement(
              _DocExplorer.DocExplorer,
              {
                ref: function ref(c) {
                  _this3.docExplorerComponent = c;
                },
                schema: this.state.schema
              },
              _react2.default.createElement(
                "div",
                {
                  className: "docExplorerHide",
                  onClick: this.handleToggleDocs
                },
                "\u2715"
              )
            )
          )
        );
      }

      /**
       * Get the query editor CodeMirror instance.
       *
       * @public
       */
    },
    {
      key: "getQueryEditor",
      value: function getQueryEditor() {
        return this.queryEditorComponent.getCodeMirror();
      }

      /**
       * Get the variable editor CodeMirror instance.
       *
       * @public
       */
    },
    {
      key: "getVariableEditor",
      value: function getVariableEditor() {
        return this.variableEditorComponent.getCodeMirror();
      }

      /**
       * Refresh all CodeMirror instances.
       *
       * @public
       */
    },
    {
      key: "refresh",
      value: function refresh() {
        this.queryEditorComponent.getCodeMirror().refresh();
        this.variableEditorComponent.getCodeMirror().refresh();
        this.resultComponent.getCodeMirror().refresh();
      }

      /**
       * Inspect the query, automatically filling in selection sets for non-leaf
       * fields which do not yet have them.
       *
       * @public
       */
    },
    {
      key: "autoCompleteLeafs",
      value: function autoCompleteLeafs() {
        var _fillLeafs = (0, _fillLeafs2.fillLeafs)(
            this.state.schema,
            this.state.query,
            this.props.getDefaultFieldNames
          ),
          insertions = _fillLeafs.insertions,
          result = _fillLeafs.result;

        if (insertions && insertions.length > 0) {
          var editor = this.getQueryEditor();
          editor.operation(function() {
            var cursor = editor.getCursor();
            var cursorIndex = editor.indexFromPos(cursor);
            editor.setValue(result);
            var added = 0;
            var markers = insertions.map(function(_ref) {
              var index = _ref.index,
                string = _ref.string;
              return editor.markText(
                editor.posFromIndex(index + added),
                editor.posFromIndex(index + (added += string.length)),
                {
                  className: "autoInsertedLeaf",
                  clearOnEnter: true,
                  title: "Automatically added leaf fields"
                }
              );
            });
            setTimeout(function() {
              return markers.forEach(function(marker) {
                return marker.clear();
              });
            }, 7000);
            var newCursorIndex = cursorIndex;
            insertions.forEach(function(_ref2) {
              var index = _ref2.index,
                string = _ref2.string;

              if (index < cursorIndex) {
                newCursorIndex += string.length;
              }
            });
            editor.setCursor(editor.posFromIndex(newCursorIndex));
          });
        }

        return result;
      }

      // Private methods
    },
    {
      key: "_fetchSchema",
      value: function _fetchSchema() {
        var _this4 = this;

        var fetcher = this.props.fetcher;

        var fetch = observableToPromise(
          fetcher({ query: _introspectionQueries.introspectionQuery })
        );
        if (!isPromise(fetch)) {
          this.setState({
            response: "Fetcher did not return a Promise for introspection."
          });
          return;
        }

        fetch
          .then(function(result) {
            if (result.data) {
              return result;
            }

            // Try the stock introspection query first, falling back on the
            // sans-subscriptions query for services which do not yet support it.
            var fetch2 = observableToPromise(
              fetcher({
                query: _introspectionQueries.introspectionQuerySansSubscriptions
              })
            );
            if (!isPromise(fetch)) {
              throw new Error(
                "Fetcher did not return a Promise for introspection."
              );
            }
            return fetch2;
          })
          .then(function(result) {
            // If a schema was provided while this fetch was underway, then
            // satisfy the race condition by respecting the already
            // provided schema.
            if (_this4.state.schema !== undefined) {
              return;
            }

            if (result && result.data) {
              var schema = (0, _graphql.buildClientSchema)(result.data);
              var queryFacts = (0, _getQueryFacts2.default)(
                schema,
                _this4.state.query
              );
              _this4.setState(_extends({ schema: schema }, queryFacts));
            } else {
              var responseString =
                typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2);
              _this4.setState({
                // Set schema to `null` to explicitly indicate that no schema exists.
                schema: null,
                response: responseString
              });
            }
          })
          .catch(function(error) {
            _this4.setState({
              schema: null,
              response: error && String(error.stack || error)
            });
          });
      }
    },
    {
      key: "_fetchQuery",
      value: function _fetchQuery(query, variables, operationName, cb) {
        var _this5 = this;

        var fetcher = this.props.fetcher;
        var jsonVariables = null;

        try {
          jsonVariables =
            variables && variables.trim() !== "" ? JSON.parse(variables) : null;
        } catch (error) {
          throw new Error("Variables are invalid JSON: " + error.message + ".");
        }

        if (
          (typeof jsonVariables === "undefined"
            ? "undefined"
            : _typeof(jsonVariables)) !== "object"
        ) {
          throw new Error("Variables are not a JSON object.");
        }

        var fetch = fetcher({
          query: query,
          variables: jsonVariables,
          operationName: operationName
        });

        if (isPromise(fetch)) {
          // If fetcher returned a Promise, then call the callback when the promise
          // resolves, otherwise handle the error.
          fetch.then(cb).catch(function(error) {
            _this5.setState({
              isWaitingForResponse: false,
              response: error && String(error.stack || error)
            });
          });
        } else if (isObservable(fetch)) {
          // If the fetcher returned an Observable, then subscribe to it, calling
          // the callback on each next value, and handling both errors and the
          // completion of the Observable. Returns a Subscription object.
          var subscription = fetch.subscribe({
            next: cb,
            error: function error(_error) {
              _this5.setState({
                isWaitingForResponse: false,
                response: _error && String(_error.stack || _error),
                subscription: null
              });
            },
            complete: function complete() {
              _this5.setState({
                isWaitingForResponse: false,
                subscription: null
              });
            }
          });

          return subscription;
        } else {
          throw new Error("Fetcher did not return Promise or Observable.");
        }
      }
    },
    {
      key: "_runQueryAtCursor",
      value: function _runQueryAtCursor() {
        if (this.state.subscription) {
          this.handleStopQuery();
          return;
        }

        var operationName = void 0;
        var operations = this.state.operations;
        if (operations) {
          var editor = this.getQueryEditor();
          if (editor.hasFocus()) {
            var cursor = editor.getCursor();
            var cursorIndex = editor.indexFromPos(cursor);

            // Loop through all operations to see if one contains the cursor.
            for (var i = 0; i < operations.length; i++) {
              var operation = operations[i];
              if (
                operation.loc.start <= cursorIndex &&
                operation.loc.end >= cursorIndex
              ) {
                operationName = operation.name && operation.name.value;
                break;
              }
            }
          }
        }

        this.handleRunQuery(operationName);
      }
    },
    {
      key: "_didClickDragBar",
      value: function _didClickDragBar(event) {
        // Only for primary unmodified clicks
        if (event.button !== 0 || event.ctrlKey) {
          return false;
        }
        var target = event.target;
        // We use codemirror's gutter as the drag bar.
        if (target.className.indexOf("CodeMirror-gutter") !== 0) {
          return false;
        }
        // Specifically the result window's drag bar.
        var resultWindow = _reactDom2.default.findDOMNode(this.resultComponent);
        while (target) {
          if (target === resultWindow) {
            return true;
          }
          target = target.parentNode;
        }
        return false;
      }
    }
  ]);

  return GraphiQL;
})(_react2.default.Component));

// Configure the UI by providing this Component as a child of GraphiQL.

GraphiQL.propTypes = {
  fetcher: _propTypes2.default.func.isRequired,
  schema: _propTypes2.default.instanceOf(_graphql.GraphQLSchema),
  query: _propTypes2.default.string,
  variables: _propTypes2.default.string,
  operationName: _propTypes2.default.string,
  response: _propTypes2.default.string,
  storage: _propTypes2.default.shape({
    getItem: _propTypes2.default.func,
    setItem: _propTypes2.default.func,
    removeItem: _propTypes2.default.func
  }),
  defaultQuery: _propTypes2.default.string,
  onEditQuery: _propTypes2.default.func,
  onEditVariables: _propTypes2.default.func,
  onEditOperationName: _propTypes2.default.func,
  onToggleDocs: _propTypes2.default.func,
  getDefaultFieldNames: _propTypes2.default.func,
  editorTheme: _propTypes2.default.string,
  onToggleHistory: _propTypes2.default.func,
  ResultsTooltip: _propTypes2.default.any
};

var _initialiseProps = function _initialiseProps() {
  var _this6 = this;

  this.handleClickReference = function(reference) {
    _this6.setState({ docExplorerOpen: true }, function() {
      _this6.docExplorerComponent.showDocForReference(reference);
    });
  };

  this.handleRunQuery = function(selectedOperationName) {
    _this6._editorQueryID++;
    var queryID = _this6._editorQueryID;

    // Use the edited query after autoCompleteLeafs() runs or,
    // in case autoCompletion fails (the function returns undefined),
    // the current query from the editor.
    var editedQuery = _this6.autoCompleteLeafs() || _this6.state.query;
    var variables = _this6.state.variables;
    var operationName = _this6.state.operationName;

    // If an operation was explicitly provided, different from the current
    // operation name, then report that it changed.
    if (selectedOperationName && selectedOperationName !== operationName) {
      operationName = selectedOperationName;
      _this6.handleEditOperationName(operationName);
    }

    try {
      _this6.setState({
        isWaitingForResponse: true,
        response: null,
        operationName: operationName
      });

      // _fetchQuery may return a subscription.
      var subscription = _this6._fetchQuery(
        editedQuery,
        variables,
        operationName,
        function(result) {
          if (queryID === _this6._editorQueryID) {
            _this6.setState({
              isWaitingForResponse: false,
              response: JSON.stringify(result, null, 2)
            });
          }
        }
      );

      _this6.setState({ subscription: subscription });
    } catch (error) {
      _this6.setState({
        isWaitingForResponse: false,
        response: error.message
      });
    }
  };

  this.handleStopQuery = function() {
    var subscription = _this6.state.subscription;
    _this6.setState({
      isWaitingForResponse: false,
      subscription: null
    });
    if (subscription) {
      subscription.unsubscribe();
    }
  };

  this.handlePrettifyQuery = function() {
    var editor = _this6.getQueryEditor();
    editor.setValue(
      (0, _graphql.print)((0, _graphql.parse)(editor.getValue()))
    );
  };

  this.handleEditQuery = (0, _debounce2.default)(100, function(value) {
    var queryFacts = _this6._updateQueryFacts(
      value,
      _this6.state.operationName,
      _this6.state.operations,
      _this6.state.schema
    );
    _this6.setState(
      _extends(
        {
          query: value
        },
        queryFacts
      )
    );
    if (_this6.props.onEditQuery) {
      return _this6.props.onEditQuery(value);
    }
  });

  this._updateQueryFacts = function(
    query,
    operationName,
    prevOperations,
    schema
  ) {
    var queryFacts = (0, _getQueryFacts2.default)(schema, query);
    if (queryFacts) {
      // Update operation name should any query names change.
      var updatedOperationName = (0, _getSelectedOperationName2.default)(
        prevOperations,
        operationName,
        queryFacts.operations
      );

      // Report changing of operationName if it changed.
      var onEditOperationName = _this6.props.onEditOperationName;
      if (onEditOperationName && operationName !== updatedOperationName) {
        onEditOperationName(updatedOperationName);
      }

      return _extends(
        {
          operationName: updatedOperationName
        },
        queryFacts
      );
    }
  };

  this.handleEditVariables = function(value) {
    _this6.setState({ variables: value });
    if (_this6.props.onEditVariables) {
      _this6.props.onEditVariables(value);
    }
  };

  this.handleEditOperationName = function(operationName) {
    var onEditOperationName = _this6.props.onEditOperationName;
    if (onEditOperationName) {
      onEditOperationName(operationName);
    }
  };

  this.handleHintInformationRender = function(elem) {
    elem.addEventListener("click", _this6._onClickHintInformation);

    var _onRemoveFn = void 0;
    elem.addEventListener(
      "DOMNodeRemoved",
      (_onRemoveFn = function onRemoveFn() {
        elem.removeEventListener("DOMNodeRemoved", _onRemoveFn);
        elem.removeEventListener("click", _this6._onClickHintInformation);
      })
    );
  };

  this.handleEditorRunQuery = function() {
    _this6._runQueryAtCursor();
  };

  this._onClickHintInformation = function(event) {
    if (event.target.className === "typeName") {
      var typeName = event.target.innerHTML;
      var schema = _this6.state.schema;
      if (schema) {
        var type = schema.getType(typeName);
        if (type) {
          _this6.setState({ docExplorerOpen: true }, function() {
            _this6.docExplorerComponent.showDoc(type);
          });
        }
      }
    }
  };

  this.handleToggleDocs = function() {
    if (typeof _this6.props.onToggleDocs === "function") {
      _this6.props.onToggleDocs(!_this6.state.docExplorerOpen);
    }
    _this6.setState({ docExplorerOpen: !_this6.state.docExplorerOpen });
  };

  this.handleToggleHistory = function() {
    if (typeof _this6.props.onToggleHistory === "function") {
      _this6.props.onToggleHistory(!_this6.state.historyPaneOpen);
    }
    _this6.setState({ historyPaneOpen: !_this6.state.historyPaneOpen });
  };

  this.handleSelectHistoryQuery = function(query, variables, operationName) {
    _this6.handleEditQuery(query);
    _this6.handleEditVariables(variables);
    _this6.handleEditOperationName(operationName);
  };

  this.handleResizeStart = function(downEvent) {
    if (!_this6._didClickDragBar(downEvent)) {
      return;
    }

    downEvent.preventDefault();

    var offset =
      downEvent.clientX - (0, _elementPosition.getLeft)(downEvent.target);

    var onMouseMove = function onMouseMove(moveEvent) {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      var editorBar = _reactDom2.default.findDOMNode(_this6.editorBarComponent);
      var leftSize =
        moveEvent.clientX - (0, _elementPosition.getLeft)(editorBar) - offset;
      var rightSize = editorBar.clientWidth - leftSize;
      _this6.setState({ editorFlex: leftSize / rightSize });
    };

    var onMouseUp = (function(_onMouseUp) {
      function onMouseUp() {
        return _onMouseUp.apply(this, arguments);
      }

      onMouseUp.toString = function() {
        return _onMouseUp.toString();
      };

      return onMouseUp;
    })(function() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  this.handleResetResize = function() {
    _this6.setState({ editorFlex: 1 });
  };

  this.handleDocsResizeStart = function(downEvent) {
    downEvent.preventDefault();

    var hadWidth = _this6.state.docExplorerWidth;
    var offset =
      downEvent.clientX - (0, _elementPosition.getLeft)(downEvent.target);

    var onMouseMove = function onMouseMove(moveEvent) {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      var app = _reactDom2.default.findDOMNode(_this6);
      var cursorPos =
        moveEvent.clientX - (0, _elementPosition.getLeft)(app) - offset;
      var docsSize = app.clientWidth - cursorPos;

      if (docsSize < 100) {
        _this6.setState({ docExplorerOpen: false });
      } else {
        _this6.setState({
          docExplorerOpen: true,
          docExplorerWidth: Math.min(docsSize, 650)
        });
      }
    };

    var onMouseUp = (function(_onMouseUp2) {
      function onMouseUp() {
        return _onMouseUp2.apply(this, arguments);
      }

      onMouseUp.toString = function() {
        return _onMouseUp2.toString();
      };

      return onMouseUp;
    })(function() {
      if (!_this6.state.docExplorerOpen) {
        _this6.setState({ docExplorerWidth: hadWidth });
      }

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  this.handleDocsResetResize = function() {
    _this6.setState({
      docExplorerWidth: DEFAULT_DOC_EXPLORER_WIDTH
    });
  };

  this.handleVariableResizeStart = function(downEvent) {
    downEvent.preventDefault();

    var didMove = false;
    var wasOpen = _this6.state.variableEditorOpen;
    var hadHeight = _this6.state.variableEditorHeight;
    var offset =
      downEvent.clientY - (0, _elementPosition.getTop)(downEvent.target);

    var onMouseMove = function onMouseMove(moveEvent) {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      didMove = true;

      var editorBar = _reactDom2.default.findDOMNode(_this6.editorBarComponent);
      var topSize =
        moveEvent.clientY - (0, _elementPosition.getTop)(editorBar) - offset;
      var bottomSize = editorBar.clientHeight - topSize;
      if (bottomSize < 60) {
        _this6.setState({
          variableEditorOpen: false,
          variableEditorHeight: hadHeight
        });
      } else {
        _this6.setState({
          variableEditorOpen: true,
          variableEditorHeight: bottomSize
        });
      }
    };

    var onMouseUp = (function(_onMouseUp3) {
      function onMouseUp() {
        return _onMouseUp3.apply(this, arguments);
      }

      onMouseUp.toString = function() {
        return _onMouseUp3.toString();
      };

      return onMouseUp;
    })(function() {
      if (!didMove) {
        _this6.setState({ variableEditorOpen: !wasOpen });
      }

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
};

GraphiQL.Logo = function GraphiQLLogo(props) {
  return _react2.default.createElement(
    "div",
    { className: "title" },
    props.children ||
      _react2.default.createElement(
        "span",
        null,
        "Graph",
        _react2.default.createElement("em", null, "i"),
        "QL"
      )
  );
};

// Configure the UI by providing this Component as a child of GraphiQL.
GraphiQL.Toolbar = function GraphiQLToolbar(props) {
  return _react2.default.createElement(
    "div",
    { className: "toolbar" },
    props.children
  );
};

// Export main windows/panes to be used separately if desired.
GraphiQL.QueryEditor = _QueryEditor.QueryEditor;
GraphiQL.VariableEditor = _VariableEditor.VariableEditor;
GraphiQL.ResultViewer = _ResultViewer.ResultViewer;

// Add a button to the Toolbar.
GraphiQL.Button = _ToolbarButton.ToolbarButton;
GraphiQL.ToolbarButton = _ToolbarButton.ToolbarButton; // Don't break existing API.

// Add a group of buttons to the Toolbar
GraphiQL.Group = _ToolbarGroup.ToolbarGroup;

// Add a menu of items to the Toolbar.
GraphiQL.Menu = _ToolbarMenu.ToolbarMenu;
GraphiQL.MenuItem = _ToolbarMenu.ToolbarMenuItem;

// Add a select-option input to the Toolbar.
GraphiQL.Select = _ToolbarSelect.ToolbarSelect;
GraphiQL.SelectOption = _ToolbarSelect.ToolbarSelectOption;

// Configure the UI by providing this Component as a child of GraphiQL.
GraphiQL.Footer = function GraphiQLFooter(props) {
  return _react2.default.createElement(
    "div",
    { className: "footer" },
    props.children
  );
};

var defaultQuery =
  '# Welcome to GraphiQL\n#\n# GraphiQL is an in-browser tool for writing, validating, and\n# testing GraphQL queries.\n#\n# Type queries into this side of the screen, and you will see intelligent\n# typeaheads aware of the current GraphQL type schema and live syntax and\n# validation errors highlighted within the text.\n#\n# GraphQL queries typically start with a "{" character. Lines that starts\n# with a # are ignored.\n#\n# An example GraphQL query might look like:\n#\n#     {\n#       field(arg: "value") {\n#         subField\n#       }\n#     }\n#\n# Keyboard shortcuts:\n#\n#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)\n#\n#       Run Query:  Ctrl-Enter (or press the play button above)\n#\n#   Auto Complete:  Ctrl-Space (or just start typing)\n#\n\n';

// Duck-type promise detection.
function isPromise(value) {
  return (
    (typeof value === "undefined" ? "undefined" : _typeof(value)) ===
      "object" && typeof value.then === "function"
  );
}

// Duck-type Observable.take(1).toPromise()
function observableToPromise(observable) {
  if (!isObservable(observable)) {
    return observable;
  }
  return new Promise(function(resolve, reject) {
    var subscription = observable.subscribe(
      function(v) {
        resolve(v);
        subscription.unsubscribe();
      },
      reject,
      function() {
        reject(new Error("no value resolved"));
      }
    );
  });
}

// Duck-type observable detection.
function isObservable(value) {
  return (
    (typeof value === "undefined" ? "undefined" : _typeof(value)) ===
      "object" && typeof value.subscribe === "function"
  );
}
