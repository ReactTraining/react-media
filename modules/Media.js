import React from "react";
import PropTypes from "prop-types";
import invariant from "invariant";
import json2mq from "json2mq";

import MediaQueryListener from "./MediaQueryListener";

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
    defaultMatches: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.objectOf(PropTypes.bool)
    ]),
    query: queryType,
    queries: PropTypes.objectOf(queryType),
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    targetWindow: PropTypes.object,
    onChange: PropTypes.func
  };

  queries = [];

  constructor(props) {
    super(props);

    invariant(
      !(!props.query && !props.queries) || (props.query && props.queries),
      '<Media> must be supplied with either "query" or "queries"'
    );

    invariant(
      props.defaultMatches === undefined ||
        !props.query ||
        typeof props.defaultMatches === "boolean",
      "<Media> when query is set, defaultMatches must be a boolean, received " +
        typeof props.defaultMatches
    );

    invariant(
      props.defaultMatches === undefined ||
        !props.queries ||
        typeof props.defaultMatches === "object",
      "<Media> when queries is set, defaultMatches must be a object of booleans, received " +
        typeof props.defaultMatches
    );

    if (typeof window !== "object") {
      // In case we're rendering on the server, apply the default matches
      let matches;
      if (props.defaultMatches !== undefined) {
        matches = props.defaultMatches;
      } else if (props.query) {
        matches = true;
      } /* if (props.queries) */ else {
        matches = Object.keys(this.props.queries).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
      }
      this.state = {
        matches
      };
      return;
    }

    this.initialize();

    // Instead of calling this.updateMatches, we manually set the initial state to prevent
    // calling setState, which could trigger an unnecessary second render
    this.state = {
      matches:
        this.props.defaultMatches !== undefined
          ? this.props.defaultMatches
          : this.getMatches()
    };

    this.onChange();
  }

  getMatches = () => {
    const result = this.queries.reduce(
      (acc, { name, mqListener }) => ({ ...acc, [name]: mqListener.matches }),
      {}
    );

    // return result;
    return unwrapSingleQuery(result);
  };

  updateMatches = () => {
    const newMatches = this.getMatches();

    this.setState(
      () => ({
        matches: newMatches
      }),
      this.onChange
    );
  };

  initialize() {
    const targetWindow = this.props.targetWindow || window;

    invariant(
      typeof targetWindow.matchMedia === "function",
      "<Media targetWindow> does not support `matchMedia`."
    );

    const queries = this.props.queries || wrapInQueryObject(this.props.query);

    this.queries = Object.keys(queries).map(name => {
      const query = queries[name];
      const qs = typeof query !== "string" ? json2mq(query) : query;
      const mqListener = new MediaQueryListener(
        targetWindow,
        qs,
        this.updateMatches
      );

      return { name, mqListener };
    });
  }

  componentDidMount() {
    this.initialize();
    // If props.defaultMatches has been set, ensure we trigger a two-pass render.
    // This is useful for SSR with mismatching defaultMatches vs actual matches from window.matchMedia
    // Details: https://github.com/ReactTraining/react-media/issues/81
    if (this.props.defaultMatches !== undefined) {
      this.updateMatches();
    }
  }

  onChange() {
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.state.matches);
    }
  }

  componentWillUnmount() {
    this.queries.forEach(({ mqListener }) => mqListener.cancel());
  }

  render() {
    const { children, render } = this.props;
    const { matches } = this.state;

    const isAnyMatches =
      typeof matches === "object"
        ? Object.keys(matches).some(key => matches[key])
        : matches;

    return render
      ? isAnyMatches
        ? render(matches)
        : null
      : children
      ? typeof children === "function"
        ? children(matches)
        : !Array.isArray(children) || children.length // Preact defaults to empty children array
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

/**
 * Wraps a single query in an object. This is used to provide backward compatibility with
 * the old `query` prop (as opposed to `queries`). If only a single query is passed, the object
 * will be unpacked down the line, but this allows our internals to assume an object of queries
 * at all times.
 */
function wrapInQueryObject(query) {
  return { __DEFAULT__: query };
}

/**
 * Unwraps an object of queries, if it was originally passed as a single query.
 */
function unwrapSingleQuery(queryObject) {
  const queryNames = Object.keys(queryObject);
  if (queryNames.length === 1 && queryNames[0] === "__DEFAULT__") {
    return queryObject.__DEFAULT__;
  }
  return queryObject;
}

export default Media;
