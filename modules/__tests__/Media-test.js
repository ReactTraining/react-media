import React from "react";
import Media from "../Media";
import { renderStrict } from "./utils";

const createMockMediaMatcher = matchesOrMapOfMatches => qs => ({
  matches:
    typeof matchesOrMapOfMatches === "object"
      ? matchesOrMapOfMatches[qs]
      : matchesOrMapOfMatches,
  addListener: () => {},
  removeListener: () => {}
});

describe("A <Media> in browser environment", () => {
  let originalMatchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  const queries = {
    sm: "(max-width: 1000px)",
    lg: "(max-width: 2000px)"
  };

  describe("with a query that matches", () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    describe("and a child DOM element", () => {
      it("should render child", () => {
        const { container } = renderStrict(
          <Media query={queries.sm}>
            <div>matched</div>
          </Media>
        );

        expect(container.innerHTML).toMatch("matched");
      });
    });

    describe("and a child component", () => {
      it("should render child and provide matches as a prop", () => {
        const Component = props =>
          // eslint-disable-next-line react/prop-types
          props.matches === true && <span>matched</span>;

        const { container } = renderStrict(
          <Media query={queries.sm}>
            <Component />
          </Media>
        );

        expect(container.innerHTML).toMatch("matched");
      });
    });

    describe("and a children function", () => {
      it("should render its children function call result", () => {
        const { container } = renderStrict(
          <Media query={queries.sm}>
            {matches =>
              matches === true ? <span>children as a function</span> : null
            }
          </Media>
        );

        expect(container.innerHTML).toMatch("children as a function");
      });
    });

    describe("and a render prop", () => {
      it("should render `render` prop call result", () => {
        const { container } = renderStrict(
          <Media
            query={queries.sm}
            render={matches => matches === true && <span>render prop</span>}
          />
        );

        expect(container.innerHTML).toMatch("render prop");
      });
    });
  });

  describe("with multiple queries that match", () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    describe("and a child DOM element", () => {
      it("should render child", () => {
        const { container } = renderStrict(
          <Media queries={queries}>
            <div>fully matched</div>
          </Media>
        );

        expect(container.innerHTML).toMatch("fully matched");
      });
    });

    describe("and a child component", () => {
      it("should render child and provide matches as a prop", () => {
        const Component = props =>
          // eslint-disable-next-line react/prop-types
          props.matches.sm && props.matches.lg && <span>fully matched</span>;

        const { container } = renderStrict(
          <Media queries={queries}>
            <Component />
          </Media>
        );

        expect(container.innerHTML).toMatch("fully matched");
      });
    });

    describe("and a children function", () => {
      it("should render its children function call result", () => {
        const { container } = renderStrict(
          <Media queries={queries}>
            {matches =>
              matches.sm && matches.lg ? (
                <span>children as a function</span>
              ) : null
            }
          </Media>
        );

        expect(container.innerHTML).toMatch("children as a function");
      });
    });

    describe("and a render prop", () => {
      it("should render `render` prop call result", () => {
        const { container } = renderStrict(
          <Media
            queries={queries}
            render={matches =>
              matches.sm && matches.lg && <span>render prop</span>
            }
          />
        );

        expect(container.innerHTML).toMatch("render prop");
      });
    });
  });

  describe("with a query that does not match", () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(false);
    });

    describe("and a child DOM element", () => {
      it("should not render anything", () => {
        const { container } = (
          <Media query={queries.sm}>
            <div>I am not rendered</div>
          </Media>
        );

        expect(container).toBeUndefined();
      });
    });

    describe("and a child component", () => {
      it("should not render anything", () => {
        const Component = () => <span>I am not rendered</span>;

        const { container } = (
          <Media query={queries.sm}>
            <Component />
          </Media>
        );

        expect(container).toBeUndefined();
      });
    });

    describe("and a children function", () => {
      it("should render children function call result", () => {
        const { container } = renderStrict(
          <Media query={queries.sm}>
            {matches => matches === false && <span>no matches at all</span>}
          </Media>
        );

        expect(container.innerHTML).toMatch("no matches at all");
      });
    });

    describe("and a render prop", () => {
      it("should not call render prop at all", () => {
        const render = jest.fn();

        renderStrict(<Media query={queries.sm} render={render} />);

        expect(render).not.toBeCalled();
      });
    });
  });

  describe("with a multiple queries that do not match", () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(false);
    });

    describe("and a child DOM element", () => {
      it("should not render anything", () => {
        const { container } = renderStrict(
          <Media queries={queries}>
            <div>I am not rendered</div>
          </Media>
        );

        expect(container.innerHTML || "").not.toMatch("I am not rendered");
      });
    });

    describe("and a child component", () => {
      it("should not render anything", () => {
        const Component = () => <span>I am not rendered</span>;

        const { container } = renderStrict(
          <Media queries={queries}>
            <Component />
          </Media>
        );

        expect(container.innerHTML || "").not.toMatch("I am not rendered");
      });
    });

    describe("and a children function", () => {
      it("should render children function call result", () => {
        const { container } = renderStrict(
          <Media queries={queries}>
            {matches =>
              !matches.sm && !matches.lg && <span>no matches at all</span>
            }
          </Media>
        );

        expect(container.innerHTML).toMatch("no matches at all");
      });
    });

    describe("and a render prop", () => {
      it("should not call render prop at all", () => {
        const render = jest.fn();

        renderStrict(<Media queries={queries} render={render} />);

        expect(render).not.toBeCalled();
      });
    });
  });

  describe("with queries that partially match", () => {
    const queries = {
      sm: "(max-width: 1000px)",
      lg: "(max-width: 2000px)"
    };

    const matches = {
      "(max-width: 1000px)": true,
      "(max-width: 2000px)": false
    };

    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(matches);
    });

    describe("and a child component", () => {
      it("should render child and provide matches as a prop", () => {
        /* eslint-disable react/prop-types */
        const Component = props =>
          props.matches.sm &&
          !props.matches.lg && <span>partially matched</span>;
        /* eslint-enable */

        const { container } = renderStrict(
          <Media queries={queries}>
            <Component />
          </Media>
        );

        expect(container.innerHTML).toMatch("partially matched");
      });
    });

    describe("and a children function", () => {
      it("should render children function call result", () => {
        const { container } = renderStrict(
          <Media queries={queries}>
            {matches =>
              matches.sm &&
              !matches.lg && <span>yep, something definitely matched</span>
            }
          </Media>
        );

        expect(container.innerHTML).toMatch("yep, something definitely matched");
      });
    });

    describe("and a render prop", () => {
      it("should render `render` prop call result", () => {
        const { container } = renderStrict(
          <Media
            queries={queries}
            render={matches =>
              matches.sm && !matches.lg && <span>please render me</span>
            }
          />
        );

        expect(container.innerHTML).toMatch("please render me");
      });
    });
  });

  describe("when a custom targetWindow prop is passed", () => {
    const queries = { matches: { maxWidth: 320 } };

    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    it("renders its child", () => {
      const testWindow = {
        matchMedia: createMockMediaMatcher(false)
      };

      const { container } = renderStrict(
        <Media queries={queries} targetWindow={testWindow}>
          {({ matches }) => (matches ? <div>hello</div> : <div>goodbye</div>)}
        </Media>
      );

      expect(container.innerHTML).toMatch(/goodbye/);
    });

    describe("when a non-window prop is passed for targetWindow", () => {
      it("errors with a useful message", () => {
        const notAWindow = {};

        const element = (
          <Media queries={queries} targetWindow={notAWindow}>
            {({ matches }) => (matches ? <div>hello</div> : <div>goodbye</div>)}
          </Media>
        );

        expect(() => renderStrict(element)).toThrow("does not support `matchMedia`");
      });
    });
  });

  describe("when an onChange function is passed", () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(true);
    });

    it("calls the function with the match result", () => {
      const callback = jest.fn();
      renderStrict(<Media queries={{ matches: "" }} onChange={callback} />);

      expect(callback).toHaveBeenCalledWith({ matches: true });
    });
  });

  describe("when defaultMatches have been passed", () => {
    beforeEach(() => {
      window.matchMedia = createMockMediaMatcher(false);
    });

    describe("for a single query", () => {
      it("initially overwrites defaultMatches with matches from matchMedia", async () => {
        const { container } = renderStrict(
          <Media query="(min-width: 1000px)" defaultMatches={true}>
            {matches =>
              matches === true ? (
                <div>fully matched</div>
              ) : (
                <div>not matched</div>
              )
            }
          </Media>
        );

        expect(container.innerHTML).toMatch("not matched");
      });
    });

    describe("for multiple queries", () => {
      it("initially overwrites defaultMatches with matches from matchMedia", async () => {
        const { container } = renderStrict(
          <Media queries={{ matches: "(min-width: 1000px)" }} defaultMatches={{ matches: true }}>
            {({ matches }) =>
              matches ? <div>fully matched</div> : <div>not matched</div>
            }
          </Media>
        );

        expect(container.innerHTML).toMatch("not matched");
      });
    });
  });
});
