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

  static defaultProps = {
    defaultMatches: true
  }

  state = {
    matches: this.props.defaultMatches
  }

  updateMatches = () =>
    this.setState({ matches: this.mediaQueryList.matches })

  handleMockedMedia = (query) => {
    this.mockedMediaMatch = true
    const mockedMedia = this.context.mockedMedia
    if(!mockedMedia || typeof query !== 'object')
      return query

    let mockedMediaProperties = []
    const features = Object.keys(mockedMedia)
    features.forEach((feature) => {
      const value = mockedMedia[feature]

      let min = query['min' + feature],
        exact = query[feature],
        max = query['max' + feature]

      if(typeof min === 'number') {
        mockedMediaProperties.push('min' + feature)
        if(value < min)
          this.mockedMediaMatch = false
      }

      if(typeof exact !== 'undefined') {
        mockedMediaProperties.push(feature)
        if(value !== exact)
          this.mockedMediaMatch = false
      }

      if(typeof max === 'number') {
        mockedMediaProperties.push('max' + feature)
        if(value > max) 
          this.mockedMediaMatch = false
      }
    })
    let rtnQuery = {
      ...query
    }

    Object.keys(query)
    .forEach(function(feature) {
      if(mockedMediaProperties.includes(feature))
        delete rtnQuery[feature]
    })

    return rtnQuery
   
  }

  componentWillMount() {
    let query = this.handleMockedMedia(this.props.query)
    
    if(!this.mockedMediaMatch) {
      this.setState({matches: false})
      return
    }

    if (typeof window !== 'object')
      return

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
Media.contextTypes = {
  mockedMedia: React.PropTypes.object
}

export default Media
