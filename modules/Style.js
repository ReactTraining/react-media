import React, { PropTypes } from 'react'

const Style = ({ query, identifier }) => (<style>{`
  [data-react-mediaid-match=${identifier}] {
    display: none;
  }
  [data-react-mediaid-unmatch=${identifier}] {
    display: block;
  }
  @media ${query} {
    [data-react-mediaid-match=${identifier}] {
      display: block;
    }
    [data-react-mediaid-unmatch=${identifier}] {
      display: none;
    }
  }
`}</style>)

Style.propTypes = {
  query: PropTypes.string.isRequired,
  identifier: PropTypes.number.isRequired,
}

export default Style
