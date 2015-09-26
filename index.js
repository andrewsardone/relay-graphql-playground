const React = require('react');
const ReactDOM = require('react-dom');

class Item extends React.Component {
  render() {
    const item = this.props.store.item;

    return (
      <div>
        <h1><a href={item.url}>{item.title}</a></h1>
        <h2>{item.score} – {item.by.id}</h2>
      </div>
    );
  }
}

const store = {
  item: {
    id: '1337',
    url: 'http://google.com',
    title: 'Google',
    score: 100,
    by: {
      id: 'clay'
    }
  }
};

const mountNode = document.getElementById('container');
const rootComponent = <Item store={store} />
ReactDOM.render(rootComponent, mountNode);
