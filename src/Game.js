import React, { Component } from "react";
import Board from "./Board";

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      app: props
    };
  }

  render() {
    return (
      <div className="game">
        <Board />
        {console.log(this.state.app.player)}
      </div>
    );
  }
}

export default Game;
