import React from "react";
import PropTypes from "prop-types";

import debounce from "../../utility/debounce";

export default class SearchBox extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { value: props.value || "" };
    this.debouncedOnSearch = debounce(200, this.props.onSearch);
  }

  render() {
    return (
      <label className="search-box">
        <input
          value={this.state.value}
          onChange={this.handleChange}
          type="text"
          placeholder={this.props.placeholder}
        />
        {this.state.value && (
          <div className="search-box-clear" onClick={this.handleClear}>
            {"\u2715"}
          </div>
        )}
      </label>
    );
  }

  handleChange = event => {
    const value = event.target.value;
    this.setState({ value });
    this.debouncedOnSearch(value);
  };

  handleClear = () => {
    this.setState({ value: "" });
    this.props.onSearch("");
  };
}
