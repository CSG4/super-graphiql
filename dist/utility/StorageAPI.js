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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

var StorageAPI = (function() {
  function StorageAPI(storage) {
    _classCallCheck(this, StorageAPI);

    this.storage = storage || window.localStorage;
  }

  _createClass(StorageAPI, [
    {
      key: "get",
      value: function get(name) {
        if (this.storage) {
          var value = this.storage.getItem("graphiql:" + name);
          // Clean up any inadvertently saved null/undefined values.
          if (value === "null" || value === "undefined") {
            this.storage.removeItem("graphiql:" + name);
          } else {
            return value;
          }
        }
      }
    },
    {
      key: "set",
      value: function set(name, value) {
        if (this.storage) {
          var key = "graphiql:" + name;
          if (value) {
            if (isStorageAvailable(this.storage, key, value)) {
              this.storage.setItem(key, value);
            }
          } else {
            // Clean up by removing the item if there's no value to set
            this.storage.removeItem(key);
          }
        }
      }
    }
  ]);

  return StorageAPI;
})();

exports.default = StorageAPI;

function isStorageAvailable(storage, key, value) {
  try {
    storage.setItem(key, value);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
}
