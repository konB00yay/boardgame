import React, { Component } from "react";
import Board from "./Board";

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="game">
        <Board />
      </div>
    );
  }
}

export default Game;
