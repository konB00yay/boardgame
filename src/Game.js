import React, { Component } from "react";
import Board from "./Board";
import "./Game.css";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roll: 0
    };
  }

  rollDice = () => {
    let rolled = Math.floor(Math.random() * 6 + 1);
    this.setState({
      roll: rolled
    });
  };

  render() {
    return (
      <div className="game">
        {this.props.player === this.props.turn && (
          <div className="roll">
            <span className="dice-roll">{this.state.roll}</span>
            <button className="roll-button" onClick={e => this.rollDice()}>
              {" "}
              Roll
            </button>
            {this.state.roll > 0 && (
              <button className="go-button" onClick={e => this.go()}>
                {" "}
                Go!
              </button>
            )}
          </div>
        )}
        <Board positions={this.props.positions} />
      </div>
    );
  }
}

export default Game;
