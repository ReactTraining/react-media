import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import invariant from "invariant";
import json2mq from "json2mq";

import MediaQueryListener from "./MediaQueryListener";

const checkInvariants = ({ query, queries, defaultMatches }) => {
  invariant(
    !(!query && !queries) || (query && queries),
    '<Media> must be supplied with either "query" or "queries"'
  );

  invariant(
    defaultMatches === undefined ||
    !query ||
    typeof defaultMatches === "boolean",
    "<Media> when query is set, defaultMatches must be a boolean, received " +
    typeof defaultMatches
  );

  invariant(
    defaultMatches === undefined ||
    !queries ||
    typeof defaultMatches === "object",
    "<Media> when queries is set, defaultMatches must be a object of booleans, received " +
    typeof defaultMatches
  );
}

/**
 * Wraps a single query in an object. This is used to provide backward compatibility with
 * the old `query` prop (as opposed to `queries`). If only a single query is passed, the object
 * will be unpacked down the line, but this allows our internals to assume an object of queries
 * at all times.
 */
const wrapInQueryObject = query => ({ __DEFAULT__: query });

/**
 * Unwraps an object of queries, if it was originally passed as a single query.
 */
const unwrapSingleQuery = queryObject => {
  const queryNames = Object.keys(queryObject);
  if (queryNames.length === 1 && queryNames[0] === "__DEFAULT__") {
    return queryObject.__DEFAULT__;
  }
  return queryObject;
};

/**
 * Conditionally renders based on whether or not a media query matches.
 */
const Media = ({
  defaultMatches,
  query,
  queries,
  render,
  children,
  targetWindow,
  onChange,
}) => {
  checkInvariants({ query, queries, defaultMatches });
  // unclear - should this be a ref? module-defined?
  const activeQueries = useRef([]);
  // TODO: figure out initial value here.
  const getMatches = () => {
    const result = activeQueries.current.reduce(
      (acc, { name, mqListener }) => ({ ...acc, [name]: mqListener.matches }),
      {}
    );

    // return result;
    return unwrapSingleQuery(result);
  };
  const updateMatches = () => {
    const newMatches = getMatches();
    setMatches(newMatches);
  };

  const setUpMQLs = () => {
    const activeTargetWindow = targetWindow || window;

    invariant(
      typeof activeTargetWindow.matchMedia === "function",
      "<Media targetWindow> does not support `matchMedia`."
    );

    const queryObject = queries || wrapInQueryObject(query);

    activeQueries.current = Object.keys(queryObject).map(name => {
      const currentQuery = queryObject[name];
      const qs = typeof currentQuery !== "string" ? json2mq(currentQuery) : currentQuery;
      const mqListener = new MediaQueryListener(
        activeTargetWindow,
        qs,
        updateMatches,
      );

      return { name, mqListener };
    });
  };

  const [matches, setMatches] = useState(() => {
    if (typeof window !== "object") {
      // In case we're rendering on the server, apply the default matches
      if (defaultMatches !== undefined) {
        return defaultMatches;
      }
      if (query) {
        return true;
      }
      /* if (props.queries) */
      return Object.keys(queries).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
    }
    // Else we'll use the state from the MQLs that were just set up.
    setUpMQLs();
    return getMatches();
  });


  useEffect(
    // If props.defaultMatches has been set, ensure we trigger a two-pass render.
    // This is useful for SSR with mismatching defaultMatches vs actual matches from window.matchMedia
    // Details: https://github.com/ReactTraining/react-media/issues/81
    // TODO: figure out whether this is still technically a two-pass render.
    // Because setup happens in the state constructor, cleanup is the only thing that
    // useEffect is responsible for.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => () => activeQueries.current.forEach(({ mqListener }) => mqListener.cancel()),
    [],
  );

  useEffect(
    // Set up a separate listener for onChange since we ideally want to fire onChange
    // after flushes, rather than having to insert it synchronously before an update happens.
    () => {
      if (onChange) {
        onChange(matches);
      }
    },
    [matches, onChange],
  );

  // render
  const isAnyMatches =
    typeof matches === "object"
      ? Object.keys(matches).some(key => matches[key])
      : matches;

  return render
    ?  isAnyMatches
      ?  render(matches)
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

const queryType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
  PropTypes.arrayOf(PropTypes.object.isRequired)
]);

Media.propTypes = {
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

export default Media;
