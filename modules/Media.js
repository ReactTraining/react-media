import React, { PropTypes } from 'react'
import json2mq from 'json2mq'

class Media extends React.Component {
  state = {
    matches: true
  }

  updateMatches = () =>
    this.setState({ matches: this.mediaQueryList.matches })

  componentWillMount() {
    let { query } = this.props

    if (typeof query !== 'string')
      query = json2mq(query)

    if (typeof window === 'object') {
      this.mediaQueryList = window.matchMedia(query)
      this.mediaQueryList.addListener(this.updateMatches)
      this.updateMatches()
    }
  }

  componentWillUnmount() {
    this.mediaQueryList.removeListener(this.updateMatches)
  }

  render() {
    const { children, render } = this.props
    const { matches } = this.state

    if (matches && render)
      return render()

    if (typeof children === 'function')
      return children(matches)

    return matches ? React.Children.only(children) : null
  }
}

if (__DEV__) {
  Media.propTypes = {
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
}

export default Media
