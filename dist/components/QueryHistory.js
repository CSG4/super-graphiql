"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryHistory = undefined;

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

var _graphql = require("graphql");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _QueryStore = require("../utility/QueryStore");

var _QueryStore2 = _interopRequireDefault(_QueryStore);

var _HistoryQuery = require("./HistoryQuery");

var _HistoryQuery2 = _interopRequireDefault(_HistoryQuery);

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
}

var shouldSaveQuery = function shouldSaveQuery(
  nextProps,
  current,
  lastQuerySaved
) {
  if (nextProps.queryID === current.queryID) {
    return false;
  }
  try {
    (0, _graphql.parse)(nextProps.query);
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

var MAX_HISTORY_LENGTH = 20;

var QueryHistory = (exports.QueryHistory = (function(_React$Component) {
  _inherits(QueryHistory, _React$Component);

  function QueryHistory(props) {
    _classCallCheck(this, QueryHistory);

    var _this = _possibleConstructorReturn(
      this,
      (QueryHistory.__proto__ || Object.getPrototypeOf(QueryHistory)).call(
        this,
        props
      )
    );

    _initialiseProps.call(_this);

    _this.historyStore = new _QueryStore2.default("queries", props.storage);
    _this.favoriteStore = new _QueryStore2.default("favorites", props.storage);
    var historyQueries = _this.historyStore.fetchAll();
    var favoriteQueries = _this.favoriteStore.fetchAll();
    var queries = historyQueries.concat(favoriteQueries);
    _this.state = { queries: queries };
    return _this;
  }

  _createClass(QueryHistory, [
    {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        if (
          shouldSaveQuery(
            nextProps,
            this.props,
            this.historyStore.fetchRecent()
          )
        ) {
          var item = {
            query: nextProps.query,
            variables: nextProps.variables,
            operationName: nextProps.operationName
          };
          this.historyStore.push(item);
          if (this.historyStore.length > MAX_HISTORY_LENGTH) {
            this.historyStore.shift();
          }
          var historyQueries = this.historyStore.items;
          var favoriteQueries = this.favoriteStore.items;
          var queries = historyQueries.concat(favoriteQueries);
          this.setState({
            queries: queries
          });
        }
      }
    },
    {
      key: "render",
      value: function render() {
        var _this2 = this;

        var queries = this.state.queries.slice().reverse();
        var queryNodes = queries.map(function(query, i) {
          return _react2.default.createElement(
            _HistoryQuery2.default,
            _extends(
              {
                handleToggleFavorite: _this2.toggleFavorite,
                key: i,
                onSelect: _this2.props.onSelectQuery
              },
              query
            )
          );
        });
        return _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(
            "div",
            { className: "history-title-bar" },
            _react2.default.createElement(
              "div",
              { className: "history-title" },
              "History"
            ),
            _react2.default.createElement(
              "div",
              { className: "doc-explorer-rhs" },
              this.props.children
            )
          ),
          _react2.default.createElement(
            "div",
            { className: "history-contents" },
            queryNodes
          )
        );
      }
    }
  ]);

  return QueryHistory;
})(_react2.default.Component));

QueryHistory.propTypes = {
  query: _propTypes2.default.string,
  variables: _propTypes2.default.string,
  operationName: _propTypes2.default.string,
  queryID: _propTypes2.default.number,
  onSelectQuery: _propTypes2.default.func,
  storage: _propTypes2.default.object
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.toggleFavorite = function(query, variables, operationName, favorite) {
    var item = {
      query: query,
      variables: variables,
      operationName: operationName
    };
    if (!_this3.favoriteStore.contains(item)) {
      item.favorite = true;
      _this3.favoriteStore.push(item);
    } else if (favorite) {
      item.favorite = false;
      _this3.favoriteStore.delete(item);
    }
    var historyQueries = _this3.historyStore.items;
    var favoriteQueries = _this3.favoriteStore.items;
    var queries = historyQueries.concat(favoriteQueries);
    _this3.setState({ queries: queries });
  };
};
