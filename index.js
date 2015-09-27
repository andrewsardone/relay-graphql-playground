const React = require('react');
const ReactDOM = require('react-dom');
const Relay = require('react-relay');

class Item extends React.Component {
  render() {
    const item = this.props.store;

    return (
      <div>
        <h1><a href={item.url}>{item.title}</a></h1>
        <h2>{item.score} – {item.by.id}</h2>
      </div>
    );
  }
}

class TopItems extends React.Component {
  render() {
    const items = this.props.store.stories.map(
      (store, idx) => <Item store={store} key={idx} />
    );
    return (
      <div>
        {items}
      </div>
    );
  }
}

// Use a higher-order component to wrap our Item component with Relay goodness
// like saying we need to fill in the component's ‘store’ prop with the data
// described. But that's not saying _how_ to fetch the data, just what we need.
Item = Relay.createContainer(Item, {
  fragments: {
    store: () => Relay.QL`
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
        stories(storyType: $storyType) { ${Item.getFragment('store')} },
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
