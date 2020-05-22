import React, { Component } from "react";
import "./Styles/App.css";
import Game from "./Game";
import ErrorBoundary from "./Components/ErrorBoundary";

class App extends Component {
  render() {
    return (
      <div className="App">
        <ErrorBoundary>
          <Game />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
