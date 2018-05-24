# react-media-universal [![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/react-media-universal.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-media-universal

[`react-media-universal`](https://www.npmjs.com/package/react-media-universal) is a CSS media query component for React, for use with server side rendering.

It is based on [`react-media`](https://www.npmjs.com/package/react-media-universal) and uses the same API, with the addition of a `<MediaProvider>` component. It solves problems when hydrating a server side rendered app that uses `<Media>` components for conditional rendering.

## Installation

Using npm:

    $ npm install --save react-media-universal

Then, use the `<MediaProvider>` and `<Media>` component as you would anything else:

```js
// using ES modules
import Media, { MediaProvider } from "react-media-universal";

// using CommonJS modules
var Media = require("react-media-universal");
var MediaProvider = require("react-media-universal").MediaProvider;
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-media-universal/umd/react-media-universal.min.js"></script>
```

You can find the library on `window.ReactMediaUniversal`.

## Usage

Make sure to wrap your entire tree in the `<MediaProvider>` component for the hydration from server side rendering to work properly.

For the API of the `<Media>` component, see the [docs for `react-media`](https://github.com/ReactTraining/react-media).

```jsx
import React from "react";
import Media, { MediaProvider } from "react-media-universal";

class App extends React.Component {
  render() {
    return (
      <MediaProvider>
        <div>
          <Media query="(max-width: 599px)">
            {matches =>
              matches ? (
                <p>The document is less than 600px wide.</p>
              ) : (
                <p>The document is at least 600px wide.</p>
              )
            }
          </Media>
        </div>
      </MediaProvider>
    );
  }
}
```

If you render a `<Media>` component on the server, it always matches. To change this behaviour, use the `defaultMatches` prop:

```jsx
import React from "react";
import Media, { MediaProvider } from "react-media-universal";

class App extends React.Component {
  render() {
    return (
      <MediaProvider>
        <div>
          <Media
            query="(max-width: 599px)"
            defaultMatches={false}
            render={() => <p>This will not be rendered on the server, nor on the first render pass on client, even if the screen is less than 600px wide.</p>}
          />
        </div>
      </MediaProvider>
    );
  }
}
```

## About

`react-media-universal` is developed and maintained by [Hyperlab](https://hyperlab.se). If you're intrested in this library, or the other things we do, please [send us an e-mail](mailto:hej@hyperlab.se)!
