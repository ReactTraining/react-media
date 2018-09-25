import React from "react";
import PropTypes from "prop-types";
import invariant from "invariant";
import json2mq from "json2mq";

import MediaQueryList from "./MediaQueryList";

/**
 * Conditionally renders based on whether or not a media query matches.
 */
class Media extends React.Component {
  static propTypes = {
    defaultMatches: PropTypes.bool,
    query: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object.isRequired)
    ]).isRequired,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    targetWindow: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    defaultMatches: true
  };

  state = {
    matches: this.props.defaultMatches
  };

  updateMatches = () => {
    const { matches } = this.mediaQueryList;

    this.setState({ matches });

    const { onChange } = this.props;
    if (onChange) {
      onChange(matches);
    }
  };

  componentWillMount() {
    if (typeof window !== "object") return;

    const targetWindow = this.props.targetWindow || window;

    invariant(
      typeof targetWindow.matchMedia === "function",
      "<Media targetWindow> does not support `matchMedia`."
    );

    let { query } = this.props;
    if (typeof query !== "string") query = json2mq(query);

    this.mediaQueryList = new MediaQueryList(
      targetWindow,
      query,
      this.updateMatches
    );
    this.updateMatches();
  }

  componentWillUnmount() {
    this.mediaQueryList.cancel();
  }

  render() {
    const { children, render } = this.props;
    const { matches } = this.state;

    return render
      ? matches
        ? render()
        : null
      : children
        ? typeof children === "function"
          ? children(matches)
          : !Array.isArray(children) || children.length // Preact defaults to empty children array
            ? matches
              ? React.Children.only(children)
              : null
            : null
        : null;
  }
}

export default Media;
