import React, { Component } from "react";
import "../Styles/Tile.css";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const playerColor = {
  1: "#039003",
  2: "#0000ff",
  3: "#f00",
  4: "#ffef00"
};

class Tile extends Component {
  addPlayerPiece = (key, value, pokemon, names) => {
    if (value === this.props.number) {
      let color = playerColor[pokemon[key]];
      return (
        <div className="player" key={key} style={{ backgroundColor: color }}>
          {names !== undefined &&
            names[key] !== null && (
              <span className="newName">{names[key]}</span>
            )}
          {key}
        </div>
      );
    }
  };

  addPlayerPieces = (positions, pokemon, names) => {
    return Object.entries(positions).map(([key, value]) => {
      return this.addPlayerPiece(key, value, pokemon, names);
    });
  };

  render() {
    return (
      <div className="tileContainer" id={this.props.number}>
        <LazyLoadImage
          src={this.props.space}
          alt="board space"
          effect="blur"
          className={this.props.class}
        />
        <div className="playerContainer">
          {this.addPlayerPieces(
            this.props.positions,
            this.props.pokemon,
            this.props.names
          )}
        </div>
      </div>
    );
  }
}

export default Tile;
