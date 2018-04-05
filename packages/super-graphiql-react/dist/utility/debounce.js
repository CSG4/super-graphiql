"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debounce;
/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * Provided a duration and a function, returns a new function which is called
 * `duration` milliseconds after the last call.
 */
function debounce(duration, fn) {
  var timeout = void 0;
  return function () {
    var _this = this,
        _arguments = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      fn.apply(_this, _arguments);
    }, duration);
  };
}