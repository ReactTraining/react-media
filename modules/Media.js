import React, { PropTypes } from 'react'
import json2mq from 'json2mq'

const queryType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
  PropTypes.arrayOf(PropTypes.object.isRequired)
])

/**
 * Conditionally renders based on whether or not a media query matches.
 */
class Media extends React.Component {
  static propTypes = {
    query: queryType,
    queries: PropTypes.objectOf(queryType),
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }

  static defaultProps = {
    defaultMatches: true
  }

  state = {
    matches: this.props.defaultMatches
  }

  updateMatches = () => {
    let { query, queries } = this.props
    if (query)
      this.setState({
        matches: this.queries.reduce((accumulated, { name, mediaQueryList }) => ({
          ...accumulated,
          [name]: mediaQueryList.matches,
        }), {}).match,
      })

    if (queries)
      this.setState({
        matches: this.queries.reduce((accumulated, { name, mediaQueryList }) => ({
          ...accumulated,
          [name]: mediaQueryList.matches,
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
      this.queries = [
        {
          name: 'match',
          mediaQueryList: window.matchMedia(query),
        }
      ]
    }

    if (queries) {
      queries = Object.keys(queries).map(mq => ({
        name: mq, 
        qs: json2mq(queries[mq]),
      }))
      this.queries = queries.map(mq => ({
        name: mq.name,
        mediaQueryList: window.matchMedia(mq.qs),
      }))
    }

    this.queries.map(ql => ql.mediaQueryList.addListener(this.updateMatches))
    this.updateMatches()
  }

  componentWillUnmount() {
    let { query, queries } = this.props
    if (query || queries)
      this.queries.map(ql => ql.mediaQueryList.removeListener(this.updateMatches))
  }

  render() {
    const { children, render, queries, query } = this.props
    const { matches } = this.state

    return (
      render ? (
        matches ? render() : null
      ) : children ? (
        typeof children === 'function' ? (
          query && children(matches) ||
          queries && children({ ...matches })
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
