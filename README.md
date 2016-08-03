# react-media [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/ReactTraining/react-media/master.svg?style=flat-square
[build]: https://travis-ci.org/ReactTraining/react-media

[npm-badge]: https://img.shields.io/npm/v/react-media.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-media

[`react-media`](https://www.npmjs.com/package/react-media) is a CSS media query component for React.

A `<Media>` component listens for matches to a [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries) and conditionally renders `this.props.children` based on whether the query matches or not.

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

Render a `<Media>` component with a `query` prop whose value is a valid [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries). When that query is valid, the component will render its [children](https://facebook.github.io/react/tips/children-props-type.html) (i.e. `this.props.children`). When the query doesn't match, it renders nothing.

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
        <Media query="(min-width: 600px)">
          <p>The document is at least 600px wide.</p>
        </Media>
      </div>
    )
  }
}
```

If you render a `<Media>` component on the server, it will always render its children.

That's it :) Enjoy!
