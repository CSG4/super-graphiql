/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * ToolbarButton
 *
 * A button to use within the Toolbar.
 */
export class ToolbarButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    title: PropTypes.string,
    label: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  renderIcon(label) {
    switch (label) {
      case "History":
        return <i className="fa fa-list" aria-hidden="true" />;
      case "Add":
        return <i className="fa fa-plus" aria-hidden="true" />;
      case "Delete All":
        return <i className="fa fa-trash-o" aria-hidden="true" />;
      case "Schema":
        return <i className="fa fa-chevron-left" aria-hidden="true" />;

      default:
        return null;
    }
  }

  render() {
    const { error } = this.state;

    return (
      <a
        className={
          "toolbar-button" +
          (error ? " error" : "") +
          (this.props.label === "Schema" ? " schema-button" : "") +
          (this.props.label === "History" ? " history-button" : "")
        }
        onMouseDown={preventDefault}
        onClick={this.handleClick}
        title={error ? error.message : this.props.title}
      >
        {this.renderIcon(this.props.label)}
        <span>{this.props.label}</span>
      </a>
    );
  }

  handleClick = e => {
    e.preventDefault();
    try {
      this.props.onClick();
      this.setState({ error: null });
    } catch (error) {
      this.setState({ error });
    }
  };
}

function preventDefault(e) {
  e.preventDefault();
}
