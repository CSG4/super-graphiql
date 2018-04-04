"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperGraphiQL = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _HistoryExplorer = require("./HistoryExplorer");

var _CodeMirrorSizer = require("../utility/CodeMirrorSizer");

var _CodeMirrorSizer2 = _interopRequireDefault(_CodeMirrorSizer);

var _StorageAPI = require("../utility/StorageAPI");

var _StorageAPI2 = _interopRequireDefault(_StorageAPI);

var _getSelectedOperationName = require("../utility/getSelectedOperationName");

var _getSelectedOperationName2 = _interopRequireDefault(_getSelectedOperationName);

var _debounce = require("../utility/debounce");

var _debounce2 = _interopRequireDefault(_debounce);

var _find = require("../utility/find");

var _find2 = _interopRequireDefault(_find);

var _fillLeafs2 = require("../utility/fillLeafs");

var _elementPosition = require("../utility/elementPosition");

var _introspectionQueries = require("../utility/introspectionQueries");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_DOC_EXPLORER_WIDTH = 350;

/**
 * The top-level React component for SuperGraphiQL, intended to encompass the entire
 * browser viewport.
 *
 * @see https://github.com/graphql/graphiql#usage
 */

var SuperGraphiQL = exports.SuperGraphiQL = function (_React$Component) {
  _inherits(SuperGraphiQL, _React$Component);

  function SuperGraphiQL(props) {
    _classCallCheck(this, SuperGraphiQL);

    // Ensure props are correct
    var _this = _possibleConstructorReturn(this, (SuperGraphiQL.__proto__ || Object.getPrototypeOf(SuperGraphiQL)).call(this, props));

    _initialiseProps.call(_this);

    if (typeof props.fetcher !== "function") {
      throw new TypeError("SuperGraphiQL requires a fetcher function.");
    }

    // Cache the storage instance
    _this._storage = new _StorageAPI2.default(props.storage);

    // Determine the inital variable to display
    var queries = _this._storage.get("query");

    var query = queries ? queries[queries.length - 1] : props.defaultQuery !== undefined ? props.defaultQuery : defaultQuery;

    // Determine the initial variables to display.
    var variables = _this._storage.get("variables");

    // Determine the initial operationName to use.
    var operationName = (0, _getSelectedOperationName2.default)(null, _this._storage.get("operationName"));

    // Determine the initial queries to render (if there are queries in local storage)
    var storedQueryList = _this._storage.get("queryList");
    var emptyQuery = {
      id: 0,
      query: query,
      checked: true,
      operationName: operationName
    };
    var prevQuery = storedQueryList ? JSON.parse(storedQueryList) : [emptyQuery];

    // Initialize state
    _this.state = {
      schema: props.schema,
      queryList: prevQuery,
      variables: variables,
      operationName: operationName,
      response: props.response,
      editorFlex: Number(_this._storage.get("editorFlex")) || 1,
      variableEditorOpen: Boolean(variables),
      variableEditorHeight: Number(_this._storage.get("variableEditorHeight")) || 200,
      docExplorerOpen: _this._storage.get("docExplorerOpen") === "true" || false,
      historyPaneOpen: _this._storage.get("historyPaneOpen") === "true" || false,
      docExplorerWidth: Number(_this._storage.get("docExplorerWidth")) || DEFAULT_DOC_EXPLORER_WIDTH,
      isWaitingForResponse: false,
      subscription: null
    };

    // Reset execution / run counter to 0
    _this._runCounter = 0;

    // Subscribe to the browser window closing, treating it as an unmount.
    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
      window.addEventListener("beforeunload", function () {
        return _this.componentWillUnmount();
      });
    }
    return _this;
  }

  _createClass(SuperGraphiQL, [{
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
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var nextSchema = this.state.schema;
      var nextQueryList = this.state.queryList;
      var nextVariables = this.state.variables;
      var nextOperationName = this.state.operationName;
      var nextResponse = this.state.response;

      if (nextProps.schema !== undefined) {
        nextSchema = nextProps.schema;
      }
      if (nextProps.queryList !== undefined) {
        nextQueryList = nextProps.queryList;
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

      // If schema is not supplied via props and the fetcher changed, then
      // remove the schema so fetchSchema() will be called with the new fetcher.
      if (nextProps.schema === undefined && nextProps.fetcher !== this.props.fetcher) {
        nextSchema = undefined;
      }

      this.setState({
        schema: nextSchema,
        queryList: nextQueryList,
        variables: nextVariables,
        operationName: nextOperationName,
        response: nextResponse
      }, function () {
        if (_this2.state.schema === undefined) {
          _this2.docExplorerComponent.reset();
          _this2._fetchSchema();
        }
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // If this update caused DOM nodes to have changed sizes, update the
      // corresponding CodeMirror instance sizes to match.
      this.codeMirrorSizer.updateSizes([this.queryEditorComponent, this.variableEditorComponent, this.resultComponent]);
    }

    // When the component is about to unmount, store any persistable state, such
    // that when the component is remounted, it will use the last used values.

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var queryList = JSON.stringify(this.state.queryList);
      this._storage.set("queryList", queryList);
      this._storage.set("variables", this.state.variables);
      this._storage.set("operationName", this.state.operationName);
      this._storage.set("editorFlex", this.state.editorFlex);
      this._storage.set("variableEditorHeight", this.state.variableEditorHeight);
      this._storage.set("docExplorerWidth", this.state.docExplorerWidth);
      this._storage.set("docExplorerOpen", this.state.docExplorerOpen);
      this._storage.set("historyPaneOpen", this.state.historyPaneOpen);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var children = _react2.default.Children.toArray(this.props.children);

      var toolbar = (0, _find2.default)(children, function (child) {
        return child.type === SuperGraphiQL.Toolbar;
      }) || _react2.default.createElement(
        SuperGraphiQL.Toolbar,
        null,
        _react2.default.createElement(_ExecuteButton.ExecuteButton, {
          isRunning: Boolean(this.state.subscription),
          onRun: this.handleRunQuery,
          onStop: this.handleStopQuery,
          operations: this.state.operations
        }),
        _react2.default.createElement(_ToolbarButton.ToolbarButton, {
          onClick: this.handleNewQueryBox,
          title: "Add a new query to the execution stack",
          label: "Add Query"
        }),
        _react2.default.createElement(_ToolbarButton.ToolbarButton, {
          onClick: this.handleDeleteAll,
          title: "Removes all queries from the execution stack",
          label: "Delete All"
        })
      );

      var footer = (0, _find2.default)(children, function (child) {
        return child.type === SuperGraphiQL.Footer;
      });

      var queryWrapStyle = {
        WebkitFlex: this.state.editorFlex,
        flex: this.state.editorFlex
      };

      var docWrapStyle = {
        display: this.state.docExplorerOpen ? "block" : "none",
        width: this.state.docExplorerWidth
      };
      var docExplorerWrapClasses = "docExplorerWrap" + (this.state.docExplorerWidth < 200 ? " doc-explorer-narrow" : "");

      // Whether the panel displays or not
      var historyPaneStyle = {
        display: this.state.historyPaneOpen ? "block" : "none",
        width: "300px",
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
            _HistoryExplorer.HistoryExplorer,
            {
              runID: this._runCounter,
              queryList: this.state.queryList,
              variables: this.state.variables,
              onSelectQuery: this.handleSelectHistoryQuery,
              storage: this._storage
            },
            _react2.default.createElement(
              "div",
              { className: "docExplorerHide", onClick: this.handleToggleHistory },
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
              _react2.default.createElement(_ToolbarButton.ToolbarButton, {
                onClick: this.handleToggleHistory,
                title: "Show Schema Documentation",
                label: "History"
              }),
              _react2.default.createElement(SuperGraphiQL.Logo, null),
              _react2.default.createElement(_ToolbarButton.ToolbarButton, {
                onClick: this.handleToggleDocs,
                title: "Show Schema Documentation",
                label: "Schema"
              })
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "toolbarWrap" },
            _react2.default.createElement(
              "div",
              { className: "toolbar" },
              toolbar
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
              _react2.default.createElement(
                "div",
                { className: "queryEditorsWrap" },
                this.state.queryList.map(function (queryObj, index) {
                  return _react2.default.createElement(_QueryEditor.QueryEditor, {
                    key: index,
                    editorId: queryObj.id,
                    value: queryObj.query,
                    checked: queryObj.checked,
                    ref: function ref(n) {
                      _this3.queryEditorComponent = n;
                    },
                    schema: _this3.state.schema,
                    onEdit: _this3.handleEditQuery,
                    onHintInformationRender: _this3.handleHintInformationRender,
                    onClickReference: _this3.handleClickReference,
                    onAddQuery: _this3.handleSelectHistoryQuery,
                    onPrettifyQuery: _this3.handlePrettifyQuery,
                    onCheckToRun: _this3.handleCheckQueryToRun,
                    onClickDeleteButton: _this3.handleDeleteQueryBox,
                    onRunQuery: _this3.handleEditorRunQuery,
                    editorTheme: _this3.props.editorTheme,
                    onAddNewQueryEditor: _this3.handleNewQueryBox
                  });
                })
              ),
              _react2.default.createElement(
                "div",
                { className: "variable-editor", style: variableStyle },
                _react2.default.createElement(
                  "div",
                  {
                    className: "variable-editor-title",
                    style: { cursor: variableOpen ? "row-resize" : "n-resize" },
                    onMouseDown: this.handleVariableResizeStart
                  },
                  "Query Variables"
                ),
                _react2.default.createElement(_VariableEditor.VariableEditor, {
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
                })
              )
            ),
            _react2.default.createElement(
              "div",
              { className: "resultWrap" },
              this.state.isWaitingForResponse && _react2.default.createElement(
                "div",
                { className: "spinner-container" },
                _react2.default.createElement("div", { className: "spinner" })
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
              { className: "docExplorerHide", onClick: this.handleToggleDocs },
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

  }, {
    key: "getQueryEditor",
    value: function getQueryEditor() {
      return this.queryEditorComponent.getCodeMirror();
    }

    /**
     * Get the variable editor CodeMirror instance.
     *
     * @public
     */

  }, {
    key: "getVariableEditor",
    value: function getVariableEditor() {
      return this.variableEditorComponent.getCodeMirror();
    }

    /**
     * Refresh all CodeMirror instances.
     *
     * @public
     */

  }, {
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

  }, {
    key: "autoCompleteLeafs",
    value: function autoCompleteLeafs(queries) {
      var _this4 = this;

      return queries.map(function (query) {
        var _fillLeafs = (0, _fillLeafs2.fillLeafs)(_this4.state.schema, query, _this4.props.getDefaultFieldNames),
            insertions = _fillLeafs.insertions,
            result = _fillLeafs.result;

        if (insertions && insertions.length > 0) {
          var editor = _this4.getQueryEditor();
          editor.operation(function () {
            var cursor = editor.getCursor();
            var cursorIndex = editor.indexFromPos(cursor);
            editor.setValue(result);
            var added = 0;
            var markers = insertions.map(function (_ref) {
              var index = _ref.index,
                  string = _ref.string;
              return editor.markText(editor.posFromIndex(index + added), editor.posFromIndex(index + (added += string.length)), {
                className: "autoInsertedLeaf",
                clearOnEnter: true,
                title: "Automatically added leaf fields"
              });
            });
            setTimeout(function () {
              return markers.forEach(function (marker) {
                return marker.clear();
              });
            }, 7000);
            var newCursorIndex = cursorIndex;
            insertions.forEach(function (_ref2) {
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
      });
    }

    // Private methods

  }, {
    key: "_fetchSchema",
    value: function _fetchSchema() {
      var _this5 = this;

      var fetcher = this.props.fetcher;
      var fetch = observableToPromise(fetcher({ query: _introspectionQueries.introspectionQuery }));
      if (!isPromise(fetch)) {
        this.setState({
          response: "Fetcher did not return a Promise for introspection."
        });
        return;
      }

      fetch.then(function (result) {
        if (result.data) {
          return result;
        }

        // Try the stock introspection query first, falling back on the
        // sans-subscriptions query for services which do not yet support it.
        var fetch2 = observableToPromise(fetcher({
          query: _introspectionQueries.introspectionQuerySansSubscriptions
        }));
        if (!isPromise(fetch)) {
          throw new Error("Fetcher did not return a Promise for introspection.");
        }
        return fetch2;
      }).then(function (result) {
        // If a schema was provided while this fetch was underway, then
        // satisfy the race condition by respecting the already
        // provided schema.
        if (_this5.state.schema !== undefined && _this5.state.schema !== null) {
          return;
        }

        if (result && result.data) {
          var schema = (0, _graphql.buildClientSchema)(result.data);
          _this5.setState({ schema: schema });
        } else {
          var responseString = typeof result === "string" ? result : JSON.stringify(result, null, 2);
          _this5.setState({
            // Set schema to `null` to explicitly indicate that no schema exists.
            schema: null,
            response: responseString
          });
        }
      }).catch(function (error) {
        _this5.setState({
          schema: null,
          response: error && String(error.stack || error)
        });
      });
    }
  }, {
    key: "_fetchQuery",
    value: function _fetchQuery(queries, variables, cb) {
      var _this6 = this;

      var fetcher = this.props.fetcher;
      var jsonVariables = null;

      try {
        jsonVariables = variables && variables.trim() !== "" ? JSON.parse(variables) : null;
      } catch (error) {
        throw new Error("Variables are invalid JSON: " + error.message + ".");
      }

      if ((typeof jsonVariables === "undefined" ? "undefined" : _typeof(jsonVariables)) !== "object") {
        throw new Error("Variables are not a JSON object.");
      }

      // if Introspection Query
      if (!Array.isArray(queries)) {
        fetcher(queries, variables).then(cb).catch(function (error) {
          _this6.setState({
            isWaitingForResponse: false,
            response: error && String(error.stack || error)
          });
        });
      } else {
        queries.forEach(function (elem, i) {
          var query = elem.query,
              operationName = elem.operationName;

          var cleanQuery = {
            query: query,
            operationName: operationName,
            variables: variables
          };
          // check if it is a subscription or not
          var fetch = fetcher(cleanQuery, variables);
          if (isPromise(fetch)) {
            // If fetcher returned a Promise, then call the callback when the promise
            // resolves, otherwise handle the error.
            fetch.then(function (response) {
              cb(response, i, "output");
            }).catch(function (error) {
              _this6.setState({
                isWaitingForResponse: false,
                response: error && String(error.stack || error)
              });
            });
          } else if (isObservable(fetch)) {
            // If the fetcher returned an Observable, then subscribe to it, calling
            // the callback on each next value, and handling both errors and the
            // completion of the Observable. Returns a Subscription object.
            var subscription = fetch.subscribe({
              next: function next(response) {
                cb(response, i, "subscription");
              },
              error: function error(_error) {
                _this6.setState({
                  isWaitingForResponse: false,
                  response: _error && String(_error.stack || _error),
                  subscription: null
                });
              },
              complete: function complete() {
                _this6.setState({
                  isWaitingForResponse: false,
                  subscription: null
                });
              }
            });

            return subscription;
          } else {
            throw new Error("Fetcher did not return Promise or Observable.");
          }
        });
      }
    }
  }, {
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
            if (operation.loc.start <= cursorIndex && operation.loc.end >= cursorIndex) {
              operationName = operation.name && operation.name.value;
              break;
            }
          }
        }
      }
      this.handleRunQuery(operationName);
    }
  }, {
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
  }]);

  return SuperGraphiQL;
}(_react2.default.Component);

// Configure the UI by providing this Component as a child of SuperGraphiQL.


SuperGraphiQL.propTypes = {
  queryList: _propTypes2.default.array,
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
  onToggleDocs: _propTypes2.default.func,
  getDefaultFieldNames: _propTypes2.default.func,
  editorTheme: _propTypes2.default.string,
  onToggleHistory: _propTypes2.default.func,
  ResultsTooltip: _propTypes2.default.any
};

var _initialiseProps = function _initialiseProps() {
  var _this7 = this;

  this.handleClickReference = function (reference) {
    _this7.setState({ docExplorerOpen: true }, function () {
      _this7.docExplorerComponent.showDocForReference(reference);
    });
  };

  this.handleRunQuery = function (selectedOperationName) {
    _this7._runCounter++;
    var runID = _this7._runCounter;

    // filter out query editors that are not checked
    var querytoRun = _this7.state.queryList.filter(function (queryObj) {
      return queryObj.checked && queryObj.query.trim();
    });

    // Use the filtered queries to run after autoCompleteLeafs() runs or,
    // in case autoCompletion fails (the function returns undefined),
    // the current query from the editor.

    var editedQueryList = _this7.autoCompleteLeafs(querytoRun);
    var filteredQuery = editedQueryList.every(function (result) {
      return Boolean(result);
    }) ? editedQueryList : querytoRun;

    var variables = _this7.state.variables;
    var operationName = _this7.state.operationName;

    // If an operation was explicitly provided, different from the current
    // operation name, then report that it changed.
    if (selectedOperationName && selectedOperationName !== operationName) {
      operationName = selectedOperationName;
    }
    if (!filteredQuery.length) {
      _this7.setState({
        response: "Enter a valid query"
      });
    } else {
      try {
        _this7.setState({
          isWaitingForResponse: true,
          response: null,
          operationName: operationName
        });

        // _fetchQuery may return a subscription.
        var subscription = _this7._fetchQuery(filteredQuery, variables, function (result, index, type) {
          if (runID === _this7._runCounter) {
            _this7.setState(function (prevState) {
              var prevRes = prevState.response ? JSON.parse(prevState.response) : {};

              prevRes[type + "[" + index + "]"] = result;

              return {
                isWaitingForResponse: false,
                response: JSON.stringify(prevRes, null, 2)
              };
            });
          }
        });
        _this7.setState({ subscription: subscription });
      } catch (error) {
        _this7.setState({
          isWaitingForResponse: false,
          response: error.message
        });
      }
    }
  };

  this.handleStopQuery = function () {
    var subscription = _this7.state.subscription;
    _this7.setState({
      isWaitingForResponse: false,
      subscription: null
    });
    if (subscription) {
      subscription.unsubscribe();
    }
  };

  this.handleNewQueryBox = function () {
    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    // Check if one of the boxes are already empty, return the index of the first empty box; stays -1 if none are empty
    var emptyIdx = null;

    for (var i = 0; i < _this7.state.queryList.length; i++) {
      if (!_this7.state.queryList[i].query) {
        emptyIdx = i;
        break;
      }
    }

    if (Boolean(query) && emptyIdx !== null) {
      _this7.setState(function (prevState) {
        prevState.queryList[emptyIdx].query = query;
        return {
          queryList: prevState.queryList
        };
      });
    }
    // if there are no empty boxes, add one
    if (emptyIdx === null) {
      _this7.setState(function (prevState) {
        // generate psuedo random id
        var uniqid = Math.floor(Math.random() * Date.now());
        prevState.queryList.push({
          id: uniqid,
          query: query,
          checked: true,
          operationName: undefined
        });
        return {
          queryList: prevState.queryList
        };
      });
    }
  };

  this.handleCheckQueryToRun = function (id, isChecked) {
    var _loop = function _loop(i) {
      if (_this7.state.queryList[i].id === id) {
        _this7.setState(function (prevState) {
          // find the query with the same id as the button
          prevState.queryList[i].checked = isChecked;
          return {
            queryList: prevState.queryList
          };
        });
        return "break";
      }
    };

    for (var i = 0; i < _this7.state.queryList.length; i++) {
      var _ret = _loop(i);

      if (_ret === "break") break;
    }
  };

  this.handleDeleteQueryBox = function (id) {
    // check the > 1 queries in the query list state
    if (_this7.state.queryList.length > 1) {
      _this7.setState(function (prevState) {
        // filter the item out of the QueryList and store to a temp item
        prevState.queryList = prevState.queryList.filter(function (query) {
          return query.id !== id;
        });
        // reset the state
        _this7.setState({
          queryList: prevState.queryList
        });
      });
    }
  };

  this.handleDeleteAll = function () {
    _this7.setState({
      queryList: [{
        id: Math.floor(Math.random() * Date.now()),
        query: "",
        checked: true,
        operationName: undefined
      }]
    });
  };

  this.handlePrettifyQuery = function () {
    var editor = _this7.getQueryEditor();
    editor.setValue((0, _graphql.print)((0, _graphql.parse)(editor.getValue())));
  };

  this.handleEditQuery = (0, _debounce2.default)(100, function (value, editorID) {
    var queryListCopy = [].concat(_toConsumableArray(_this7.state.queryList));
    // find object in query list with id of editor ID and update query value
    var queryList = queryListCopy.map(function (queryObj) {
      if (queryObj.id === editorID) {
        queryObj.query = value;
      }
      return queryObj;
    });

    _this7.setState({
      queryList: queryList
    });
  });

  this.handleEditVariables = function (value) {
    _this7.setState({ variables: value });
  };

  this.handleHintInformationRender = function (elem) {
    elem.addEventListener("click", _this7._onClickHintInformation);

    var _onRemoveFn = void 0;
    elem.addEventListener("DOMNodeRemoved", _onRemoveFn = function onRemoveFn() {
      elem.removeEventListener("DOMNodeRemoved", _onRemoveFn);
      elem.removeEventListener("click", _this7._onClickHintInformation);
    });
  };

  this.handleEditorRunQuery = function () {
    _this7._runQueryAtCursor();
  };

  this._onClickHintInformation = function (event) {
    if (event.target.className === "typeName") {
      var typeName = event.target.innerHTML;
      var schema = _this7.state.schema;
      if (schema) {
        var type = schema.getType(typeName);
        if (type) {
          _this7.setState({ docExplorerOpen: true }, function () {
            _this7.docExplorerComponent.showDoc(type);
          });
        }
      }
    }
  };

  this.handleToggleDocs = function () {
    if (typeof _this7.props.onToggleDocs === "function") {
      _this7.props.onToggleDocs(!_this7.state.docExplorerOpen);
    }
    _this7.setState({ docExplorerOpen: !_this7.state.docExplorerOpen });
  };

  this.handleToggleHistory = function () {
    if (typeof _this7.props.onToggleHistory === "function") {
      _this7.props.onToggleHistory(!_this7.state.historyPaneOpen);
    }
    _this7.setState({ historyPaneOpen: !_this7.state.historyPaneOpen });
  };

  this.handleSelectHistoryQuery = function (query, variables) {
    _this7.handleNewQueryBox(query);
    _this7.handleEditQuery(query);
    _this7.handleEditVariables(variables);
  };

  this.handleResizeStart = function (downEvent) {
    if (!_this7._didClickDragBar(downEvent)) {
      return;
    }

    downEvent.preventDefault();

    var offset = downEvent.clientX - (0, _elementPosition.getLeft)(downEvent.target);

    var onMouseMove = function onMouseMove(moveEvent) {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      var editorBar = _reactDom2.default.findDOMNode(_this7.editorBarComponent);
      var leftSize = moveEvent.clientX - (0, _elementPosition.getLeft)(editorBar) - offset;
      var rightSize = editorBar.clientWidth - leftSize;
      _this7.setState({ editorFlex: leftSize / rightSize });
    };

    var onMouseUp = function (_onMouseUp) {
      function onMouseUp() {
        return _onMouseUp.apply(this, arguments);
      }

      onMouseUp.toString = function () {
        return _onMouseUp.toString();
      };

      return onMouseUp;
    }(function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  this.handleResetResize = function () {
    _this7.setState({ editorFlex: 1 });
  };

  this.handleDocsResizeStart = function (downEvent) {
    downEvent.preventDefault();

    var hadWidth = _this7.state.docExplorerWidth;
    var offset = downEvent.clientX - (0, _elementPosition.getLeft)(downEvent.target);

    var onMouseMove = function onMouseMove(moveEvent) {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      var app = _reactDom2.default.findDOMNode(_this7);
      var cursorPos = moveEvent.clientX - (0, _elementPosition.getLeft)(app) - offset;
      var docsSize = app.clientWidth - cursorPos;

      if (docsSize < 100) {
        _this7.setState({ docExplorerOpen: false });
      } else {
        _this7.setState({
          docExplorerOpen: true,
          docExplorerWidth: Math.min(docsSize, 650)
        });
      }
    };

    var onMouseUp = function (_onMouseUp2) {
      function onMouseUp() {
        return _onMouseUp2.apply(this, arguments);
      }

      onMouseUp.toString = function () {
        return _onMouseUp2.toString();
      };

      return onMouseUp;
    }(function () {
      if (!_this7.state.docExplorerOpen) {
        _this7.setState({ docExplorerWidth: hadWidth });
      }

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  this.handleDocsResetResize = function () {
    _this7.setState({
      docExplorerWidth: DEFAULT_DOC_EXPLORER_WIDTH
    });
  };

  this.handleVariableResizeStart = function (downEvent) {
    downEvent.preventDefault();

    var didMove = false;
    var wasOpen = _this7.state.variableEditorOpen;
    var hadHeight = _this7.state.variableEditorHeight;
    var offset = downEvent.clientY - (0, _elementPosition.getTop)(downEvent.target);

    var onMouseMove = function onMouseMove(moveEvent) {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      didMove = true;

      var editorBar = _reactDom2.default.findDOMNode(_this7.editorBarComponent);
      var topSize = moveEvent.clientY - (0, _elementPosition.getTop)(editorBar) - offset;
      var bottomSize = editorBar.clientHeight - topSize;
      if (bottomSize < 60) {
        _this7.setState({
          variableEditorOpen: false,
          variableEditorHeight: hadHeight
        });
      } else {
        _this7.setState({
          variableEditorOpen: true,
          variableEditorHeight: bottomSize
        });
      }
    };

    var onMouseUp = function (_onMouseUp3) {
      function onMouseUp() {
        return _onMouseUp3.apply(this, arguments);
      }

      onMouseUp.toString = function () {
        return _onMouseUp3.toString();
      };

      return onMouseUp;
    }(function () {
      if (!didMove) {
        _this7.setState({ variableEditorOpen: !wasOpen });
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

SuperGraphiQL.Logo = function () {
  return _react2.default.createElement(
    "div",
    { className: "title" },
    _react2.default.createElement(
      "span",
      null,
      "Super Graph",
      _react2.default.createElement(
        "em",
        null,
        "i"
      ),
      "QL"
    )
  );
};

// Configure the UI by providing this Component as a child of SuperGraphiQL.
SuperGraphiQL.Toolbar = function SuperGraphiQLToolbar(props) {
  return _react2.default.createElement(
    "div",
    { className: "toolbar" },
    props.children
  );
};

// Export main windows/panes to be used separately if desired.
SuperGraphiQL.QueryEditor = _QueryEditor.QueryEditor;
SuperGraphiQL.VariableEditor = _VariableEditor.VariableEditor;
SuperGraphiQL.ResultViewer = _ResultViewer.ResultViewer;

// Add a button to the Toolbar.
SuperGraphiQL.Button = _ToolbarButton.ToolbarButton;
SuperGraphiQL.ToolbarButton = _ToolbarButton.ToolbarButton; // Don't break existing API.

// Add a group of buttons to the Toolbar
SuperGraphiQL.Group = _ToolbarGroup.ToolbarGroup;

// Add a menu of items to the Toolbar.
SuperGraphiQL.Menu = _ToolbarMenu.ToolbarMenu;
SuperGraphiQL.MenuItem = _ToolbarMenu.ToolbarMenuItem;

// Add a select-option input to the Toolbar.
SuperGraphiQL.Select = _ToolbarSelect.ToolbarSelect;
SuperGraphiQL.SelectOption = _ToolbarSelect.ToolbarSelectOption;

// Configure the UI by providing this Component as a child of SuperGraphiQL.
SuperGraphiQL.Footer = function SuperGraphiQLFooter(props) {
  return _react2.default.createElement(
    "div",
    { className: "footer" },
    props.children
  );
};

var defaultQuery = "# Welcome to SuperGraphiQL\n#\n# GraphiQL is an in-browser tool for writing, validating, and\n# testing GraphQL queries.\n#\n# An example GraphQL query might look like:\n#\n#     {\n#       field(arg: \"value\") {\n#         subField\n#       }\n#     }\n#\n#       Run Query:  Ctrl-Enter (or press the play button above)\n#   Auto Complete:  Ctrl-Space (or just start typing)\n#\n";

// Duck-type promise detection.
function isPromise(value) {
  return (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && typeof value.then === "function";
}

// Duck-type Observable.take(1).toPromise()
function observableToPromise(observable) {
  if (!isObservable(observable)) {
    return observable;
  }
  return new Promise(function (resolve, reject) {
    var subscription = observable.subscribe(function (v) {
      resolve(v);
      subscription.unsubscribe();
    }, reject, function () {
      reject(new Error("no value resolved"));
    });
  });
}

// Duck-type observable detection.
function isObservable(value) {
  return (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && typeof value.subscribe === "function";
}