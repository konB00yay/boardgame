import React, { Component } from "react";
import "./Battle.css";

class Battle extends Component {
  constructor(props) {
    super(props);

    this.rollBattleDieOne = this.props.rollOne.bind(this);
    this.rollBattleDieTwo = this.props.rollTwo.bind(this);
    this.nextBattle = this.props.nextBattle.bind(this);
  }

  renderPokemon = player => {
    let pokemon = parseInt(this.props.pokemon[player]);
    if (pokemon === 1) {
      return require("./bulbasaur.png");
    } else if (pokemon === 2) {
      return require("./squirtle.png");
    } else if (pokemon === 3) {
      return require("./charmander.png");
    } else if (pokemon === 4) {
      return require("./pikachu.png");
    }
  };

  battleText = () => {
    if (this.props.players.length > 2) {
      return "Next Battle";
    } else {
      return "Done";
    }
  };

  render() {
    return (
      <div className="battle-scene">
        <div className="battling-player">
          <div className="playerName">Player {this.props.players[0]}</div>
          <div className="battle-roll">{this.props.battleRollOne}</div>
          <img
            className="pokemon"
            src={this.renderPokemon(this.props.players[0])}
            alt="pokemonOne"
          />
          {this.props.players[0] === this.props.player && (
            <button
              className="battle-button"
              onClick={e => this.rollBattleDieOne()}
            >
              {" "}
              Roll
            </button>
          )}
        </div>
        <div className="vs">
          vs
          {this.props.player === this.props.players[0] && (
            <button className="nextBattler" onClick={e => this.nextBattle()}>
              {" "}
              {this.battleText()}
            </button>
          )}
        </div>
        <div className="battling-player">
          <div className="playerName">Player {this.props.players[1]}</div>
          <div className="battle-roll">{this.props.battleRollTwo}</div>
          <img
            className="pokemon"
            src={this.renderPokemon(this.props.players[1])}
            alt="pokemonTwo"
          />
          {this.props.players[1] === this.props.player && (
            <button
              className="battle-button"
              onClick={e => this.rollBattleDieTwo()}
            >
              {" "}
              Roll
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Battle;
