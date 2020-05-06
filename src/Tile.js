import React, { Component } from "react";
import "./Tile.css";

class Tile extends Component {
  addPlayerPiece = (key, value) => {
    if (value === this.props.number) {
      return (
        <div className="player" key={key}>
          {key}
        </div>
      );
    }
  };

  addPlayerPieces = values => {
    return Object.entries(values).map(([key, value]) => {
      return this.addPlayerPiece(key, value);
    });
  };

  render() {
    return (
      <div className="tileContainer">
        <img
          src={this.props.space}
          alt="board space"
          className={this.props.class}
        />
        <div className="playerContainer">
          {this.addPlayerPieces(this.props.positions)}
        </div>
      </div>
    );
  }
}

export default Tile;
