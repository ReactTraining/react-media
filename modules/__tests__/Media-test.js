import React from 'react';

import Media from '../Media';
import { renderStrict, serverRenderStrict } from './utils';

function createMockMediaMatcher(matches) {
  return () => ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {}
  });
}

describe('A <Media>', () => {
  let originalMatchMedia;
  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  let node;
  beforeEach(() => {
    node = document.createElement('div');
  });

  describe('with a query that matches', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    describe('and a children element', () => {
      it('renders its child', () => {
        const element = (
          <Media query="">
            <div>hello</div>
          </Media>
        );

        renderStrict(element, node, () => {
          expect(node.innerHTML).toMatch(/hello/);
        });
      });
    });

    describe('and a children function', () => {
      it('renders its child', () => {
        const element = (
          <Media query="">
            {matches => (matches ? <div>hello</div> : <div>goodbye</div>)}
          </Media>
        );

        renderStrict(element, node, () => {
          expect(node.innerHTML).toMatch(/hello/);
        });
      });
    });

    describe('and a render function', () => {
      it('renders its child', () => {
        const element = <Media query="" render={() => <div>hello</div>} />;

        renderStrict(element, node, () => {
          expect(node.innerHTML).toMatch(/hello/);
        });
      });
    });
  });

  describe('with a query that does not match', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(false);
    });

    describe('and a children element', () => {
      it('does not render its child', () => {
        const element = (
          <Media query="">
            <div>hello</div>
          </Media>
        );

        renderStrict(element, node, () => {
          expect(node.innerHTML || '').not.toMatch(/hello/);
        });
      });
    });

    describe('and a children function', () => {
      it('renders according to a non match', () => {
        const element = (
          <Media query="">
            {matches => (matches ? <div>hello</div> : <div>goodbye</div>)}
          </Media>
        );

        renderStrict(element, node, () => {
          expect(node.innerHTML).toMatch(/goodbye/);
        });
      });
    });

    describe('and a render function', () => {
      it('does not render', () => {
        let renderWasCalled = false;
        const element = (
          <Media
            query=""
            render={() => {
              renderWasCalled = true;
              return <div>hello</div>;
            }}
          />
        );

        renderStrict(element, node, () => {
          expect(node.innerHTML || '').not.toMatch(/hello/);
          expect(renderWasCalled).toBe(false);
        });
      });
    });
  });

  describe('when a custom targetWindow prop is passed', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    it('renders its child', () => {
      const testWindow = {
        matchMedia: createMockMediaMatcher(false)
      };

      const element = (
        <Media query="" targetWindow={testWindow}>
          {matches => (matches ? <div>hello</div> : <div>goodbye</div>)}
        </Media>
      );

      renderStrict(element, node, () => {
        expect(node.innerHTML).toMatch(/goodbye/);
      });
    });

    describe('when a non-window prop is passed for targetWindow', () => {
      it('errors with a useful message', () => {
        const notAWindow = {};

        const element = (
          <Media query="" targetWindow={notAWindow}>
            {matches => (matches ? <div>hello</div> : <div>goodbye</div>)}
          </Media>
        );

        expect(() => {
          renderStrict(element, node, () => {});
        }).toThrow('does not support `matchMedia`');
      });
    });
  });

  describe('when an onChange function is passed', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    it('calls the function with the match result', () => {
      const callback = jest.fn();
      const element = <Media query="" onChange={callback} />;

      renderStrict(element, node, () => {
        expect(callback).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('rendered on the server', () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    it('renders its child', () => {
      const markup = serverRenderStrict(
        <Media query="">
          <div>hello</div>
        </Media>
      );

      expect(markup).toMatch(/hello/);
    });
  });
});
