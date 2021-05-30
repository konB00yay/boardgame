import React, { Component } from "react";
import "./Styles/App.css";
import Game from "./Game";
import Seo from "./Components/SEO.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Seo />
        <Game />
      </div>
    );
  }
}

export default App;
