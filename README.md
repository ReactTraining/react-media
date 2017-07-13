# react-media [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/ReactTraining/react-media/master.svg?style=flat-square
[build]: https://travis-ci.org/ReactTraining/react-media

[npm-badge]: https://img.shields.io/npm/v/react-media.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-media

[`react-media`](https://www.npmjs.com/package/react-media) is a CSS media query component for React.

A `<Media>` component listens for matches to a [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries) and renders stuff based on whether the query matches or not.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-media

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES modules
import Media from 'react-media'

// using CommonJS modules
var Media = require('react-media')
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-media/umd/react-media.min.js"></script>
```

You can find the library on `window.ReactMedia`.

## Usage

Render a `<Media>` component with a `query` prop whose value is a valid [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries). The `children` prop should be a function whose only argument will be a boolean flag that indicates whether the media query matches or not.

```jsx
import React from 'react'
import Media from 'react-media'

class App extends React.Component {
  render() {
    return (
      <div>
        <Media query="(max-width: 599px)">
          {matches => matches ? (
            <p>The document is less than 600px wide.</p>
          ) : (
            <p>The document is at least 600px wide.</p>
          )}
        </Media>
      </div>
    )
  }
}
```

If you render a `<Media>` component on the server, it always matches.

If you use a regular React element as `children` (i.e. `<Media><SomethingHere/></Media>`) it will be rendered if the query matches. However, *you may end up creating a bunch of elements that won't ever actually be rendered to the page* (i.e. you'll do a lot of unnecessary `createElement`s on each `render`). Thus, a `children` **function** (i.e. `<Media>{matches => ...}</Media>`) is the preferred API. Then you can decide in the callback which elements to create based on the result of the query.

For the common case of "only render something when the media query matches", you can use a `render` prop that is only called if the query matches.

```jsx
import React from 'react'
import Media from 'react-media'

class App extends React.Component {
  render() {
    return (
      <div>
        <Media query="(max-width: 599px)" render={() => (
          <p>The document is less than 600px wide.</p>
        )}/>
      </div>
    )
  }
}
```

The `render` prop is never called if the query does not match.

`<Media query>` also accepts an object, similar to [React's built-in support for inline style objects](https://facebook.github.io/react/tips/inline-styles.html) in e.g. `<div style>`. These objects are converted to CSS media queries via [json2mq](https://github.com/akiran/json2mq/blob/master/README.md#usage).

```jsx
import React from 'react'
import Media from 'react-media'

class App extends React.Component {
  render() {
    return (
      <div>
        <Media query={{ maxWidth: 599 }}>
          {matches => matches ? (
            <p>The document is less than 600px wide.</p>
          ) : (
            <p>The document is at least 600px wide.</p>
          )}
        </Media>
      </div>
    )
  }
}
```

Keys of media query objects are camel-cased and numeric values automatically get the `px` suffix. See the [json2mq docs](https://github.com/akiran/json2mq/blob/master/README.md#usage) for more examples of queries you can construct using objects.

## About

Development of react-media is done by [React Training](https://reacttraining.com). If you're interested in learning more about what React can do for your company, please [get in touch](mailto:hello@reacttraining.com)!
