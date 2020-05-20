import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import * as tileAction from "./SpecialTiles";

class PokeNav extends Component {
  constructor(props) {
    super(props);

    this.evictPlayer = this.props.evictPlayer.bind(this);
    this.playerOptions = this.props.playerOptions.bind(this);
    this.rollDice = this.props.roll.bind(this);
    this.go = this.props.go.bind(this);
    this.resetPlayer = this.props.reset.bind(this);
    this.nextPlayer = this.props.next.bind(this);
    this.whoseTurn = this.props.whoseTurn.bind(this);
  }

  render() {
    return (
      <Navbar sticky="top" bg="light">
        <Navbar.Brand className="player-name">
          {this.props.playerName}
        </Navbar.Brand>
        <Navbar.Collapse className="navCollapse">
          <Nav className="spacing">
            {this.props.roomCreator && (
              <select
                className="dropdown"
                title="Remove"
                onChange={e => {
                  this.evictPlayer(e.target.value);
                }}
              >
                <option key={0} value={0}>
                  Remove
                </option>
                {this.playerOptions()}
              </select>
            )}
          </Nav>
          <Nav className="roll">
            {this.props.player === this.props.turn && (
              <div className="pokeball" id="rollPokeball">
                <figure className="pokeballTop" id="rollPokeballTop" />
                <button className="roll-button" onClick={e => this.rollDice()}>
                  {" "}
                  Roll
                </button>
                <figure className="pokeballBottom" id="rollPokeballBottom" />
              </div>
            )}
            <div className="pokeball">
              <figure className="pokeballTop" />
              <div className="dice-roll">{this.props.diceRoll}</div>
              <figure className="pokeballBottom" />
            </div>
            {this.props.player === this.props.turn && (
              <div>
                {this.props.diceRoll > 0 && (
                  <div className="pokeball" id="goPokeball">
                    <figure className="pokeballTop" id="goPokeballTop" />
                    <button className="go-button" onClick={e => this.go()}>
                      {" "}
                      Go!
                    </button>
                    <figure className="pokeballBottom" id="goPokeballBottom" />
                  </div>
                )}
                {tileAction.missingnoReset(
                  this.props.positions[this.props.player]
                ) &&
                  this.props.specialTile && (
                    <button
                      className="reset-button"
                      onClick={e => this.resetPlayer()}
                    >
                      {" "}
                      Glitch to Pallet Town
                    </button>
                  )}
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
        <Nav id="playersTurns" pullright="true">
          {this.props.player === this.props.turn && (
            <Nav pullright="true">
              <button
                className="next-player-button"
                onClick={e => this.nextPlayer()}
              >
                {" "}
                Next Player
              </button>
            </Nav>
          )}
          {this.whoseTurn()}
        </Nav>
      </Navbar>
    );
  }
}

export default PokeNav;
