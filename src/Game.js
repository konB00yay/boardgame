import React, { Component } from "react";
import Board from "./Components/Board";
import Battle from "./Components/Battle";
import Intro from "./Components/Intro";
import PokeNav from "./Components/PokeNav";
import * as alerts from "./Alerts";
import "./Styles/Game.css";
import Swal from "sweetalert2";
import shortid from "shortid";
import { io } from "socket.io-client";
import * as tileAction from "./SpecialTiles";
import "bootstrap/dist/css/bootstrap.min.css";

let socket_url = "http://localhost:4000";
if (process.env.NODE_ENV === "production") {
  socket_url = "https://vast-reaches-79428.herokuapp.com/";
}

const socket = io(socket_url);

socket.connect();

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
      gen: 1,
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
      battleRollTwo: 0,
      playerNames: {},
      caterpie: 0,
      reversedOrder: false
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
    this.evolved = false;
    this.slowpoke = false;
    this.backwardsRolls = 0;
  }

  componentDidUpdate() {
    if (this.lobbyChannel != null) {
      socket.on("joined", data => {
        if (this.state.isPlaying) {
          this.setState({
            positions: data.positions,
            pokemon: data.pokemon,
            playerNames: data.names
          });
        } else {
          this.setState({
            isPlaying: true,
            positions: data.positions,
            pokemon: data.pokemon,
            playerNames: data.names
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
          battling: data.battling,
          caterpie: data.caterpie,
          reversedOrder: data.reversed
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
    socket.on("names", data => {
      this.setState({
        playerNames: data.names
      });
    });
    socket.on("disconnect", (reason) => {
      this.setState({
        isPlaying: false
      })
      if(this.state.isRoomCreator){
        Swal.fire(alerts.DISCONNECTED_LEADER).then(result => {
          this.onCreateAfterDisconnect();
        });
      } else{
        Swal.fire(alerts.DISCONNECTED_PLAYER).then(result =>{
          if(result != null){
            this.joinRoomAfterDisconnect(result.value);
          }
        })
      }
    })
  }

  onCreateAfterDisconnect = () => {
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "pdglobby--" + this.roomId; // Lobby channel name
    this.player = 1;
    if(this.state.playerNames[this.player] === null) {
      this.playerName = "Player " + this.player;
    }
    else {
      this.playerName = this.state.playerNames[this.player]
    }
    socket.emit("rooms", { 
      id: this.lobbyChannel, 
      action: "createDisconnect",
      positions: this.state.positions,
      pokemon: this.state.pokemon,
      names: this.state.playerNames
    });

    Swal.fire(alerts.SHARE_WITH_FRIENDS(this.roomId));
  }

  onPressCreate = e => {
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "pdglobby--" + this.roomId; // Lobby channel name
    this.player = 1;
    this.playerName = "Player " + this.player;

    socket.emit("rooms", { id: this.lobbyChannel, gen: this.state.gen, action: "create" });

    Swal.fire(alerts.SHARE_WITH_FRIENDS(this.roomId));

    this.setState(prevState => ({
      playerNames: {
        ...prevState.playerNames,
        [this.player]: null
      },
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      turn: 1, // Player X makes the 1st move
      inLobby: true
    }));
  };

  onPressJoin = e => {
    if (!this.state.isRoomCreator) {
      Swal.fire(alerts.JOIN).then(result => {
        // Check if the user typed a value in the input field
        if (result.value != null) {
          this.joinRoom(result.value);
        }
      });
    }
  };

  joinRoomAfterDisconnect = value => {
    this.roomId = value;
    this.lobbyChannel = "pdglobby--" + this.roomId;

    socket.emit("rooms", { id: this.lobbyChannel, action: "joinDisconnect" });

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
          turn: data.turn,
          inLobby: true,
          isPlaying: true,
          positions: data.positions,
          pokemon: data.pokemon,
          playerNames: data.names
        });
      } else {
        Swal.fire(alerts.NONEXISTENT_ROOM);
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
          turn: data.turn,
          inLobby: true,
          isPlaying: true,
          positions: data.positions,
          pokemon: data.pokemon,
          playerNames: data.names,
          gen: data.gen
        });
      } else {
        Swal.fire(alerts.NONEXISTENT_ROOM);
      }
    });
  };

  pokemonOptions = () => {
    let pokeOptions = {
      "1": "Bulbasaur",
      "2": "Squirtle",
      "3": "Charmander"
    };
    if(this.state.gen === 2) {
      pokeOptions = {
        "1": "Chikarita",
        "2": "Totodile",
        "3": "Cyndaquil"
      };
    }
    return pokeOptions;
  }

  pickPokemon = () => {
    let pokeOptions = this.pokemonOptions();
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
    if (this.state.caterpie > 0 && this.state.caterpie !== this.player) {
      rolled = Math.ceil(rolled / 2);
    }
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
    if(this.state.gen === 1){
      if (!this.evolved) {
        let data = tileAction.stopAtGym({
          space: newPosition,
          positions: this.state.positions,
          thisPlayer: this.player,
          gen: this.state.gen
        });
        this.gym = data.gym;
        newPosition = data.newPosition;
      }
      if (
        this.evolved &&
        tileAction.gymFive({
          oldPosition: this.state.positions[this.player],
          newPosition: newPosition
        })
      ) {
        this.evolved = false;
      }
      this.spaceMutation_gen1(newPosition, this.player);
    }
    else if(this.state.gen === 2){
      if(!this.slowpoke){
        let data = tileAction.stopAtGym({
          space: newPosition,
          positions: this.state.positions,
          thisPlayer: this.player,
          gen: this.state.gen
        });
        this.gym = data.gym;
        newPosition = data.newPosition;
      } else {
        this.slowpoke = false;
      }
      newPosition = tileAction.ilexReset({
        roll: this.state.roll,
        position: this.state.positions[this.player],
        newPosition: newPosition
      })
      this.spaceMutation_gen2(newPosition, this.player);
    }
  };

  nextPlayer = () => {
    let players = Object.keys(this.state.positions).length;
    let newTurn = this.state.turn;
    if(!this.state.reversedOrder){
      if (this.state.turn < players) {
        newTurn = this.state.turn + 1;
        if (this.state.positions[newTurn] === "REMOVED") {
          this.nextPlayer();
        }
      } else {
        newTurn = 1;
      }
    } else {
      if (this.state.turn > 1) {
        newTurn = this.state.turn - 1;
        if (this.state.positions[newTurn] === "REMOVED") {
          this.nextPlayer();
        }
      } else {
        newTurn = players;
      }
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

  newName = name => {
    this.playerName = name;
    socket.emit("newName", {
      room: this.lobbyChannel,
      player: this.player,
      newName: name
    });

    this.setState(prevState => ({
      playerNames: {
        ...prevState.playerNames,
        [this.player]: name
      }
    }));
  };

  onHaunterSelected = player => {
    this.specialTileAction = false;
    let newPosition = this.state.positions[player] - 10;
    this.spaceMutation_gen1(newPosition, player);
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

  spaceMutation_gen1 = (newPosition, player) => {
    let playersBattling = [];
    newPosition = tileAction.onAbra(newPosition);
    this.multiplier = tileAction.bike(newPosition);
    let caterpie = tileAction.caterpie(newPosition);
    let caterpiePlayer = this.state.caterpie;
    if (caterpie) {
      caterpiePlayer = this.player;
    } else if (caterpiePlayer === this.player) {
      caterpiePlayer = 0;
    }

    let pokemonSwitch = this.state.pokemon[player];
    if (tileAction.pikachu(newPosition)) {
      Swal.fire(alerts.PIKACHU).then(result => {
        if (result.value) {
          pokemonSwitch = 4;
        }
        socket.emit("pokemon", {
          room: this.lobbyChannel,
          player: player,
          pokemon: pokemonSwitch
        });
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
          battling: playersBattling,
          caterpie: caterpiePlayer,
          reversed: false
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
          battling: playersBattling,
          caterpie: caterpiePlayer,
          reversed: false
        }));
      });
    } else if (tileAction.evolve(newPosition)) {
      Swal.fire(alerts.EVOLVE).then(result => {
        if (result.value) {
          this.evolved = true;
        }
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
          battling: playersBattling,
          caterpie: caterpiePlayer,
          reversed: false
        });

        this.setState(prevState => ({
          positions: {
            ...prevState.positions,
            [player]: newPosition
          },
          battling: playersBattling,
          caterpie: caterpiePlayer,
          reversedOrder: false
        }));
      });
    } else {
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
        battling: playersBattling,
        caterpie: caterpiePlayer,
        reversed: false
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
        battling: playersBattling,
        caterpie: caterpiePlayer,
        reversedOrder: false
      }));
    }
  };

  spaceMutation_gen2 = (newPosition, player) => {
    let playersBattling = [];
    let reversed = tileAction.mantine(newPosition) ? !this.state.reversedOrder : this.state.reversedOrder;

    if(this.backwardsRolls > 0){
      this.backwardsRolls--;
      if(this.backwardsRolls === 0){
        this.multiplier = 1;
      }
    }

    if (tileAction.slowpoke(newPosition)) {
      Swal.fire(alerts.SLOWPOKE_TAIL).then(result => {
        if (result.value) {
          this.slowpoke = true;
        }
      });
    } else if(tileAction.swap(newPosition)) {
      let options = {};
      let pokemonNames = this.pokemonOptions();
      let keys = Object.keys(this.state.pokemon);
      for(let value in keys){
        console.log(keys[value]);
        console.log(this.player);
        if (parseInt(keys[value]) !== this.player) {
          let optionName = "Player " + keys[value];
          if(this.state.playerNames[keys[value]] !== null){
            optionName = this.state.playerNames[keys[value]];
          }
          optionName += ": " + pokemonNames[this.state.pokemon[keys[value]]];
          options[keys[value]] = optionName;
        }
      }
      Swal.fire(alerts.SWAP_POKEMON(options)).then(result => {
        if(result.value !== ""){
          let newPokemon = this.state.pokemon[result.value];
          let oldPokemon = this.state.pokemon[this.player];

          socket.emit("pokemon", {
            room: this.lobbyChannel,
            player: this.player,
            pokemon: newPokemon
          });

          socket.emit("pokemon", {
            room: this.lobbyChannel,
            player: result.value,
            pokemon: oldPokemon
          });
          this.setState(prevState => ({
            pokemon: {
              ...prevState.pokemon,
              [this.player]: newPokemon,
              [result.value]: oldPokemon
            }
          }));
        }
      });
    } else if(tileAction.snubbull(newPosition)) {
      this.multiplier = -1;
      this.backwardsRolls = 2;
    }

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
      battling: playersBattling,
      caterpie: 0,
      reversed: reversed
    });

    this.setState(prevState => ({
      positions: {
        ...prevState.positions,
        [player]: newPosition
      },
      battling: playersBattling,
      reversedOrder: reversed
    }));
  };

  whoseTurn = () => {
    if (this.state.turn !== this.player) {
      if (this.state.playerNames[this.state.turn] !== null) {
        return this.state.playerNames[this.state.turn] + "s turn";
      } else {
        return "Player " + this.state.turn + "s turn";
      }
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

  changeGen = move => {
    const newGen = this.state.gen + move;
    if(this.state.gen === 2 && move === 1){
      return;
    }
    if(this.state.gen === 1 && move === -1){
      return;
    }
    else {
      this.setState({
        gen: newGen
      });
    }
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
            gen={this.state.gen}
            changeGen={this.changeGen}
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
              name={this.newName}
              names={this.state.playerNames}
            />
            {tileAction.haunter(this.state.positions[this.player]) && this.state.gen === 1 &&
              this.specialTileAction && (
                <div className="haunter">
                  <img src={require("./Images/haunter.png")} alt="haunter" />
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
                names={this.state.playerNames}
                gen={this.state.gen}
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
                    names={this.state.playerNames}
                    gen={this.state.gen}
                  />
                )}
              {this.state.pokemon[this.player] === null &&
                pokeChoice && (
                  <div className="pokemonPickDiv">
                    <button
                      className="pick-pokemon"
                      id="pokemonPicker"
                      onClick={e => this.pickPokemon()}
                    >
                      {" "}
                      Pick a Pokemon
                    </button>
                  </div>
                )}
            </div>
            {this.gameOver()}
          </div>
        )}
      </div>
    );
  }
}

export default Game;
