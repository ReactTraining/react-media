import React from "react";
import { render } from '@testing-library/react';
import ReactDOMServer from 'react-dom/server';

let StrictMode = function(props) {
  return props.children || null;
};

if (React.StrictMode) {
  StrictMode = React.StrictMode;
}

export function renderStrict(element) {
  return render(<StrictMode>{element}</StrictMode>);
}

export function serverRenderStrict(element) {
  return ReactDOMServer.renderToStaticMarkup(<StrictMode>{element}</StrictMode>);
}
