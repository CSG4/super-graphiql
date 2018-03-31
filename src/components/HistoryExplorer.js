import { parse, print } from "graphql";
import React from "react";
import PropTypes from "prop-types";
import QueryStore from "../utility/QueryStore";
import HistoryQuery from "./HistoryExplorer/HistoryQuery";
import SearchBox from "./HistoryExplorer/SearchBox";
import debounce from "../utility/debounce";
// import { exec } from "child_process";

const queriesToSave = (nextProps, currProps, lastQuerySaved) => {
  // add current variable prop to each query
  const executedQueries = nextProps.queryList.reduce((acc, entry) => {
    let query;
    try {
      query = print(parse(entry.query));
    } catch (e) {
      query = "";
    }

    const cleanEntry = {
      query,
      variables: nextProps.variables,
      operationName: entry.operationName
    };
    return entry.checked && entry.query.trim() ? acc.concat(cleanEntry) : acc;
  }, []);
  // if history is empty, add all the last queries run
  if (!lastQuerySaved.length && nextProps.runID) {
    return executedQueries;
  }

  // Only add new queries to the historyStore
  const newQueries =
    nextProps.runID === currProps.runID
      ? []
      : executedQueries.filter(
          nextQuery =>
            !lastQuerySaved.some(
              pastQuery => (pastQuery.query === nextQuery.query ? true : false)
            )
        );

  return newQueries;
};

const MAX_HISTORY_LENGTH = 20;

export class HistoryExplorer extends React.Component {
  static propTypes = {
    runID: PropTypes.number,
    queryList: PropTypes.array,
    variables: PropTypes.string,
    onSelectQuery: PropTypes.func,
    storage: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.historyStore = new QueryStore("history", props.storage);
    this.pinnedStore = new QueryStore("pinned", props.storage);
    const historyQueries = this.historyStore.fetchAll();
    const pinnedQueries = this.pinnedStore.fetchAll();
    this.state = {
      history: historyQueries,
      pinned: pinnedQueries
    };
  }

  componentWillReceiveProps(nextProps) {
    const historyQueries = this.historyStore.fetchAll() || [];
    const pinnedQueries = this.pinnedStore.fetchAll();
    const lastSavedQueries = historyQueries.concat(pinnedQueries);
    const newQueries = queriesToSave(nextProps, this.props, lastSavedQueries);
    if (newQueries.length > 0) {
      this.historyStore.concat(newQueries);
      while (this.historyStore.length > MAX_HISTORY_LENGTH) {
        this.historyStore.shift();
      }

      const historyQueries = this.historyStore.items;
      const pinnedQueries = this.pinnedStore.items;
      this.setState({
        history: historyQueries,
        pinned: pinnedQueries
      });
    }
  }

  render() {
    const historyNodes = this.createNodes(this.state.history);
    const pinnedNodes = this.createNodes(this.state.pinned);
    return (
      <div className="history-panel">
        <div className="history-title-bar">
          <div className="history-title">{"History Explorer"}</div>
          <div className="doc-explorer-rhs">{this.props.children}</div>
        </div>
        <div className="history-contents">
          <SearchBox
            placeholder={"Search History..."}
            onSearch={this.handleSearch}
          />
          <div className="pinned-contents">{pinnedNodes}</div>
          <div className="search-contents">{historyNodes}</div>
        </div>
      </div>
    );
  }

  togglePinned = (query, variables, operationName, pinned) => {
    const item = {
      query,
      variables,
      operationName
    };
    if (!this.pinnedStore.contains(item)) {
      item.pinned = true;
      this.pinnedStore.push(item);
      this.historyStore.delete(item);
    } else if (pinned) {
      delete item.pinned;
      if (!this.historyStore.contains(item)) this.historyStore.push(item);
      this.pinnedStore.delete(item);
    }
    const historyQueries = this.historyStore.items;
    const pinnedQueries = this.pinnedStore.items;
    this.setState({
      history: historyQueries,
      pinned: pinnedQueries
    });
  };

  // ENABLE REGEX Search
  handleSearch = searchParams => {
    let match = this.historyStore.items.filter(entry =>
      entry.query.includes(searchParams)
    );
    this.setState({ history: match });
  };

  createNodes = queryStore => {
    const queryNodes = queryStore.slice().reverse();
    return queryNodes.map((entry, i) => {
      return (
        <HistoryQuery
          handleTogglePinned={this.togglePinned}
          key={i}
          onSelect={this.props.onSelectQuery}
          {...entry}
        />
      );
    });
  };
}
