const React = require('react');
const ReactDOM = require('react-dom');
const Relay = require('react-relay');

class Item extends React.Component {
  render() {
    const item = this.props.item;

    return (
      <div>
        <h1><a href={item.url}>{item.title}</a></h1>
        <h2>{item.score} – {item.by.id}</h2>
      </div>
    );
  }
}

class TopItems extends React.Component {
  // This `defaultProps` “stubbing” is only a stopgap, or at least a
  // demonstration of the coupling we have between TopItems and the Relay
  // Container. The pros of this coupling are the easy and slick out-of-the-box
  // data fetching with only a couple spots having knowledge of the wrapping
  // container. The con is that same coupling, but that's probably more
  // academic than anything.
  //
  // If this coupling bothers you (and at first glance it bothers me), you
  // could introduce yet-another wrapper via a pair of [smart & dumb
  // components][sd]. Some sort of `TopItemsRelay` component that interacts
  // with all of the `relay` property stuff, leaving the `TopItem` component
  // solely responsible for rendering based on its given props. But this seems
  // like overkill to me – lots of nesting for a minor benefit. What could be
  // interesting is the ability to implement arbitrary Component functions
  // (like `render()`) within the [RelayContainer][rc]. You could then get that
  // additional smart/dumb separation in the spot where you're already
  // augmenting a higher-order component.
  //
  // Food for thought…
  //
  // [sd]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
  // [rc]: https://github.com/facebook/relay/blob/d6ee51f5851a05f3d29915a6972318971e03daca/src/container/RelayContainer.js
  static defaultProps = {
    // Stub in `store` that's injected by a higher-order component.
    store: {
      stories: [],
    },
    // Stub in `relay` that's injected by a higher-order component, Relay
    // Container.
    //
    // See https://facebook.github.io/relay/docs/guides-containers.html
    relay: {
      variables: {
      },
      setVariables: function(_) {},
    },
  };

  render() {
    const items = this.props.store.stories.map(
      (item, idx) => <Item item={item} key={idx} />
    );
    const currentStoryType = (this.state && this.state.storyType) || this.props.relay.variables;
    return (
      <div>
        <select onChange={this._onChange} value={currentStoryType}>
          <option value="top">Top</option>
          <option value="new">New</option>
          <option value="ask">Ask HN</option>
          <option value="show">Show HN</option>
        </select>
        {items}
      </div>
    );
  }

  _onChange = (event) => {
    const storyType = event.target.value;
    this.setState({ storyType });
    this.props.relay.setVariables({ storyType });
  }
}

// Use a higher-order component to wrap our Item component with Relay goodness
// like saying we need to fill in the component's ‘store’ prop with the data
// described. But that's not saying _how_ to fetch the data, just what we need.
Item = Relay.createContainer(Item, {
  fragments: {
    item: () => Relay.QL`
      fragment on HackerNewsItem {
        by {
          id
        },
        id,
        score,
        title,
        url,
      }
    `
  },
});

TopItems = Relay.createContainer(TopItems, {
  initialVariables: {
    storyType: "top",
  },
  fragments: {
    store: () => Relay.QL`
      fragment on HackerNewsAPI {
        stories(storyType: $storyType) { ${Item.getFragment('item')} },
      }
    `,
  },
});

// Set up a Relay.Route which maps our various subqueries to a ‘root query’ for
// the actual data requests.
class HackerNewsRoute extends Relay.Route {
  static routeName = 'HackerNewsRoute';
  static queries = {
    store: (Component) => {
      // Component is our Item
      return Relay.QL`
        query root {
          hn { ${Component.getFragment('store')} },
        }
      `
    }
  };
}

// Point to our GraphQL API endpoint
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://www.GraphQLHub.com/graphql')
);

const mountNode = document.getElementById('container');
// The Relay.RootContainer is the top-level component that kicks off a query
// given a component hierarchy and route to follow
const rootComponent = <Relay.RootContainer Component={TopItems} route={new HackerNewsRoute()} />
ReactDOM.render(rootComponent, mountNode);
