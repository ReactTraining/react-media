import React, { PropTypes } from 'react'

class Media extends React.Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
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
    if (typeof window === 'object') {
      this.mediaQueryList = window.matchMedia(this.props.query)
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

export default Media
