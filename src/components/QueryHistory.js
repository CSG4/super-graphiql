import { parse } from "graphql";
import React from "react";
import PropTypes from "prop-types";
import QueryStore from "../utility/QueryStore";
import HistoryQuery from "./HistoryQuery";
import debounce from "../utility/debounce";

const shouldSaveQuery = (nextProps, current, lastQuerySaved) => {
  if (nextProps.queryID === current.queryID) {
    return false;
  }
  try {
    parse(nextProps.query);
  } catch (e) {
    return false;
  }
  if (!lastQuerySaved) {
    return true;
  }
  if (
    JSON.stringify(nextProps.query) === JSON.stringify(lastQuerySaved.query)
  ) {
    if (
      JSON.stringify(nextProps.variables) ===
      JSON.stringify(lastQuerySaved.variables)
    ) {
      return false;
    }
    if (!nextProps.variables && !lastQuerySaved.variables) {
      return false;
    }
  }
  return true;
};

const MAX_HISTORY_LENGTH = 20;

export class QueryHistory extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    variables: PropTypes.string,
    operationName: PropTypes.string,
    queryID: PropTypes.number,
    onSelectQuery: PropTypes.func,
    storage: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.historyStore = new QueryStore("queries", props.storage);
    this.favoriteStore = new QueryStore("favorites", props.storage);
    const historyQueries = this.historyStore.fetchAll();
    const favoriteQueries = this.favoriteStore.fetchAll();
    const queries = historyQueries.concat(favoriteQueries);
    this.state = {
      queries,
      search: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      shouldSaveQuery(nextProps, this.props, this.historyStore.fetchRecent())
    ) {
      const item = {
        query: nextProps.query,
        variables: nextProps.variables,
        operationName: nextProps.operationName
      };
      this.historyStore.push(item);
      if (this.historyStore.length > MAX_HISTORY_LENGTH) {
        this.historyStore.shift();
      }
      const historyQueries = this.historyStore.items;
      const favoriteQueries = this.favoriteStore.items;
      const queries = historyQueries.concat(favoriteQueries);
      this.setState({
        queries
      });
    }
  }

  render() {
    const queries = this.state.queries.slice().reverse();
    const queryNodes = queries.map((query, i) => {
      return (
        <HistoryQuery
          handleToggleFavorite={this.toggleFavorite}
          key={i}
          onSelect={this.props.onSelectQuery}
          {...query}
        />
      );
    });
    return (
      <div>
        <div className="history-title-bar">
          <div className="history-title">{"History"}</div>
          <input
            size="14"
            className="search"
            onChange={e => {
              this.handleEditQueryForSearch(e.target.value); // resets the local state
            }}
            placeholder="search"
          />
          <div className="doc-explorer-rhs">{this.props.children}</div>
        </div>
        <div className="history-contents">{queryNodes}</div>
      </div>
    );
  }

  toggleFavorite = (query, variables, operationName, favorite) => {
    const item = {
      query,
      variables,
      operationName
    };
    if (!this.favoriteStore.contains(item)) {
      item.favorite = true;
      this.favoriteStore.push(item);
    } else if (favorite) {
      item.favorite = false;
      this.favoriteStore.delete(item);
    }
    const historyQueries = this.historyStore.items;
    const favoriteQueries = this.favoriteStore.items;
    const queries = historyQueries.concat(favoriteQueries);
    this.setState({ queries });
  };

  handleEditQueryForSearch = debounce(100, query => {
    this.setState({ search: query }, () => {
      return this.findQuery(query, this.historyStore);
    });
  });

  findQuery = (key, obj) => {
    let result = [];
    let arr = obj["items"];
    // console.log(arr);
    for (let i = 0; i < arr.length; i++) {
      let str = arr[i]["query"];
      // console.log(str);
      if (str.includes(key)) {
        result.push(arr[i]);
      }
    }
    //console.log(result);
    this.setState({ queries: result });
  };
}
