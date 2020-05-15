import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import Board from "./Board";
import Battle from "./Battle";
import "./Game.css";
import Swal from "sweetalert2";
import shortid from "shortid";
import io from "socket.io-client";
import * as tileAction from "./SpecialTiles";
import "bootstrap/dist/css/bootstrap.min.css";

//Just beginning route for server
//https://vast-reaches-79428.herokuapp.com/
let socket = io("http://localhost:4000");
if (process.env.NODE_ENV === "production") {
  socket = io("https://vast-reaches-79428.herokuapp.com/");
}

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});

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
    this.playerName = null;
    this.specialTileAction = true;
    this.evicted = 0;
    this.gym = false;
  }

  shareWithFriends = () => {
    return {
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
    };
  };

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
      if (data.positions[this.player] === "REMOVED") {
        this.setState({
          isPlaying: false,
          turn: 1,
          positions: {},
          roll: 0,
          pokemon: {}
        });
      } else {
        this.setState({
          positions: data.positions
        });
      }
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
    this.playerName = "Player " + this.player;

    socket.emit("rooms", { id: this.lobbyChannel, action: "create" });

    Swal.fire(this.shareWithFriends());

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
      if (this.player === null) {
        this.player = Object.keys(positions).length;
        this.playerName = "Player " + this.player;
      }

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
    let data = tileAction.stopAtGym({
      space: newPosition,
      positions: this.state.positions,
      thisPlayer: this.player
    });
    newPosition = data.newPosition;
    this.gym = data.gym;
    this.spaceMutation(newPosition, this.player);
  };

  nextPlayer = () => {
    let players = Object.keys(this.state.positions).length;
    let newTurn = this.state.turn;
    if (this.state.turn < players) {
      newTurn = this.state.turn + 1;
      if (this.state.positions[newTurn] === "REMOVED") {
        this.nextPlayer();
      }
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
      if (value !== "REMOVED") {
        players.push(
          <option key={key} value={key}>
            {"Player " + key}
          </option>
        );
      }
      return "";
    });
    return players;
  };

  onHaunterSelected = player => {
    this.specialTileAction = false;
    let newPosition = this.state.positions[player] - 10;
    this.spaceMutation(newPosition, player);
  };

  evictPlayer = player => {
    this.evicted += 1;
    socket.emit("removePlayer", {
      room: this.lobbyChannel,
      player: player
    });
    if (this.evicted === Object.keys(this.state.positions).length - 1) {
      swalWithBootstrapButtons
        .fire({
          title: "Not Enough Players",
          text: "Delete game or invite more friends?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Invite More",
          cancelButtonText: "Delete Game",
          reverseButtons: true
        })
        .then(result => {
          if (result.value) {
            swalWithBootstrapButtons.fire(this.shareWithFriends());
            socket.emit("lonePlayer", this.lobbyChannel);
            this.evicted = 0;
            this.setState({
              positions: { 1: 1 },
              pokemon: { 1: null },
              turn: 1
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
              title: "Deleted",
              text: "Your room has been deleted",
              icon: "error",
              timer: 1500
            });
            socket.emit("deleteRoom", this.lobbyChannel);
            this.multiplier = 1;
            this.lobbyChannel = null;
            this.gameChannel = null;
            this.roomId = null;
            this.player = null;
            this.playerName = null;
            this.specialTileAction = true;
            this.evicted = 0;
            this.setState({
              isPlaying: false,
              isRoomCreator: false,
              isDisabled: false,
              turn: 1,
              inLobby: false,
              positions: {},
              roll: 0,
              pokemon: {}
            });
          }
        });
    }
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

  whoseTurn = () => {
    if (this.state.turn !== this.player) {
      return "Player " + this.state.turn + "s turn";
    } else {
      return "Your turn";
    }
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
            <Navbar sticky="top" bg="light">
              <Navbar.Brand className="player-name">
                {this.playerName}
              </Navbar.Brand>
              <Navbar.Collapse>
                <Nav className="spacing">
                  {this.state.isRoomCreator && (
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
                  <div className="button-container">
                    {this.player === this.state.turn && (
                      <button
                        className="roll-button"
                        onClick={e => this.rollDice()}
                      >
                        {" "}
                        Roll
                      </button>
                    )}
                    <div className="dice-roll">{this.state.roll}</div>
                    {this.player === this.state.turn && (
                      <div>
                        {this.state.roll > 0 && (
                          <button
                            className="go-button"
                            onClick={e => this.go()}
                          >
                            {" "}
                            Go!
                          </button>
                        )}
                        {tileAction.missingnoReset(
                          this.state.positions[this.player]
                        ) &&
                          this.specialTileAction && (
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
                  </div>
                </Nav>
              </Navbar.Collapse>
              <Nav id="playersTurns" pullright="true">
                {this.player === this.state.turn && (
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
            {tileAction.haunter(this.state.positions[this.player]) &&
              this.specialTileAction && (
                <div className="haunter">
                  <select
                    className="dropdown"
                    onChange={e => {
                      this.onHaunterSelected(e.target.value);
                    }}
                  >
                    <option key={0} value={0}>
                      Eat Someone's Dream
                    </option>
                    {this.playerOptions()}
                  </select>
                </div>
              )}
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
