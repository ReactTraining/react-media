import expect from 'expect'
import React from 'react'
import { render } from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import { Media, MediaMock } from '../index'

describe('A <MediaMock>', () => {
  let node
  beforeEach(() => {
    node = document.createElement('div')
  })

  describe('with a mockedMedia that is different from the browser and a child <Media>', () => {
    const mockedMedia = {
      width: window.innerWidth + 1
    }

    describe('with a object query that', () => {
      describe('matches the mockedMedia', () => {
        const query = mockedMedia
          
        describe('but not the browser', () => {
          it('renders its child', () => {
            const element = (
              <MediaMock mockedMedia={mockedMedia}>
                <Media query={query}>
                  <div>hello</div>
                </Media>
              </MediaMock>
            )

            render(element, node, () => {
              expect(node.firstChild.innerHTML).toMatch(/hello/)
            })
          })
        })
      })

      describe('does not match the mockedMedia', () => {
        const query = {
          ...mockedMedia
        }
        --query.width

        describe('and ignores that it matches the browser', () => {
          it('does not render its child', () => {
            const element = (
              <MediaMock mockedMedia={mockedMedia}>
                <Media query={query}>
                  <div>hello</div>
                </Media>
              </MediaMock>
            )

            render(element, node, () => {
              expect(node.firstChild.innerHTML).toNotMatch(/hello/)
            })
          })
        })
      })

      describe('is partially matched by mockedMedia', () => {
        const partiallyMatchedQuery = {
          height: window.innerHeight,
          ...mockedMedia
        }

        describe('and the rest of the query matches the browser', () => {
          it('renders its child', () => {
            const element = (
              <MediaMock mockedMedia={mockedMedia}>
                <Media query={partiallyMatchedQuery}>
                  <div>hello</div>
                </Media>
              </MediaMock>
            )

            render(element, node, () => {
              expect(node.firstChild.innerHTML).toMatch(/hello/)
            })
          })
        })

        describe('and the rest of the query does not match the browser', () => {
          const query = {
            ...partiallyMatchedQuery
          }
          ++query.height

          it('does not render its child', () => {
            const element = (
              <MediaMock mockedMedia={mockedMedia}>
                <Media query={query}>
                  <div>hello</div>
                </Media>
              </MediaMock>
            )

            render(element, node, () => {
              expect(node.firstChild.innerHTML).toNotMatch(/hello/)
            })
          })
        })
      })
    })

    describe('with a string query', () => {
      describe('that is not matched by mockedMedia', () => {
        const query = `(width: ${window.innerWidth}px)`

        describe('but matches browser', () => {
          it('ignores mockedMedia and renders its child', () => {
            const element = (
              <MediaMock mockedMedia={mockedMedia}>
                <Media query={query}>
                  <div>hello</div>
                </Media>
              </MediaMock>
            )

            render(element, node, () => {
              expect(node.firstChild.innerHTML).toMatch(/hello/)
            })
          })
        })
      })
    })
  })

  describe('with a mockedMedia and a child <Media>', () => {
    const mockedMedia = {
      width: 50
    }
    describe('with a query', () => {
      describe('that is matched by the mockedMedia', () => {
        const query = mockedMedia
        it('renders its child', () => {
          const markup = renderToStaticMarkup(
            <MediaMock mockedMedia={mockedMedia}>
              <Media query={query}>
                <div>hello</div>
              </Media>
            </MediaMock>
          )

          expect(markup).toMatch(/hello/)
        })
      })

      describe('that is partially matched by the mockedMedia', () => {
        const query = {
          height: 50,
          ...mockedMedia
        }

        it('does not render its child', () => {
          const markup = renderToStaticMarkup(
            <MediaMock mockedMedia={mockedMedia}>
              <Media query={query}>
                <div>hello</div>
              </Media>
            </MediaMock>
          )

          expect(markup).toNotMatch(/hello/)
        })
      })
    })
  })
})
