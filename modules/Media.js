import React, { PropTypes } from 'react'

class Media extends React.Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  }

  state = {
    matches: false
  }

  updateMatches = () =>
    this.setState({ matches: this.mediaQueryList.matches })

  componentWillMount() {
    this.mediaQueryList = window.matchMedia(this.props.query)
    this.mediaQueryList.addListener(this.updateMatches)
    this.updateMatches()
  }

  componentWillUnmount() {
    this.mediaQueryList.removeListener(this.updateMatches)
  }

  render() {
    return this.state.matches ? React.Children.only(this.props.children) : null
  }
}

export default Media
