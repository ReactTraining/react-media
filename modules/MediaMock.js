import React, { PropTypes } from 'react'

class MediaMock extends React.Component {
    static propTypes = {
        mockedMedia: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
        ])
    }

    getChildContext() {
        return {mockedMedia: this.props.mockedMedia}
    }

    render() {
        const { children } = this.props

        if(children && (!Array.isArray(children) || children.length)) // Preact defaults to empty children array
            return React.Children.only(children)

        return null
    }
}

MediaMock.childContextTypes = {
  mockedMedia: React.PropTypes.object.isRequired
}

export default MediaMock