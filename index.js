const React = require('react');
const ReactDOM = require('react-dom');

class Item extends React.Component {
  render() {
    return (
      <h1>Hello world</h1>
    );
  }
}

const mountNode = document.getElementById('container');
const rootComponent = <Item />
ReactDOM.render(rootComponent, mountNode);
