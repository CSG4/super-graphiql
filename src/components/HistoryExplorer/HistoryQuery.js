/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

export default class HistoryQuery extends React.Component {
  static propTypes = {
    pinned: PropTypes.bool,
    favoriteSize: PropTypes.number,
    handleTogglePinned: PropTypes.func,
    operationName: PropTypes.string,
    onSelect: PropTypes.func,
    query: PropTypes.string
  };

  constructor(props) {
    super(props);
    const visibility = this.props.pinned ? "visible" : "hidden";
    this.state = { visibility };
  }

  render() {
    if (this.props.pinned && this.state.visibility === "hidden") {
      this.setState({ visibility: "visible" });
    }
    const bmStyles = {
      float: "left",
      marginLeft: "7px",
      visibility: this.state.visibility
    };

    const binStyles = {
      float: "right",
      marginLeft: "7px",
      visibility: this.state.visibility
    };

    const displayName =
      this.props.operationName ||
      this.props.query
        .split("\n")
        .filter(line => line.indexOf("#") !== 0)
        .join("");
    const bookmark = this.props.pinned ? "fa fa-bookmark" : "fa fa-bookmark-o";
    return (
      <div
        className="history-query"
        onClick={this.handleClick.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      >
        <span onClick={this.handlePinClick.bind(this)} style={bmStyles}>
          <i className={bookmark} aria-hidden="true" />
        </span>
        <span>{displayName}</span>
      </div>
    );
  }

  handleMouseEnter() {
    if (!this.props.pinned) {
      this.setState({ visibility: "visible" });
    }
  }

  handleMouseLeave() {
    if (!this.props.pinned) {
      this.setState({ visibility: "hidden" });
    }
  }

  handleClick() {
    this.props.onSelect(this.props.query, this.props.variables);
  }

  handlePinClick(e) {
    e.stopPropagation();
    this.props.handleTogglePinned(
      this.props.query,
      this.props.variables,
      this.props.operationName,
      this.props.pinned
    );
  }
}
