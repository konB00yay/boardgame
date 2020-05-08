import React, { Component } from "react";
import "./Tile.css";

const playerColor = {
  1: "#039003",
  2: "#0000ff",
  3: "#f00",
  4: "#ffef00"
};

class Tile extends Component {
  addPlayerPiece = (key, value, pokemon) => {
    if (value === this.props.number) {
      let color = playerColor[pokemon[key]];
      return (
        <div className="player" key={key} style={{ backgroundColor: color }}>
          {key}
        </div>
      );
    }
  };

  addPlayerPieces = (positions, pokemon) => {
    return Object.entries(positions).map(([key, value]) => {
      return this.addPlayerPiece(key, value, pokemon);
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
          {this.addPlayerPieces(this.props.positions, this.props.pokemon)}
        </div>
      </div>
    );
  }
}

export default Tile;
