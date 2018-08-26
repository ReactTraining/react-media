import React from "react";
import PropTypes from "prop-types";
import invariant from "invariant";
import json2mq from "json2mq";

const queryType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
  PropTypes.arrayOf(PropTypes.object.isRequired)
]);

/**
 * Conditionally renders based on whether or not a media query matches.
 */
class Media extends React.Component {
  static propTypes = {
    defaultMatches: PropTypes.objectOf(PropTypes.bool),
    queries: PropTypes.objectOf(queryType).isRequired,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    targetWindow: PropTypes.object,
    onChange: PropTypes.func
  };

  queries = [];

  state = {
    matches:
      this.props.defaultMatches ||
      Object.keys(this.props.queries).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
  };

  updateMatches = () => {
    const newMatches = this.queries.reduce(
      (acc, { name, mqList }) => ({ ...acc, [name]: mqList.matches }),
      {}
    );
    this.setState({ matches: newMatches });

    const { onChange } = this.props;
    if (onChange) {
      onChange(newMatches);
    }
  };

  componentWillMount() {
    if (typeof window !== "object") return;

    const targetWindow = this.props.targetWindow || window;

    invariant(
      typeof targetWindow.matchMedia === "function",
      "<Media targetWindow> does not support `matchMedia`."
    );

    const { queries } = this.props;

    this.queries = Object.keys(queries).map(name => {
      const query = queries[name];
      const qs = typeof query !== "string" ? json2mq(query) : query;
      const mqList = targetWindow.matchMedia(qs);

      mqList.addListener(this.updateMatches);

      return { name, qs, mqList };
    });

    this.updateMatches();
  }

  componentWillUnmount() {
    this.queries.forEach(({ mqList }) =>
      mqList.removeListener(this.updateMatches)
    );
  }

  render() {
    const { children, render } = this.props;
    const { matches } = this.state;

    const isAnyMatches = Object.keys(matches).some(key => matches[key]);

    return render
      ? isAnyMatches
        ? render(matches)
        : null
      : children
        ? typeof children === "function"
          ? children(matches)
          : // Preact defaults to empty children array
            !Array.isArray(children) || children.length
            ? isAnyMatches
              ? // We have to check whether child is a composite component or not to decide should we
                // provide `matches` as a prop or not
                React.Children.only(children) &&
                typeof React.Children.only(children).type === "string"
                ? React.Children.only(children)
                : React.cloneElement(React.Children.only(children), { matches })
              : null
            : null
        : null;
  }
}

export default Media;
