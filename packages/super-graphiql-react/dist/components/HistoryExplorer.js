"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HistoryExplorer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphql = require("graphql");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _QueryStore = require("../utility/QueryStore");

var _QueryStore2 = _interopRequireDefault(_QueryStore);

var _HistoryQuery = require("./HistoryExplorer/HistoryQuery");

var _HistoryQuery2 = _interopRequireDefault(_HistoryQuery);

var _SearchBox = require("./HistoryExplorer/SearchBox");

var _SearchBox2 = _interopRequireDefault(_SearchBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var queriesToSave = function queriesToSave(nextProps, currProps, lastQuerySaved) {
  // add current variable prop to each query
  var executedQueries = nextProps.queryList.reduce(function (acc, entry) {
    var query = void 0;
    try {
      query = (0, _graphql.print)((0, _graphql.parse)(entry.query));
    } catch (e) {
      query = "";
    }

    var cleanEntry = {
      query: query,
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
  var newQueries = nextProps.runID === currProps.runID ? [] : executedQueries.filter(function (nextQuery) {
    return !lastQuerySaved.some(function (pastQuery) {
      return pastQuery.query === nextQuery.query;
    });
  });

  return newQueries;
};

var MAX_HISTORY_LENGTH = 20;

var HistoryExplorer = exports.HistoryExplorer = function (_React$Component) {
  _inherits(HistoryExplorer, _React$Component);

  function HistoryExplorer(props) {
    _classCallCheck(this, HistoryExplorer);

    var _this = _possibleConstructorReturn(this, (HistoryExplorer.__proto__ || Object.getPrototypeOf(HistoryExplorer)).call(this, props));

    _initialiseProps.call(_this);

    _this.historyStore = new _QueryStore2.default("history", props.storage);
    _this.pinnedStore = new _QueryStore2.default("pinned", props.storage);
    var historyQueries = _this.historyStore.fetchAll();
    var pinnedQueries = _this.pinnedStore.fetchAll();
    _this.state = {
      history: historyQueries,
      pinned: pinnedQueries
    };
    return _this;
  }

  _createClass(HistoryExplorer, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var historyQueries = this.historyStore.fetchAll() || [];
      var pinnedQueries = this.pinnedStore.fetchAll();
      var lastSavedQueries = historyQueries.concat(pinnedQueries);
      var newQueries = queriesToSave(nextProps, this.props, lastSavedQueries);
      if (newQueries.length > 0) {
        this.historyStore.concat(newQueries);
        while (this.historyStore.length > MAX_HISTORY_LENGTH) {
          this.historyStore.shift();
        }

        historyQueries = this.historyStore.items;
        pinnedQueries = this.pinnedStore.items;
        this.setState({
          history: historyQueries,
          pinned: pinnedQueries
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var historyNodes = this.createNodes(this.state.history);
      var pinnedNodes = this.createNodes(this.state.pinned);
      return _react2.default.createElement(
        "div",
        { className: "history-panel" },
        _react2.default.createElement(
          "div",
          { className: "history-title-bar" },
          _react2.default.createElement(
            "div",
            { className: "history-title" },
            "History Explorer"
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
          _react2.default.createElement(_SearchBox2.default, {
            placeholder: "Search History...",
            onSearch: this.handleSearch
          }),
          _react2.default.createElement(
            "div",
            { className: "pinned-contents" },
            pinnedNodes
          ),
          _react2.default.createElement(
            "div",
            { className: "search-contents" },
            historyNodes
          )
        )
      );
    }

    // ENABLE REGEX Search

  }]);

  return HistoryExplorer;
}(_react2.default.Component);

HistoryExplorer.propTypes = {
  runID: _propTypes2.default.number,
  queryList: _propTypes2.default.array,
  variables: _propTypes2.default.string,
  onSelectQuery: _propTypes2.default.func,
  storage: _propTypes2.default.object
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.togglePinned = function (query, variables, operationName, pinned) {
    var item = {
      query: query,
      variables: variables,
      operationName: operationName
    };
    if (!_this2.pinnedStore.contains(item)) {
      item.pinned = true;
      _this2.pinnedStore.push(item);
      _this2.historyStore.delete(item);
    } else if (pinned) {
      delete item.pinned;
      if (!_this2.historyStore.contains(item)) {
        _this2.historyStore.push(item);
      }
      _this2.pinnedStore.delete(item);
    }
    var historyQueries = _this2.historyStore.items;
    var pinnedQueries = _this2.pinnedStore.items;
    _this2.setState({
      history: historyQueries,
      pinned: pinnedQueries
    });
  };

  this.handleSearch = function (searchParams) {
    var match = _this2.historyStore.items.filter(function (entry) {
      return entry.query.includes(searchParams);
    });
    _this2.setState({ history: match });
  };

  this.createNodes = function (queryStore) {
    var queryNodes = queryStore.slice().reverse();
    return queryNodes.map(function (entry, i) {
      return _react2.default.createElement(_HistoryQuery2.default, _extends({
        handleTogglePinned: _this2.togglePinned,
        key: i,
        onSelect: _this2.props.onSelectQuery
      }, entry));
    });
  };
};