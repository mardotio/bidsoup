import React, { Component } from 'react';
import styled from 'styled-components';
import logo from './logo.svg';
import './App.css';

const ApiText = styled.p`
  color: rgb(24, 90, 134);
  font-size: large;
`;

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
        <ApiText>{this.state.data}</ApiText>
      </div>
    );
  }
}

export default App;
