import React, { Component } from "react";
import Board from "./Components/Board";
import Battle from "./Components/Battle";
import Intro from "./Components/Intro";
import PokeNav from "./Components/PokeNav";
import * as alerts from "./Alerts";
import "./Styles/Game.css";
import Swal from "sweetalert2";
import shortid from "shortid";
import io from "socket.io-client";
import * as tileAction from "./SpecialTiles";
import "bootstrap/dist/css/bootstrap.min.css";

let socket_url = "http://localhost:4000";
if (process.env.NODE_ENV === "production") {
  socket_url = "https://vast-reaches-79428.herokuapp.com/";
}

const socket = io(socket_url);

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
      pokemon: {},
      battling: [],
      battleRollOne: 0,
      battleRollTwo: 0
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

  componentDidUpdate() {
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
          pokemon: {},
          battling: []
        });
      } else {
        this.setState({
          positions: data.positions,
          battling: data.battling
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
    socket.on("battleRollOne", data => {
      this.setState({
        battleRollOne: data.roll
      });
    });
    socket.on("battleRollTwo", data => {
      this.setState({
        battleRollTwo: data.roll
      });
    });
    socket.on("newBattlePlayer", data => {
      this.setState({
        battling: data.battling
      });
    });
  }

  onPressCreate = e => {
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "pdglobby--" + this.roomId; // Lobby channel name
    this.player = 1;
    this.playerName = "Player " + this.player;

    socket.emit("rooms", { id: this.lobbyChannel, action: "create" });

    Swal.fire(alerts.SHARE_WITH_FRIENDS(this.roomId));

    this.setState({
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      turn: 1, // Player X makes the 1st move
      inLobby: true
    });
  };

  onPressJoin = e => {
    Swal.fire(alerts.JOIN).then(result => {
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
    socket.on("players", data => {
      if (data.positions !== undefined && data.pokemon !== undefined) {
        if (this.player === null) {
          this.player = Object.keys(data.positions).length;
          this.playerName = "Player " + this.player;
        }

        this.setState({
          isRoomCreator: false,
          isDisabled: true, // Disable the 'Create' button
          turn: 1, // Player X makes the 1st move
          inLobby: true,
          isPlaying: true,
          positions: data.positions,
          pokemon: data.pokemon
        });
      } else {
        Swal.fire(alerts.NONEXISTENT_ROOM);
      }
    });
  };

  pickPokemon = () => {
    let pokeOptions = {
      "1": "Bulbasaur",
      "2": "Squirtle",
      "3": "Charmander"
    };
    if ([2, 5, 8].includes(this.player)) {
      delete pokeOptions[this.state.pokemon[this.player - 1]];
    }
    if ([3, 6, 9].includes(this.player)) {
      delete pokeOptions[this.state.pokemon[this.player - 1]];
      delete pokeOptions[this.state.pokemon[this.player - 2]];
    }
    Swal.fire(alerts.PICK_POKEMON(pokeOptions)).then(result => {
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

  rollBattleDieOne = () => {
    let rolled = Math.floor(Math.random() * 6 + 1);
    socket.emit("battleRolledOne", {
      room: this.lobbyChannel,
      battleRollOne: rolled
    });

    this.setState({
      battleRollOne: rolled
    });
  };

  rollBattleDieTwo = () => {
    let rolled = Math.floor(Math.random() * 6 + 1);
    socket.emit("battleRolledTwo", {
      room: this.lobbyChannel,
      battleRollTwo: rolled
    });

    this.setState({
      battleRollTwo: rolled
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
        Swal.fire(alerts.PLAYER_WINS(key)).then(result => {
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
      swalWithBootstrapButtons.fire(alerts.NOT_ENOUGH_PLAYERS).then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(alerts.SHARE_WITH_FRIENDS(this.roomId));
          socket.emit("lonePlayer", this.lobbyChannel);
          this.evicted = 0;
          this.setState({
            positions: { 1: 1 },
            pokemon: { 1: null },
            turn: 1
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(alerts.DELETED);
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
            pokemon: {},
            battling: []
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

    let playersBattling = [];
    if (!this.gym) {
      playersBattling.push(this.player);
      for (const player in Object.keys(this.state.positions)) {
        if (parseInt(player) !== this.player) {
          if (this.state.positions[player] === newPosition) {
            playersBattling.push(parseInt(player));
          }
        }
      }
    }

    socket.emit("move", {
      room: this.lobbyChannel,
      player: player,
      newSpace: newPosition,
      battling: playersBattling
    });

    this.setState(prevState => ({
      positions: {
        ...prevState.positions,
        [player]: newPosition
      },
      pokemon: {
        ...prevState.pokemon,
        [player]: pokemonSwitch
      },
      battling: playersBattling
    }));
  };

  whoseTurn = () => {
    if (this.state.turn !== this.player) {
      return "Player " + this.state.turn + "s turn";
    } else {
      return "Your turn";
    }
  };

  nextBattle = () => {
    let newBattle = this.state.battling;
    newBattle.splice(1, 1);
    socket.emit("newBattle", {
      room: this.lobbyChannel,
      battling: newBattle
    });

    this.setState({
      battling: newBattle
    });
  };

  render() {
    let pokeChoice = false;
    if (this.player === 1) {
      pokeChoice = true;
    }
    if (this.player > 1) {
      pokeChoice = this.state.pokemon[this.player - 1] !== null;
    }
    return (
      <div>
        {!this.state.isPlaying && (
          <Intro
            disabled={this.state.isDisabled}
            create={this.onPressCreate}
            join={this.onPressJoin}
          />
        )}
        {this.state.isPlaying && (
          <div className="game">
            <PokeNav
              roomCreator={this.state.isRoomCreator}
              playerName={this.playerName}
              evictPlayer={this.evictPlayer}
              playerOptions={this.playerOptions}
              player={this.player}
              turn={this.state.turn}
              roll={this.rollDice}
              diceRoll={this.state.roll}
              go={this.go}
              positions={this.state.positions}
              specialTile={this.specialTileAction}
              reset={this.resetPlayer}
              next={this.nextPlayer}
              whoseTurn={this.whoseTurn}
            />
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
            <div className="gameBoard">
              <Board
                positions={this.state.positions}
                pokemon={this.state.pokemon}
                player={this.player}
              />
              {this.state.battling !== undefined &&
                this.state.battling.length > 1 && (
                  <Battle
                    className="board-battle"
                    players={this.state.battling}
                    rollOne={this.rollBattleDieOne}
                    rollTwo={this.rollBattleDieTwo}
                    battleRollOne={this.state.battleRollOne}
                    battleRollTwo={this.state.battleRollTwo}
                    player={this.player}
                    pokemon={this.state.pokemon}
                    nextBattle={this.nextBattle}
                  />
                )}
            </div>
            {this.state.pokemon[this.player] === null &&
              pokeChoice && (
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
