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
    describe('and a children element', () => {
      it('renders its child', () => {
        const element = (
          <Media query={`(max-width: ${window.innerWidth}px)`}>
            <div>hello</div>
          </Media>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch(/hello/)
        })
      })
    })

    describe('and a children function', () => {
      it('renders its child', () => {
        const element = (
          <Media query={`(max-width: ${window.innerWidth}px)`}>
            {matches => (
              matches ? <div>hello</div> : <div>goodbye</div>
            )}
          </Media>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch(/hello/)
        })
      })
    })
  })

  describe('with a query that does not match', () => {
    describe('and a children element', () => {
      it('renders its child', () => {
        const element = (
          <Media query={`(min-width: ${window.innerWidth + 1}px)`}>
            <div>hello</div>
          </Media>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toNotMatch(/hello/)
        })
      })
    })

    describe('and a children function', () => {
      it('renders its child', () => {
        const element = (
          <Media query={`(min-width: ${window.innerWidth + 1}px)`}>
            {matches => (
              matches ? <div>hello</div> : <div>goodbye</div>
            )}
          </Media>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch(/goodbye/)
        })
      })
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
