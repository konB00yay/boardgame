import React, { Component } from "react";
import Board from "./Board";
import "./Game.css";
import Swal from "sweetalert2";
import shortid from "shortid";
import io from "socket.io-client";
import * as tileAction from "./SpecialTiles";

//Just beginning route for server
const socket = io("http://localhost:4000");

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      turn: 1,
      inLobby: false,
      positions: {},
      roll: 0,
      pokemon: {}
    };

    this.multiplier = 1;
    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;
    this.player = null;
    this.specialTileAction = true;
  }

  componentDidUpdate() {
    // Check that the player is connected to a channel
    if (this.lobbyChannel != null) {
      socket.on("joined", data => {
        if (this.state.isPlaying) {
          this.setState({
            positions: data.positions,
            pokemon: data.pokemon
          });
        } else {
          this.setState({
            isPlaying: true,
            positions: data.positions,
            pokemon: data.pokemon
          });
        }
        Swal.close();
      });
    }
  }

  componentDidMount() {
    socket.on("moved", data => {
      this.setState({
        positions: data.newSpaces
      });
    });
    socket.on("newTurn", data => {
      this.setState({
        turn: data.newTurn
      });
    });
    socket.on("pokemonPicked", data => {
      this.setState({
        pokemon: data.newPokemon
      });
    });
    socket.on("newGame", data => {
      this.setState({
        positions: data.positions,
        pokemon: data.pokemon
      });
      Swal.close();
    });
    socket.on("playerReset", data => {
      this.setState({
        positions: data.positions
      });
    });
    socket.on("displayRoll", data => {
      this.setState({
        roll: data.roll
      });
    });
  }

  onPressCreate = e => {
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "pdglobby--" + this.roomId; // Lobby channel name
    this.player = 1;

    socket.emit("rooms", { id: this.lobbyChannel, action: "create" });

    Swal.fire({
      position: "top",
      allowOutsideClick: false,
      title: "Share this room ID with your friends",
      text: this.roomId,
      width: 275,
      padding: "0.7em",
      // Custom CSS to change the size of the modal
      customClass: {
        heightAuto: false,
        title: "title-class",
        popup: "popup-class",
        confirmButton: "button-class"
      }
    });

    this.setState({
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      turn: 1, // Player X makes the 1st move
      inLobby: true
    });
  };

  onPressJoin = e => {
    Swal.fire({
      position: "top",
      input: "text",
      allowOutsideClick: false,
      inputPlaceholder: "Enter the room id",
      showCancelButton: true,
      confirmButtonColor: "rgb(208,33,41)",
      confirmButtonText: "OK",
      width: 275,
      padding: "0.7em",
      customClass: {
        heightAuto: false,
        popup: "popup-class",
        confirmButton: "join-button-class",
        cancelButton: "join-button-class"
      }
    }).then(result => {
      // Check if the user typed a value in the input field
      if (result.value != null) {
        this.joinRoom(result.value);
      }
    });
  };

  joinRoom = value => {
    this.roomId = value;
    this.lobbyChannel = "pdglobby--" + this.roomId;

    socket.emit("rooms", { id: this.lobbyChannel, action: "join" });

    socket.emit("players", this.lobbyChannel);
    socket.on("players", positions => {
      this.player = Object.keys(positions).length;

      this.setState({
        isRoomCreator: false,
        isDisabled: true, // Disable the 'Create' button
        turn: 1, // Player X makes the 1st move
        inLobby: true,
        isPlaying: true,
        positions: positions
      });
    });
  };

  pickPokemon = () => {
    Swal.fire({
      title: "Pick a Pokemon!",
      position: "top",
      input: "select",
      inputOptions: {
        "1": "Bulbasaur",
        "2": "Squirtle",
        "3": "Charmander"
      },
      allowOutsideClick: false,
      inputPlaceholder: "",
      showCancelButton: true,
      confirmButtonColor: "rgb(208,33,41)",
      confirmButtonText: "OK",
      width: 275,
      padding: "0.7em",
      customClass: {
        heightAuto: false,
        popup: "popup-class",
        confirmButton: "join-button-class",
        cancelButton: "join-button-class"
      }
    }).then(result => {
      if (result.value !== "") {
        socket.emit("pokemon", {
          room: this.lobbyChannel,
          player: this.player,
          pokemon: result.value
        });
        this.setState(prevState => ({
          pokemon: {
            ...prevState.pokemon,
            [this.player]: result.value
          }
        }));
      }
    });
  };

  rollDice = () => {
    let rolled = Math.floor(Math.random() * 6 + 1);
    socket.emit("rolled", {
      room: this.lobbyChannel,
      roll: rolled
    });

    this.setState({
      roll: rolled
    });
  };

  go = () => {
    this.specialTileAction = true;
    let newPosition =
      this.state.positions[this.player] + this.state.roll * this.multiplier;
    newPosition = tileAction.stopAtGym({
      space: newPosition,
      positions: this.state.positions,
      thisPlayer: this.player
    });
    this.spaceMutation(newPosition, this.player);
  };

  nextPlayer = () => {
    let players = Object.keys(this.state.positions).length;
    let newTurn = this.state.turn;
    if (this.state.turn < players) {
      newTurn = this.state.turn + 1;
    } else {
      newTurn = 1;
    }
    socket.emit("nextTurn", {
      room: this.lobbyChannel,
      turn: newTurn
    });
    this.setState(prevState => ({
      turn: newTurn,
      roll: 0
    }));
  };

  gameOver = () => {
    Object.entries(this.state.positions).map(([key, value]) => {
      if (value === 72) {
        Swal.fire({
          title: "Player " + key + " Wins!",
          width: 275,
          position: "center",
          allowOutsideClick: false,
          padding: "0.7em",
          backdrop: "rgba(0,0,123,0.4)",
          confirmButtonText: "New Game?"
        }).then(result => {
          socket.emit("reset", {
            room: this.lobbyChannel
          });
        });
      }
      return "";
    });
  };

  resetPlayer = () => {
    this.specialTileAction = false;
    socket.emit("resetPlayer", {
      room: this.lobbyChannel,
      player: this.player
    });
  };

  playerOptions = () => {
    let players = [];
    Object.entries(this.state.positions).map(([key, value]) => {
      players.push(
        <option key={key} value={key}>
          {"Player " + key}
        </option>
      );
      return "";
    });
    return players;
  };

  onDropDownSelected = player => {
    this.specialTileAction = false;
    let newPosition = this.state.positions[player] - 10;
    this.spaceMutation(newPosition, player);
  };

  spaceMutation = (newPosition, player) => {
    newPosition = tileAction.onAbra(newPosition);
    this.multiplier = tileAction.bike(newPosition);

    let pokemonSwitch = this.state.pokemon[player];
    if (tileAction.pikachu(newPosition)) {
      pokemonSwitch = 4;
      socket.emit("pokemon", {
        room: this.lobbyChannel,
        player: player,
        pokemon: pokemonSwitch
      });
    }

    socket.emit("move", {
      room: this.lobbyChannel,
      player: player,
      newSpace: newPosition
    });

    this.setState(prevState => ({
      positions: {
        ...prevState.positions,
        [player]: newPosition
      },
      pokemon: {
        ...prevState.pokemon,
        [player]: pokemonSwitch
      }
    }));
  };

  render() {
    return (
      <div>
        {!this.state.isPlaying && (
          <div className="index">
            <div className="intro">
              <img src={require("./spaces/introBoard.png")} alt="" />
            </div>
            <div className="button-container">
              <button
                className="create-button"
                disabled={this.state.isDisabled}
                onClick={e => this.onPressCreate()}
              >
                {" "}
                Create
              </button>
              <button
                className="join-button"
                onClick={e => this.onPressJoin(e)}
              >
                {" "}
                Join
              </button>
            </div>
          </div>
        )}
        {this.state.isPlaying && (
          <div className="game">
            {tileAction.haunter(this.state.positions[this.player]) &&
              this.specialTileAction && (
                <div className="haunter">
                  <select
                    className="dropdown"
                    onChange={e => {
                      this.onDropDownSelected(e.target.value);
                    }}
                  >
                    <option key={0} value={0}>
                      Eat Someone's Dream
                    </option>
                    {this.playerOptions()}
                  </select>
                </div>
              )}
            <div className="roll">
              <div className="dice-roll">{this.state.roll}</div>
              {this.player === this.state.turn && (
                <div className="button-container">
                  <button
                    className="roll-button"
                    onClick={e => this.rollDice()}
                  >
                    {" "}
                    Roll
                  </button>
                  {this.state.roll > 0 && (
                    <button className="go-button" onClick={e => this.go()}>
                      {" "}
                      Go!
                    </button>
                  )}
                  <button
                    className="next-player-button"
                    onClick={e => this.nextPlayer()}
                  >
                    {" "}
                    Next Player
                  </button>
                  {tileAction.missingnoReset(
                    this.state.positions[this.player]
                  ) &&
                    this.specialTileAction && (
                      <button
                        className="reset-button"
                        onClick={e => this.resetPlayer()}
                      >
                        {" "}
                        Back to Square 1 :/
                      </button>
                    )}
                </div>
              )}
            </div>
            <Board
              positions={this.state.positions}
              pokemon={this.state.pokemon}
              player={this.player}
            />
            {this.state.pokemon[this.player] === null && (
              <button
                className="pick-pokemon"
                onClick={e => this.pickPokemon()}
              >
                {" "}
                Pick a Pokemon
              </button>
            )}
            {this.gameOver()}
          </div>
        )}
      </div>
    );
  }
}

export default Game;
