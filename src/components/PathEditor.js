import React from "react";
import PropTypes from "prop-types";
import { GraphQLSchema } from "graphql";
import MD from "markdown-it";
import { normalizeWhitespace } from "../utility/normalizeWhitespace";
import onHasCompletion from "../utility/onHasCompletion";

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

/**
 * PathEditor
 *
 * Allows the user to input a server path for the query
 *
 * Props:
 *
 *   - schema: A GraphQLSchema instance enabling editor linting and hinting.
 *   - value: The text of the editor.
 *   - onEdit: A function called when the editor changes, given the edited text.
 *   REMOVE - readOnly: Turns the editor to read-only mode.
 *
 */

//user a code mirror line to allow users to type into the field

export class PathEditor extends React.Component {
  static propTypes = {
    onEdit: PropTypes.func
  };
  constructor(props) {
    super();
  }
  render() {
    return (
      <div className="path-editor">
        Path:
        <input
          className="path-input"
          onChange={e => {
            this.props.onEdit(e.target.value);
          }}
          placeholder="http://localhost:8000/graphql"
        />
      </div>
    );
  }
}
