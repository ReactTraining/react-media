import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from 'react-dom/server';

let StrictMode = function(props) {
  return props.children || null;
};

if (React.StrictMode) {
  StrictMode = React.StrictMode;
}

export function renderStrict(element, node, callback) {
  ReactDOM.render(<StrictMode>{element}</StrictMode>, node);
  callback();
}

export function serverRenderStrict(element) {
  return ReactDOMServer.renderToStaticMarkup(<StrictMode>{element}</StrictMode>);
}
