import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    fetch('/api/bids')
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({data:data.message});
    }).catch(error => {
      this.setState({data:"Failed to GET"})
      console.log(error);
    })
  }

  render() {
    console.log(this.state.data);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p className="App-api">
          {this.state.data}
        </p>
      </div>
    );
  }
}

export default App;
