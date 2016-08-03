import expect from 'expect'
import React from 'react'
import { render } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import Media from '../Media'

describe('A <Media>', () => {
  let node
  beforeEach(() => {
    node = document.createElement('div')
  })

  describe('with a query that matches', () => {
    it('renders its child', () => {
      const query = `(max-width: ${window.innerWidth}px)`

      render(
        <Media query={query}>
          <div>hello</div>
        </Media>,
        node,
        () => {
          expect(node.firstChild.innerHTML).toMatch(/hello/)
        }
      )
    })
  })

  describe('with a query that does not match', () => {
    it('does not render its child', () => {
      const query = `(min-width: ${window.innerWidth + 1}px)`

      render(
        <Media query={query}>
          <div>hello</div>
        </Media>,
        node,
        () => {
          expect(node.firstChild.innerHTML).toNotMatch(/hello/)
        }
      )
    })
  })

  describe('rendered on the server', () => {
    it('renders its child', () => {
      const markup = renderToStaticMarkup(
        <Media query="(min-width: 200px)">
          <div>hello</div>
        </Media>
      )

      expect(markup).toMatch(/hello/)
    })
  })
})
