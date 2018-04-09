import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { buildClientSchema, GraphQLSchema, parse, print } from "graphql";
import { ExecuteButton } from "./ExecuteButton";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarGroup } from "./ToolbarGroup";
import { ToolbarMenu, ToolbarMenuItem } from "./ToolbarMenu";
import { ToolbarSelect, ToolbarSelectOption } from "./ToolbarSelect";
import { QueryEditor } from "./QueryEditor";
import { VariableEditor } from "./VariableEditor";
import { ResultViewer } from "./ResultViewer";
import { DocExplorer } from "./DocExplorer";
import { HistoryExplorer } from "./HistoryExplorer";
import CodeMirrorSizer from "../utility/CodeMirrorSizer";
import StorageAPI from "../utility/StorageAPI";
import getSelectedOperationName from "../utility/getSelectedOperationName";
import debounce from "../utility/debounce";
import find from "../utility/find";
import { fillLeafs } from "../utility/fillLeafs";
import { getLeft, getTop } from "../utility/elementPosition";
import {
  introspectionQuery,
  introspectionQuerySansSubscriptions
} from "../utility/introspectionQueries";

const DEFAULT_DOC_EXPLORER_WIDTH = 350;

/**
 * The top-level React component for SuperGraphiQL, intended to encompass the entire
 * browser viewport.
 *
 * @see https://github.com/graphql/graphiql#usage
 */
export class SuperGraphiQL extends React.Component {
  static propTypes = {
    queryList: PropTypes.array,
    fetcher: PropTypes.func.isRequired,
    schema: PropTypes.instanceOf(GraphQLSchema),
    query: PropTypes.string,
    variables: PropTypes.string,
    operationName: PropTypes.string,
    response: PropTypes.string,
    storage: PropTypes.shape({
      getItem: PropTypes.func,
      setItem: PropTypes.func,
      removeItem: PropTypes.func
    }),
    defaultQuery: PropTypes.string,
    onToggleDocs: PropTypes.func,
    getDefaultFieldNames: PropTypes.func,
    editorTheme: PropTypes.string,
    onToggleHistory: PropTypes.func,
    ResultsTooltip: PropTypes.any
  };

  constructor(props) {
    super(props);
    // Ensure props are correct
    if (typeof props.fetcher !== "function") {
      throw new TypeError("SuperGraphiQL requires a fetcher function.");
    }

    // Cache the storage instance
    this._storage = new StorageAPI(props.storage);

    // Determine the inital variable to display
    const queries = this._storage.get("query");

    const query = queries
      ? queries[queries.length - 1]
      : props.defaultQuery !== undefined ? props.defaultQuery : defaultQuery;

    // Determine the initial variables to display.
    const variables = this._storage.get("variables");

    // Determine the initial operationName to use.
    const operationName = getSelectedOperationName(
      null,
      this._storage.get("operationName")
    );

    // Determine the initial queries to render (if there are queries in local storage)
    const storedQueryList = this._storage.get("queryList");
    const emptyQuery = {
      id: 0,
      query,
      checked: true,
      operationName
    };
    const prevQuery = storedQueryList
      ? JSON.parse(storedQueryList)
      : [emptyQuery];

    // Initialize state
    this.state = {
      schema: props.schema,
      queryList: prevQuery,
      variables,
      operationName,
      response: props.response,
      editorFlex: Number(this._storage.get("editorFlex")) || 1,
      variableEditorOpen: Boolean(variables),
      variableEditorHeight:
        Number(this._storage.get("variableEditorHeight")) || 200,
      docExplorerOpen: this._storage.get("docExplorerOpen") === "true" || false,
      historyPaneOpen: this._storage.get("historyPaneOpen") === "true" || false,
      docExplorerWidth:
        Number(this._storage.get("docExplorerWidth")) ||
        DEFAULT_DOC_EXPLORER_WIDTH,
      isWaitingForResponse: false,
      subscription: null,
      subscriptions: null,
      subscriptionsViewerOpen: false,
      subscriptionsViewerHeight: 200
    };

    // Reset execution / run counter to 0
    this._runCounter = 0;

    // Subscribe to the browser window closing, treating it as an unmount.
    if (typeof window === "object") {
      window.addEventListener("beforeunload", () =>
        this.componentWillUnmount()
      );
    }
  }

  componentDidMount() {
    // Only fetch schema via introspection if a schema has not been
    // provided, including if `null` was provided.
    if (this.state.schema === undefined) {
      this._fetchSchema();
    }

    // Utility for keeping CodeMirror correctly sized.
    this.codeMirrorSizer = new CodeMirrorSizer();

    global.g = this;
  }

  componentWillReceiveProps(nextProps) {
    let nextSchema = this.state.schema;
    let nextQueryList = this.state.queryList;
    let nextVariables = this.state.variables;
    let nextOperationName = this.state.operationName;
    let nextResponse = this.state.response;

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
    if (
      nextProps.schema === undefined &&
      nextProps.fetcher !== this.props.fetcher
    ) {
      nextSchema = undefined;
    }

    this.setState(
      {
        schema: nextSchema,
        queryList: nextQueryList,
        variables: nextVariables,
        operationName: nextOperationName,
        response: nextResponse
      },
      () => {
        if (this.state.schema === undefined) {
          this.docExplorerComponent.reset();
          this._fetchSchema();
        }
      }
    );
  }

  componentDidUpdate() {
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
  componentWillUnmount() {
    const queryList = JSON.stringify(this.state.queryList);
    this._storage.set("queryList", queryList);
    this._storage.set("variables", this.state.variables);
    this._storage.set("operationName", this.state.operationName);
    this._storage.set("editorFlex", this.state.editorFlex);
    this._storage.set("variableEditorHeight", this.state.variableEditorHeight);
    this._storage.set("docExplorerWidth", this.state.docExplorerWidth);
    this._storage.set("docExplorerOpen", this.state.docExplorerOpen);
    this._storage.set("historyPaneOpen", this.state.historyPaneOpen);
  }

  render() {
    const children = React.Children.toArray(this.props.children);

    const footer = find(children, child => child.type === SuperGraphiQL.Footer);

    const queryWrapStyle = {
      WebkitFlex: this.state.editorFlex,
      flex: this.state.editorFlex
    };

    const docWrapStyle = {
      display: this.state.docExplorerOpen ? "block" : "none",
      width: this.state.docExplorerWidth
    };
    const docExplorerWrapClasses =
      "docExplorerWrap" +
      (this.state.docExplorerWidth < 200 ? " doc-explorer-narrow" : "");

    // Whether the panel displays or not
    const historyPaneStyle = {
      display: this.state.historyPaneOpen ? "block" : "none",
      width: "300px",
      zIndex: "7"
    };

    const topBarGroupStyle = {
      width: !this.state.docExplorerOpen ? "33.33%" : "auto"
    };

    const variableOpen = this.state.variableEditorOpen;
    const variableStyle = {
      height: variableOpen ? this.state.variableEditorHeight : null
    };

    const subscriptionsViewerOpen = this.state.subscriptionsViewerOpen;
    const subscriptionsStyle = {
      height: subscriptionsViewerOpen ? this.state.subscriptionsViewerHeight : null
    };

    return (
      <div className="graphiql-container">
        <div className="historyPaneWrap" style={historyPaneStyle}>
          <HistoryExplorer
            runID={this._runCounter}
            queryList={this.state.queryList}
            variables={this.state.variables}
            onSelectQuery={this.handleSelectHistoryQuery}
            storage={this._storage}
          >
            <div className="docExplorerHide" onClick={this.handleToggleHistory}>
              {"\u2715"}
            </div>
          </HistoryExplorer>
        </div>
        <div className="editorWrap">
          <div className="topBar">
            <div className="top-bar-group left" style={topBarGroupStyle}>
              <span className="toolbar">
                {!this.state.historyPaneOpen && (
                  <ToolbarButton
                    onClick={this.handleToggleHistory}
                    title="Show History"
                    label="History"
                  />
                )}
                <ExecuteButton
                  isRunning={Boolean(this.state.subscription)}
                  onRun={this.handleRunQuery}
                  onStop={this.handleStopQuery}
                  operations={this.state.operations}
                />
                <ToolbarButton
                  onClick={this.handleNewQueryBox}
                  title="Add Query Box"
                  label="Add"
                />
                <ToolbarButton
                  onClick={this.handleDeleteAll}
                  title="Clear Entered Queries"
                  label="Delete All"
                />
              </span>
            </div>
            <div className="top-bar-group center" style={topBarGroupStyle}>
              <SuperGraphiQL.Logo />
            </div>
            <div className="top-bar-group right" style={topBarGroupStyle}>
              {!this.state.docExplorerOpen && (
                <ToolbarButton
                  onClick={this.handleToggleDocs}
                  title="Show Schema Documentation"
                  label="Schema"
                />
              )}
            </div>
          </div>
          <div
            ref={n => {
              this.editorBarComponent = n;
            }}
            className="editorBar"
            onDoubleClick={this.handleResetResize}
            onMouseDown={this.handleResizeStart}
          >
            <div className="queryWrap" style={queryWrapStyle}>
              <div className="queryEditorsWrap">
                {this.state.queryList.map((queryObj, index) => (
                  <QueryEditor
                    key={index}
                    editorId={queryObj.id}
                    value={queryObj.query}
                    checked={queryObj.checked}
                    ref={n => {
                      this.queryEditorComponent = n;
                    }}
                    schema={this.state.schema}
                    onEdit={this.handleEditQuery}
                    onHintInformationRender={this.handleHintInformationRender}
                    onClickReference={this.handleClickReference}
                    onAddQuery={this.handleSelectHistoryQuery}
                    onPrettifyQuery={this.handlePrettifyQuery}
                    onCheckToRun={this.handleCheckQueryToRun}
                    onClickDeleteButton={this.handleDeleteQueryBox}
                    onRunQuery={this.handleEditorRunQuery}
                    editorTheme={this.props.editorTheme}
                    onAddNewQueryEditor={this.handleNewQueryBox}
                  />
                ))}
              </div>

              <div className="variable-editor" style={variableStyle}>
                <div
                  className="variable-editor-title"
                  id="variableTarget"
                  style={{ cursor: variableOpen ? "row-resize" : "n-resize" }}
                  onMouseDown={this.handleVariableResizeStart}
                >
                  {"Query Variables"}
                </div>
                <VariableEditor
                  ref={n => {
                    this.variableEditorComponent = n;
                  }}
                  value={this.state.variables}
                  variableToType={this.state.variableToType}
                  onEdit={this.handleEditVariables}
                  onHintInformationRender={this.handleHintInformationRender}
                  onPrettifyQuery={this.handlePrettifyQuery}
                  onRunQuery={this.handleEditorRunQuery}
                  editorTheme={this.props.editorTheme}
                />
              </div>
            </div>
            <div className="resultWrap">
              {this.state.isWaitingForResponse && (
                <div className="spinner-container">
                  <div className="spinner" />
                </div>
              )}
              <ResultViewer
                ref={c => {
                  this.resultComponent = c;
                }}
                value={this.state.response}
                editorTheme={this.props.editorTheme}
                ResultsTooltip={this.props.ResultsTooltip}
              />
              <div className="subscriptions-viewer" style={subscriptionsStyle}>
                <div
                  className="variable-editor-title"
                  id="subscriptionTarget"
                  style={{ cursor: subscriptionsViewerOpen ? "row-resize" : "n-resize" }}
                  onMouseDown={this.handleVariableResizeStart}
                >
                  {"Subscriptions"}
                </div>
                <ResultViewer
                  ref={c => {
                    this.resultComponent = c;
                  }}
                  value={this.state.subscriptions}
                  editorTheme={this.props.editorTheme}
                  ResultsTooltip={this.props.ResultsTooltip}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={docExplorerWrapClasses} style={docWrapStyle}>
          <div
            className="docExplorerResizer"
            onDoubleClick={this.handleDocsResetResize}
            onMouseDown={this.handleDocsResizeStart}
          />
          <DocExplorer
            ref={c => {
              this.docExplorerComponent = c;
            }}
            schema={this.state.schema}
          >
            <div className="docExplorerHide" onClick={this.handleToggleDocs}>
              {"\u2715"}
            </div>
          </DocExplorer>
        </div>
      </div>
    );
  }

  /**
   * Get the query editor CodeMirror instance.
   *
   * @public
   */
  getQueryEditor() {
    return this.queryEditorComponent.getCodeMirror();
  }

  /**
   * Get the variable editor CodeMirror instance.
   *
   * @public
   */
  getVariableEditor() {
    return this.variableEditorComponent.getCodeMirror();
  }

  /**
   * Refresh all CodeMirror instances.
   *
   * @public
   */
  refresh() {
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
  autoCompleteLeafs(queries) {
    return queries.map(query => {
      const { insertions, result } = fillLeafs(
        this.state.schema,
        query,
        this.props.getDefaultFieldNames
      );
      if (insertions && insertions.length > 0) {
        const editor = this.getQueryEditor();
        editor.operation(() => {
          const cursor = editor.getCursor();
          const cursorIndex = editor.indexFromPos(cursor);
          editor.setValue(result);
          let added = 0;
          const markers = insertions.map(({ index, string }) =>
            editor.markText(
              editor.posFromIndex(index + added),
              editor.posFromIndex(index + (added += string.length)),
              {
                className: "autoInsertedLeaf",
                clearOnEnter: true,
                title: "Automatically added leaf fields"
              }
            )
          );
          setTimeout(() => markers.forEach(marker => marker.clear()), 7000);
          let newCursorIndex = cursorIndex;
          insertions.forEach(({ index, string }) => {
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

  _fetchSchema() {
    const fetcher = this.props.fetcher;
    const fetch = observableToPromise(fetcher({ query: introspectionQuery }));
    if (!isPromise(fetch)) {
      this.setState({
        response: "Fetcher did not return a Promise for introspection."
      });
      return;
    }

    fetch
      .then(result => {
        if (result.data) {
          return result;
        }

        // Try the stock introspection query first, falling back on the
        // sans-subscriptions query for services which do not yet support it.
        const fetch2 = observableToPromise(
          fetcher({
            query: introspectionQuerySansSubscriptions
          })
        );
        if (!isPromise(fetch)) {
          throw new Error(
            "Fetcher did not return a Promise for introspection."
          );
        }
        return fetch2;
      })
      .then(result => {
        // If a schema was provided while this fetch was underway, then
        // satisfy the race condition by respecting the already
        // provided schema.
        if (this.state.schema !== undefined && this.state.schema !== null) {
          return;
        }

        if (result && result.data) {
          const schema = buildClientSchema(result.data);
          this.setState({ schema });
        } else {
          const responseString =
            typeof result === "string"
              ? result
              : JSON.stringify(result, null, 2);
          this.setState({
            // Set schema to `null` to explicitly indicate that no schema exists.
            schema: null,
            response: responseString
          });
        }
      })
      .catch(error => {
        this.setState({
          schema: null,
          response: error && String(error.stack || error)
        });
      });
  }

  _fetchQuery(queries, variables, cb) {
    const fetcher = this.props.fetcher;
    let jsonVariables = null;

    try {
      jsonVariables =
        variables && variables.trim() !== "" ? JSON.parse(variables) : null;
    } catch (error) {
      throw new Error(`Variables are invalid JSON: ${error.message}.`);
    }

    if (typeof jsonVariables !== "object") {
      throw new Error("Variables are not a JSON object.");
    }

    // if Introspection Query
    if (!Array.isArray(queries)) {
      fetcher(queries, variables)
        .then(cb)
        .catch(error => {
          this.setState({
            isWaitingForResponse: false,
            response: error && String(error.stack || error)
          });
        });
    } else {
      const executeSeries = funcs =>
        funcs.reduce((promise, func) =>
          promise.then(result => func.then(response => result.concat(response))),
          Promise.resolve([]));

      const subscriptions = [];
      const promises = [];

      queries.forEach((elem, i) => {
        const { query, operationName } = elem;
        const cleanQuery = {
          query,
          operationName,
          variables
        };

        const fetch = fetcher(cleanQuery, variables);

        if (isPromise(fetch)) {
          promises.push(fetch)
        } else if(isObservable(fetch)) { 
          // subscribe to the observable here
          const subscriptionID = fetch.subscribe({
            next: response => {
              this.setState(prevState => {
                const subResponse = prevState.subscriptions ? JSON.parse(prevState.subscriptions) : {}
                subResponse[i++ + " | subscription"] = response;

                return {
                  isWaitingForResponse: false,
                  subscriptions: JSON.stringify(subResponse, null, 2)
                }
              })
            },
            error: error => {
              this.setState({
                isWaitingForResponse: false,
                response: error && String(error.stack || error),
                subscription: null
              });
            },
            complete: () => {
              this.setState({
                isWaitingForResponse: false,
                subscription: null
              });
            }
          });
          // push subscription IDs to array
          subscriptions.push(subscriptionID)
        }
      });

      if (promises.length) {
        executeSeries(promises)
          .then(response => {
            cb(response, "output");
          })
          .catch(console.error.bind(console))
      }
    }
  }

  handleClickReference = reference => {
    this.setState({ docExplorerOpen: true }, () => {
      this.docExplorerComponent.showDocForReference(reference);
    });
  };

  handleRunQuery = selectedOperationName => {
    this._runCounter++;
    const runID = this._runCounter;

    // filter out query editors that are not checked
    const querytoRun = this.state.queryList.filter(
      queryObj => queryObj.checked && queryObj.query.trim()
    );

    // Use the filtered queries to run after autoCompleteLeafs() runs or,
    // in case autoCompletion fails (the function returns undefined),
    // the current query from the editor.

    const editedQueryList = this.autoCompleteLeafs(querytoRun);
    const filteredQuery = editedQueryList.every(result => Boolean(result))
      ? editedQueryList
      : querytoRun;

    const variables = this.state.variables;
    let operationName = this.state.operationName;

    // If an operation was explicitly provided, different from the current
    // operation name, then report that it changed.
    if (selectedOperationName && selectedOperationName !== operationName) {
      operationName = selectedOperationName;
    }
    if (!filteredQuery.length) {
      this.setState({
        response: "Enter a valid query"
      });
    } else {
      try {
        this.setState({
          isWaitingForResponse: true,
          response: null,
          operationName
        });

        // _fetchQuery may return a subscription.
        const subscription = this._fetchQuery(
          filteredQuery,
          variables,
          (results, type) => {
            if (runID === this._runCounter) {
              const updatedResults = results.reduce((resObj, result, i) => {
                resObj[i + " | " + type] = result;
                return resObj;
              }, {})

              this.setState({
                isWaitingForResponse: false,
                response: JSON.stringify(updatedResults, null, 2)
              })
            }
          }
        );
        this.setState({ subscription });
      } catch (error) {
        this.setState({
          isWaitingForResponse: false,
          response: error.message
        });
      }
    }
  };

  handleStopQuery = () => {
    const subscription = this.state.subscription;
    this.setState({
      isWaitingForResponse: false,
      subscription: null
    });
    if (subscription) {
      subscription.unsubscribe();
    }
  };

  _runQueryAtCursor() {
    if (this.state.subscription) {
      this.handleStopQuery();
      return;
    }

    let operationName;
    const operations = this.state.operations;
    if (operations) {
      const editor = this.getQueryEditor();
      if (editor.hasFocus()) {
        const cursor = editor.getCursor();
        const cursorIndex = editor.indexFromPos(cursor);

        // Loop through all operations to see if one contains the cursor.
        for (let i = 0; i < operations.length; i++) {
          const operation = operations[i];
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

  handleNewQueryBox = (query = "") => {
    // Check if one of the boxes are already empty, return the index of the first empty box; stays -1 if none are empty
    let emptyIdx = null;

    for (let i = 0; i < this.state.queryList.length; i++) {
      if (!this.state.queryList[i].query) {
        emptyIdx = i;
        break;
      }
    }

    if (Boolean(query) && emptyIdx !== null) {
      this.setState(prevState => {
        prevState.queryList[emptyIdx].query = query;
        return {
          queryList: prevState.queryList
        };
      });
    }
    // if there are no empty boxes, add one
    if (emptyIdx === null) {
      this.setState(prevState => {
        // generate psuedo random id
        const uniqid = Math.floor(Math.random() * Date.now());
        prevState.queryList.push({
          id: uniqid,
          query,
          checked: true,
          operationName: undefined
        });
        return {
          queryList: prevState.queryList
        };
      });
    }
  };

  handleCheckQueryToRun = (id, isChecked) => {
    for (let i = 0; i < this.state.queryList.length; i++) {
      if (this.state.queryList[i].id === id) {
        this.setState(prevState => {
          // find the query with the same id as the button
          prevState.queryList[i].checked = isChecked;
          return {
            queryList: prevState.queryList
          };
        });
        break;
      }
    }
  };

  handleDeleteQueryBox = id => {
    // check the > 1 queries in the query list state
    if (this.state.queryList.length > 1) {
      this.setState(prevState => {
        // filter the item out of the QueryList and store to a temp item
        prevState.queryList = prevState.queryList.filter(
          query => query.id !== id
        );
        // reset the state
        this.setState({
          queryList: prevState.queryList
        });
      });
    }
  };

  handleDeleteAll = () => {
    this.setState({
      queryList: [
        {
          id: Math.floor(Math.random() * Date.now()),
          query: "",
          checked: true,
          operationName: undefined
        }
      ]
    });
  };

  handlePrettifyQuery = () => {
    const editor = this.getQueryEditor();
    editor.setValue(print(parse(editor.getValue())));
  };

  handleEditQuery = debounce(100, (value, editorID) => {
    const queryListCopy = [...this.state.queryList];
    // find object in query list with id of editor ID and update query value
    const queryList = queryListCopy.map(queryObj => {
      if (queryObj.id === editorID) {
        queryObj.query = value;
      }
      return queryObj;
    });

    this.setState({
      queryList
    });
  });

  handleEditVariables = value => {
    this.setState({ variables: value });
  };

  handleHintInformationRender = elem => {
    elem.addEventListener("click", this._onClickHintInformation);

    let onRemoveFn;
    elem.addEventListener(
      "DOMNodeRemoved",
      (onRemoveFn = () => {
        elem.removeEventListener("DOMNodeRemoved", onRemoveFn);
        elem.removeEventListener("click", this._onClickHintInformation);
      })
    );
  };

  handleEditorRunQuery = () => {
    this._runQueryAtCursor();
  };

  _onClickHintInformation = event => {
    if (event.target.className === "typeName") {
      const typeName = event.target.innerHTML;
      const schema = this.state.schema;
      if (schema) {
        const type = schema.getType(typeName);
        if (type) {
          this.setState({ docExplorerOpen: true }, () => {
            this.docExplorerComponent.showDoc(type);
          });
        }
      }
    }
  };

  handleToggleDocs = () => {
    if (typeof this.props.onToggleDocs === "function") {
      this.props.onToggleDocs(!this.state.docExplorerOpen);
    }
    this.setState({ docExplorerOpen: !this.state.docExplorerOpen });
  };

  handleToggleHistory = () => {
    if (typeof this.props.onToggleHistory === "function") {
      this.props.onToggleHistory(!this.state.historyPaneOpen);
    }
    this.setState({ historyPaneOpen: !this.state.historyPaneOpen });
  };

  handleSelectHistoryQuery = (query, variables) => {
    this.handleNewQueryBox(query);
    this.handleEditQuery(query);
    this.handleEditVariables(variables);
  };

  handleResizeStart = downEvent => {
    if (!this._didClickDragBar(downEvent)) {
      return;
    }

    downEvent.preventDefault();

    const offset = downEvent.clientX - getLeft(downEvent.target);

    let onMouseMove = moveEvent => {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      const editorBar = ReactDOM.findDOMNode(this.editorBarComponent);
      const leftSize = moveEvent.clientX - getLeft(editorBar) - offset;
      const rightSize = editorBar.clientWidth - leftSize;
      this.setState({ editorFlex: leftSize / rightSize });
    };

    let onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  handleResetResize = () => {
    this.setState({ editorFlex: 1 });
  };

  _didClickDragBar(event) {
    // Only for primary unmodified clicks
    if (event.button !== 0 || event.ctrlKey) {
      return false;
    }
    let target = event.target;
    // We use codemirror's gutter as the drag bar.
    if (target.className.indexOf("CodeMirror-gutter") !== 0) {
      return false;
    }
    // Specifically the result window's drag bar.
    const resultWindow = ReactDOM.findDOMNode(this.resultComponent);
    while (target) {
      if (target === resultWindow) {
        return true;
      }
      target = target.parentNode;
    }
    return false;
  }

  handleDocsResizeStart = downEvent => {
    downEvent.preventDefault();

    const hadWidth = this.state.docExplorerWidth;
    const offset = downEvent.clientX - getLeft(downEvent.target);

    let onMouseMove = moveEvent => {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      const app = ReactDOM.findDOMNode(this);
      const cursorPos = moveEvent.clientX - getLeft(app) - offset;
      const docsSize = app.clientWidth - cursorPos;

      if (docsSize < 100) {
        this.setState({ docExplorerOpen: false });
      } else {
        this.setState({
          docExplorerOpen: true,
          docExplorerWidth: Math.min(docsSize, 650)
        });
      }
    };

    let onMouseUp = () => {
      if (!this.state.docExplorerOpen) {
        this.setState({ docExplorerWidth: hadWidth });
      }

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  handleDocsResetResize = () => {
    this.setState({
      docExplorerWidth: DEFAULT_DOC_EXPLORER_WIDTH
    });
  };

  handleVariableResizeStart = downEvent => {
    downEvent.preventDefault();
    const targetID = downEvent.currentTarget.id;
    const subscriptionEditor = Boolean(targetID === "subscriptionTarget");
    const variablesEditor = Boolean(targetID === "variableTarget");

    let didMove = false;
    const wasOpen = variablesEditor ? this.state.variableEditorOpen : this.state.subscriptionsViewerOpen;
    const hadHeight = variablesEditor ? this.state.variableEditorHeight : this.state.subscriptionsViewerHeight;
    const offset = downEvent.clientY - getTop(downEvent.target);

    let onMouseMove = moveEvent => {
      if (moveEvent.buttons === 0) {
        return onMouseUp();
      }

      didMove = true;

      const editorBar = ReactDOM.findDOMNode(this.editorBarComponent);
      const topSize = moveEvent.clientY - getTop(editorBar) - offset;
      const bottomSize = editorBar.clientHeight - topSize;

      let updateObj = {};

      if (bottomSize < 60) {
        if (variablesEditor) {
          updateObj['variableEditorOpen'] = false;
          updateObj['variableEditorHeight'] = hadHeight;
        } else {
          updateObj['subscriptionsViewerOpen'] = false;
          updateObj['subscriptionsViewerHeight'] = hadHeight;
        }
      } else {
        if (variablesEditor) {
          updateObj['variableEditorOpen'] = true;
          updateObj['variableEditorHeight'] = bottomSize;
        } else {
          updateObj['subscriptionsViewerOpen'] = true;
          updateObj['subscriptionsViewerHeight'] = bottomSize;
        }
      }

      this.setState(updateObj);
    };

    let onMouseUp = () => {      
      if (!didMove) {
        let updateObj = {};
        if (variablesEditor) {
          updateObj['variableEditorOpen'] = !wasOpen;
        } else {
          updateObj['subscriptionsViewerOpen'] = !wasOpen;
        }
        this.setState(updateObj);
      }

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      onMouseMove = null;
      onMouseUp = null;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
}

// Configure the UI by providing this Component as a child of SuperGraphiQL.
SuperGraphiQL.Logo = () => {
  return (
    <div className="title">
      <span>
        {"Super Graph"}
        <em>{"i"}</em>
        {"QL"}
      </span>
    </div>
  );
};

// Export main windows/panes to be used separately if desired.
SuperGraphiQL.QueryEditor = QueryEditor;
SuperGraphiQL.VariableEditor = VariableEditor;
SuperGraphiQL.ResultViewer = ResultViewer;

// Add a button to the Toolbar.
SuperGraphiQL.Button = ToolbarButton;
SuperGraphiQL.ToolbarButton = ToolbarButton; // Don't break existing API.

// Add a group of buttons to the Toolbar
SuperGraphiQL.Group = ToolbarGroup;

// Add a menu of items to the Toolbar.
SuperGraphiQL.Menu = ToolbarMenu;
SuperGraphiQL.MenuItem = ToolbarMenuItem;

// Add a select-option input to the Toolbar.
SuperGraphiQL.Select = ToolbarSelect;
SuperGraphiQL.SelectOption = ToolbarSelectOption;

// Configure the UI by providing this Component as a child of SuperGraphiQL.
SuperGraphiQL.Footer = function SuperGraphiQLFooter(props) {
  return <div className="footer">{props.children}</div>;
};

const defaultQuery = `# Welcome to SuperGraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#   Auto Complete:  Ctrl-Space (or just start typing)
#
`;

// Duck-type promise detection.
function isPromise(value) {
  return typeof value === "object" && typeof value.then === "function";
}

// Duck-type Observable.take(1).toPromise()
function observableToPromise(observable) {
  if (!isObservable(observable)) {
    return observable;
  }
  return new Promise((resolve, reject) => {
    const subscription = observable.subscribe(
      v => {
        resolve(v);
        subscription.unsubscribe();
      },
      reject,
      () => {
        reject(new Error("no value resolved"));
      }
    );
  });
}

// Duck-type observable detection.
function isObservable(value) {
  return typeof value === "object" && typeof value.subscribe === "function";
}
