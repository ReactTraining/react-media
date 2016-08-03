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
// using an ES6 transpiler, like babel
import { Media } from 'react-media'

// not using an ES6 transpiler
var Media = require('react-media').Media
```

The UMD build is also available on [npmcdn](https://npmcdn.com):

```html
<script src="https://npmcdn.com/react-media/umd/react-media.min.js"></script>
```

You can find the library on `window.ReactMedia`.

## Usage

Render a `<Media>` component with a `query` prop whose value is a valid [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries). When the query matches, the component uses its `render` prop to know what to render.

```js
import React from 'react'
import { Media } from 'react-media'

class App extends React.Component {
  render() {
    return (
      <div>
        <Media query="(max-width: 599px)" render={() => (
          <p>The document is less than 600px wide.</p>
        )}>
      </div>
    )
  }
}
```

The `render` prop is never called if the query does not match.

If you need to decide what to render based on whether or not the query matches, use a function as the value of the `children` prop (i.e. `this.props.children`).

```js
import React from 'react'
import { Media } from 'react-media'

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

If you use a regular React element as `children` it will be rendered if the query matches. However, *please note that when using this API you may end up creating a bunch of elements that won't ever actually be rendered to the page*. Thus, the `render` or `children` (as a function) props are the preferred API.

```js
import React from 'react'
import { Media } from 'react-media'

class App extends React.Component {
  render() {
    return (
      <div>
        <Media query="(max-width: 599px)">
          <p>The document is less than 600px wide.</p>
        </Media>
      </div>
    )
  }
}
```

If you render a `<Media>` component on the server, it always matches.

That's it :) Enjoy!
