import React, { PropTypes } from 'react'
import json2mq from 'json2mq'

/**
 * Conditionally renders based on whether or not a media query matches.
 */
class Media extends React.Component {
  static propTypes = {
    query: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object.isRequired)
    ]).isRequired,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }

  state = {
    matches: true
  }

  updateMatches = () =>
    this.setState({ matches: this.mediaQueryList.matches })

  componentWillMount() {
    if (typeof window !== 'object')
      return

    let { query } = this.props

    if (typeof query !== 'string')
      query = json2mq(query)

    this.mediaQueryList = window.matchMedia(query)
    this.mediaQueryList.addListener(this.updateMatches)
    this.updateMatches()
  }

  componentWillUnmount() {
    this.mediaQueryList.removeListener(this.updateMatches)
  }

  render() {
    const { children, render } = this.props
    const { matches } = this.state

    return (
      render ? (
        matches ? render() : null
      ) : children ? (
        typeof children === 'function' ? (
          children(matches)
        ) : !Array.isArray(children) || children.length ? ( // Preact defaults to empty children array
          matches ? React.Children.only(children) : null
        ) : (
          null
        )
      ) : (
        null
      )
    )
  }
}

export default Media
