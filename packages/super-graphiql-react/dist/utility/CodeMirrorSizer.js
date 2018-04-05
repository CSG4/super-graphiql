"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 * When a containing DOM node's height has been altered, trigger a resize of
 * the related CodeMirror instance so that it is always correctly sized.
 */
var CodeMirrorSizer = function () {
  function CodeMirrorSizer() {
    _classCallCheck(this, CodeMirrorSizer);

    this.sizes = [];
  }

  _createClass(CodeMirrorSizer, [{
    key: "updateSizes",
    value: function updateSizes(components) {
      var _this = this;

      components.forEach(function (component, i) {
        var size = component.getClientHeight();
        if (i <= _this.sizes.length && size !== _this.sizes[i]) {
          component.getCodeMirror().setSize();
        }
        _this.sizes[i] = size;
      });
    }
  }]);

  return CodeMirrorSizer;
}();

exports.default = CodeMirrorSizer;