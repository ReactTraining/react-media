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
    ]),
    queries: PropTypes.shape({
      [PropTypes.string]: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.object.isRequired)
      ]),
    }),
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }

  state = {
    matches: true
  }

  updateMatches = () => {
    let { query, queries } = this.props
    if (query)
      this.setState({ matches: this.mediaQueryList.matches })

    if (queries)
      this.setState({
        matches: this.mediaQueryList.reduce((accumulated, { name, mm }) => ({
          ...accumulated,
          [name]: mm.matches,
        }), {}),
      })
  }

  componentWillMount() {
    if (typeof window !== 'object')
      return

    let { query, queries } = this.props

    if (query && typeof query !== 'string')
      query = json2mq(query)

    if (query) {
      this.mediaQueryList = window.matchMedia(query)
      this.mediaQueryList.addListener(this.updateMatches)
    }

    if (queries) {
      queries = Object.keys(queries).map(mq => ({
        name: mq, 
        qs: json2mq(queries[mq]),
      }))
      this.mediaQueryList = queries.map(mq => ({
        name: mq.name,
        mm: window.matchMedia(mq.qs),
      }))
      this.mediaQueryList.map(ql => ql.mm.addListener(this.updateMatches))
    }

    this.updateMatches()
  }

  componentWillUnmount() {
    let { query, queries } = this.props
    if (query)
      this.mediaQueryList.removeListener(this.updateMatches)
    if (queries)
      this.mediaQueryList.map(ql => ql.mm.removeListener(this.updateMatches))
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
