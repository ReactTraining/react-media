import React, { PropTypes } from 'react'
import Style from './Style'

class Media extends React.Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    defaultMatches: PropTypes.bool,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ])
  }

  static identifier = 0

  static isClient = (typeof window === 'object')

  state = {
    matches: true
  }

  firstRender = true

  updateMatches = () =>
    this.setState({ matches: this.mediaQueryList.matches })

  componentWillMount() {
    if (Media.isClient) {
      this.mediaQueryList = window.matchMedia(this.props.query)
      this.mediaQueryList.addListener(this.updateMatches)
      this.updateMatches()
    }
  }

  componentDidMount() {
    const { defaultMatches } = this.props

    if (defaultMatches && this.firstRender) {
      this.firstRender = false
      this.forceUpdate()
    }
  }

  componentWillUnmount() {
    this.mediaQueryList.removeListener(this.updateMatches)
  }

  universalRender = (query, children, render) => {
    const StyleElement = <Style query={query} identifier={Media.identifier} />

    let MatchCom = null
    let UnmatchCom = null

    if (render) {
      MatchCom = render()
      UnmatchCom = null
    } else if (typeof children === 'function') {
      MatchCom = children(true)
      UnmatchCom = children(false)
    } else {
      MatchCom = React.Children.only(children)
      UnmatchCom = null
    }

    let MatchElement = null
    let UnmatchElement = null

    if (MatchCom) {
      MatchElement = React.cloneElement(MatchCom, {
        'data-react-mediaid-match': Media.identifier,
      })
    }
    if (UnmatchCom) {
      UnmatchElement = React.cloneElement(UnmatchCom, {
        'data-react-mediaid-unmatch': Media.identifier,
      })
    }

    Media.identifier++

    return (<placeholder>
      {StyleElement}
      {MatchElement}
      {UnmatchElement}
    </placeholder>)
  }

  render() {
    const { defaultMatches, query, children, render } = this.props
    const { matches } = this.state

    if (defaultMatches && this.firstRender) return this.universalRender(query, children, render)

    if (matches && render)
      return render()

    if (typeof children === 'function')
      return children(matches)

    return matches ? React.Children.only(children) : null
  }
}

export default Media
