# react-media [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/ReactTraining/react-media/master.svg?style=flat-square
[build]: https://travis-ci.org/ReactTraining/react-media
[npm-badge]: https://img.shields.io/npm/v/react-media.svg?style=flat-square
[npm]: https://www.npmjs.org/package/react-media

[`react-media`](https://www.npmjs.com/package/react-media) is a CSS media query component for React.

A `<Media>` component listens for matches to a [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries) and renders stuff based on whether the query matches or not.

## Installation

Using npm:

    $ npm install --save react-media

Then, use as you would anything else:

```js
// using ES modules
import Media from 'react-media';

// using CommonJS modules
var Media = require('react-media');
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-media"></script>
```

You can find the library on `window.ReactMedia`.

## Basic usage

### queries

Render a `<Media>` component with a `queries` prop whose value is an object,
where each value is a valid
[CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries).
The `children` prop should be a function whose argument will be an object with the
same keys as your `queries` object, and whose values are booleans indicating whether
each query matches.

```jsx
import React, { Fragment } from 'react';
import Media from 'react-media';

class App extends React.Component {
  render() {
    return (
      <div>
        <Media queries={{
          small: "(max-width: 599px)",
          medium: "(min-width: 600px) and (max-width: 1199px)",
          large: "(min-width: 1200px)"
        }}>
          {matches => (
            <Fragment>
              {matches.small && <p>I am small!</p>}
              {matches.medium && <p>I am medium!</p>}
              {matches.large && <p>I am large!</p>}
            </Fragment>
          )}
        </Media>
      </div>
    );
  }
}
```

### query

Alternatively, if you only need to match against a single media query, the `query` prop provides a less-verbose approach.
More documentation about the difference betwen `query` and `queries` can be found below.

```jsx
import React, { Fragment } from 'react';
import Media from 'react-media';

class App extends React.Component {
  render() {
    return (
      <div>
        <Media query="(max-width: 599px)" render={() =>
          (
            <p>I am small!</p>
          )}
        />
      </div>
    );
  }
}
```

## `query` vs `queries`

The `queries` prop was added to allow for multiple media queries to be matched without excessive nesting or other
workarounds. The `query` prop was retained out of recognition that a single query covers many use cases, and there
is already a lot of usage that would be a pain to migrate.

The salient points:

* **You cannot use them together**: if you do, the component will throw an error. This is to avoid confusion around
precedence.
* **The render methods differ slightly**: for the `queries` prop, the `render` and child JSX methods will render if
**at least one** of the given queries is matched. The `query` prop renders if the given query matches.


## `queries`

In addition to passing a valid media query string, the `queries`
prop will also accept an object of objects whose forms are similar to
[React's built-in support for inline style objects](https://facebook.github.io/react/tips/inline-styles.html)
in e.g. `<div style>`. These objects are converted to CSS
media queries via [json2mq](https://github.com/akiran/json2mq/blob/master/README.md#usage).

```jsx
import React from 'react';
import Media from 'react-media';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>These two Media components are equivalent</h1>

        <Media queries={{ small: { maxWidth: 599 } }}>
          {matches =>
            matches.small ? (
              <p>The document is less than 600px wide.</p>
            ) : (
              <p>The document is at least 600px wide.</p>
            )
          }
        </Media>

        <Media queries={{ small: "(max-width: 599px)" }}>
          {matches =>
            matches.small ? (
              <p>The document is less than 600px wide.</p>
            ) : (
              <p>The document is at least 600px wide.</p>
            )
          }
        </Media>
      </div>
    );
  }
}
```

Keys of media query objects are camel-cased and numeric values automatically get the `px` suffix. See the [json2mq docs](https://github.com/akiran/json2mq/blob/master/README.md#usage) for more examples of queries you can construct using objects.

### Render props

There are three props which allow you to render your content. They each serve a subtly different purpose.

|prop|description|example|
|---|---|---|
|render|Only invoked when **at least one** of the queries matches. This is a nice shorthand if you only want to render something for a matching query.|`<Media queries={{ foo: ... }} render={() => <p>I matched!</p>} />`|
|children (function)|Receives an object of booleans whose keys are the same as the `queries` prop, indicating whether each media query matched. Use this prop if you need to render different output for each of specified queries.|`<Media queries={{ foo: ... }}>{matches => matches.foo ? <p>I matched!</p> : <p>I didn't match</p>}</Media>`|
|children (react element)|If you render a regular React element within `<Media>`, it will render that element when **at least one** of the queries matches. This method serves the same purpose as the `render` prop, however, you'll create component instances regardless of whether the queries match or not. Hence, using the `render` prop is preferred ([more info](https://github.com/ReactTraining/react-media/issues/70#issuecomment-347774260)).|`<Media queries={{ ... }}><p>I matched!</p></Media>`|

## `query`

In addition to passing a valid media query string, the `query` prop will also accept an object, similar to [React's built-in support for inline style objects](https://facebook.github.io/react/tips/inline-styles.html) in e.g. `<div style>`. These objects are converted to CSS media queries via [json2mq](https://github.com/akiran/json2mq/blob/master/README.md#usage).

```jsx
import React from 'react';
import Media from 'react-media';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>These two Media components are equivalent</h1>

        <Media query={{ maxWidth: 599 }}>
          {matches =>
            matches ? (
              <p>The document is less than 600px wide.</p>
            ) : (
              <p>The document is at least 600px wide.</p>
            )
          }
        </Media>

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
    );
  }
}
```

Keys of media query objects are camel-cased and numeric values automatically get the `px` suffix. See the [json2mq docs](https://github.com/akiran/json2mq/blob/master/README.md#usage) for more examples of queries you can construct using objects.

### Render props

There are three props which allow you to render your content. They each serve a subtly different purpose.

|prop|description|example|
|---|---|---|
|render|Only invoked when the query matches. This is a nice shorthand if you only want to render something for a matching query.|`<Media query="..." render={() => <p>I matched!</p>} />`|
|children (function)|Receives a single boolean element, indicating whether the media query matched. Use this prop if you need to render something when the query doesn't match.|`<Media query="...">{matches => matches ? <p>I matched!</p> : <p>I didn't match</p>}</Media>`|
|children (react element)|If you render a regular React element within `<Media>`, it will render that element when the query matches. This method serves the same purpose as the `render` prop, however, you'll create component instances regardless of whether the query matches or not. Hence, using the `render` prop is preferred ([more info](https://github.com/ReactTraining/react-media/issues/70#issuecomment-347774260)).|`<Media query="..."><p>I matched!</p></Media>`|

## `onChange`

You can specify an optional `onChange` prop, which is a callback function that will be invoked when the status of the media queries changes. This can be useful for triggering side effects, independent of the render lifecycle.

```jsx
import React from 'react';
import Media from 'react-media';

class App extends React.Component {
  render() {
    return (
      <div>
        <Media
          query={{ small: "(max-width: 599px)" }}
          onChange={matches =>
            matches.small
              ? alert('The document is less than 600px wide.')
              : alert('The document is at least 600px wide.')
          }
        />
      </div>
    );
  }
}
```

### Server-side rendering (SSR)

If you render a `<Media>` component on the server, it will match by default. You can override the default behavior by setting the `defaultMatches` prop.

When rendering on the server you can use the `defaultMatches` prop to set the initial state on the server to match whatever you think it will be on the client. You can detect the user's device [by analyzing the user-agent string](https://github.com/ReactTraining/react-media/pull/50#issuecomment-415700905) from the HTTP request in your server-side rendering code.

```js
initialState = {
  device: 'mobile' // add your own guessing logic here, based on user-agent for example
};

<div>
  <Media
    queries={{ medium: "(max-width: 500px)" }}
    defaultMatches={{ medium: state.device === 'mobile' }}
    render={() => <Text>Render me below medium breakpoint.</Text>}
  />

  <Media
    queries={{ medium: "(min-width: 501px)" }}
    defaultMatches={{ medium: state.device === 'desktop' }}
    render={() => <Text>Render me above medium breakpoint.</Text>}
  />
</div>;
```

## `targetWindow`

An optional `targetWindow` prop can be specified if you want the `queries` to be evaluated against a different window object than the one the code is running in. This can be useful if you are rendering part of your component tree to an iframe or [a popup window](https://hackernoon.com/using-a-react-16-portal-to-do-something-cool-2a2d627b0202). See [this PR thread](https://github.com/ReactTraining/react-media/pull/78) for context.

## About

`react-media` is developed and maintained by [React Training](https://reacttraining.com). If you're interested in learning more about what React can do for your company, please [get in touch](mailto:hello@reacttraining.com)!
