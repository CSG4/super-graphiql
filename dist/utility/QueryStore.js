"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var QueryStore = (function() {
  function QueryStore(key, storage) {
    _classCallCheck(this, QueryStore);

    this.key = key;
    this.storage = storage;
    this.items = this.fetchAll();
  }

  _createClass(QueryStore, [
    {
      key: "contains",
      value: function contains(item) {
        return this.items.some(function(x) {
          return (
            x.query === item.query &&
            x.variables === item.variables &&
            x.operationName === item.operationName
          );
        });
      }
    },
    {
      key: "delete",
      value: function _delete(item) {
        var index = this.items.findIndex(function(x) {
          return (
            x.query === item.query &&
            x.variables === item.variables &&
            x.operationName === item.operationName
          );
        });
        if (index !== -1) {
          this.items.splice(index, 1);
          this.save();
        }
      }
    },
    {
      key: "fetchRecent",
      value: function fetchRecent() {
        return this.items[this.items.length - 1];
      }
    },
    {
      key: "fetchAll",
      value: function fetchAll() {
        var raw = this.storage.get(this.key);
        if (raw) {
          return JSON.parse(raw)[this.key];
        }
        return [];
      }
    },
    {
      key: "push",
      value: function push(item) {
        this.items.push(item);
        this.save();
      }
    },
    {
      key: "shift",
      value: function shift() {
        this.items.shift();
        this.save();
      }
    },
    {
      key: "save",
      value: function save() {
        this.storage.set(
          this.key,
          JSON.stringify(_defineProperty({}, this.key, this.items))
        );
      }
    },
    {
      key: "length",
      get: function get() {
        return this.items.length;
      }
    }
  ]);

  return QueryStore;
})();

exports.default = QueryStore;
