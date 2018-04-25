import React from 'react';
import Context from './Context';

class MediaProvider extends React.Component {
  state = {
    mounted: false
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    const { mounted } = this.state;

    return <Context.Provider value={mounted} {...this.props} />;
  }
}

export default MediaProvider;
