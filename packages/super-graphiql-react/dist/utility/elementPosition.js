"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLeft = getLeft;
exports.getTop = getTop;
/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * Utility functions to get a pixel distance from left/top of the window.
 */

function getLeft(initialElem) {
  var pt = 0;
  var elem = initialElem;
  while (elem.offsetParent) {
    pt += elem.offsetLeft;
    elem = elem.offsetParent;
  }
  return pt;
}

function getTop(initialElem) {
  var pt = 0;
  var elem = initialElem;
  while (elem.offsetParent) {
    pt += elem.offsetTop;
    elem = elem.offsetParent;
  }
  return pt;
}