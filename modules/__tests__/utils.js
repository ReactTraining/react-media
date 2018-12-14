import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from 'react-dom/server';

let StrictMode = function(props) {
  return props.children || null;
};

if (React.StrictMode) {
  StrictMode = React.StrictMode;
}

export function renderStrict(element, node) {
  ReactDOM.render(<StrictMode>{element}</StrictMode>, node);
}

export function serverRenderStrict(element) {
  return ReactDOMServer.renderToStaticMarkup(<StrictMode>{element}</StrictMode>);
}
