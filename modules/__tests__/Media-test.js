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

    describe('and an object query', () => {
      it('renders its child', () => {
        const query = { maxWidth: window.innerWidth }
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

    describe('and a queries object', () => {
      it('renders its child', () => {
        const queries = { 
          sm: {
            maxWidth: window.innerWidth,
          },
        }
        const element = (
          <Media queries={queries} render={() => (
            <div>hello</div>
          )}/>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toMatch(/hello/)
        })
      })
      
      it('passes matches for each key', () => {
        const queries = { 
          sm: {
            maxWidth: window.innerWidth,
          },
          md: {
            maxWidth: window.innerWidth - 1,
          },
        }
        const element = (
          <Media queries={queries}>
            {({ sm, md }) => (
              <div>
                {md && 'goodbye'}
                {sm && 'hello'}
              </div>
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

    describe('and an object query', () => {
      it('does not render its child', () => {
        const query = { minWidth: window.innerWidth + 1 }
        const element = (
          <Media query={query} render={() => (
            <div>hello</div>
          )}/>
        )

        render(element, node, () => {
          expect(node.firstChild.innerHTML).toNotMatch(/hello/)
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
