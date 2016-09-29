/* eslint-disable no-console, no-native-reassign */
import expect from 'expect'
import React from 'react'
import { render } from 'react-dom'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Media from '../Media'

describe('A <Media>', () => {
  let node
  beforeEach(() => {
    node = document.createElement('div')
  })

  describe('with a query that matches', () => {
    const query = `(max-width: ${window.innerWidth}px)`

    describe('and a children element', () => {
      it('renders its child', () => {
        const element = (
          <Media query={query}>
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
          <Media query={query}>
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

    describe('and a render function', () => {
      it('renders its child', () => {
        const element = (
          <Media query={query} render={() => (
            <div>hello</div>
          )}/>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch(/hello/)
        })
      })
    })
  })

  describe('with a query that does not match', () => {
    const query = `(min-width: ${window.innerWidth + 1}px)`

    describe('and a children element', () => {
      it('renders its child', () => {
        const element = (
          <Media query={query}>
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
          <Media query={query}>
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

    describe('and a render function', () => {
      it('does not render', () => {
        const element = (
          <Media query={query} render={() => (
            <div>hello</div>
          )}/>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toNotMatch(/hello/)
        })
      })

      it('does not call the render function', () => {
        let renderWasCalled = false
        const element = (
          <Media query={query} render={() => {
            renderWasCalled = true
            return <div/>
          }}/>
        )

        render(element, node, () => {
          expect(renderWasCalled).toBe(false)
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

  describe('compare render on server with render on client', () => {
    var cachedConsoleError = console.error
    beforeEach(() => {
      console.error = (message) => {
        throw new Error(message)
      }

      Media.identifier = 0
    })
    afterEach(() => {
      return console.error = cachedConsoleError
    })

    it('with children element', () => {
      const element = (
        <Media query="(min-width: 200px)" defaultMatches={true}>
          <div>hello</div>
        </Media>
      )

      const isClient = Media.isClient
      Media.isClient = false
      const serverHtml = renderToString(<Media query="(min-width: 200px)" defaultMatches={true}>
        <div>hello</div>
      </Media>)
      Media.isClient = isClient

      Media.identifier = 0
      node.innerHTML = serverHtml
      render(element, node)
    })

    it('with render function', () => {
      const element = (
        <Media query="(min-width: 200px)" defaultMatches={true} render={() => (
          <div>hello</div>
        )}/>
      )

      const isClient = Media.isClient
      Media.isClient = false
      const serverHtml = renderToString(element)
      Media.isClient = isClient

      Media.identifier = 0
      node.innerHTML = serverHtml
      render(element, node)
    })

    it('with children function', () => {
      const element = (
        <Media query="(min-width: 200px)" defaultMatches={true}>
          {matches => (
            matches ? <div>hello</div> : <div>goodbye</div>
          )}
        </Media>
      )

      const isClient = Media.isClient
      Media.isClient = false
      const serverHtml = renderToString(element)
      Media.isClient = isClient

      Media.identifier = 0
      node.innerHTML = serverHtml
      render(element, node)
    })
  })
})
