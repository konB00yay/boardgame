import React, { Component } from "react";
import Board from "./Board";
import "./Game.css";
import Swal from "sweetalert2";
import shortid from "shortid";
import io from "socket.io-client";

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
      roll: 0
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;
    this.player = null;
  }

  componentDidUpdate() {
    // Check that the player is connected to a channel
    if (this.lobbyChannel != null) {
      socket.on("joined", data => {
        if (this.state.isPlaying) {
          this.setState({
            positions: data
          });
        } else {
          this.setState({
            isPlaying: true,
            positions: data
          });
        }
        Swal.close();
      });
      socket.on("newTurn", data => {
        console.log(data);
        this.setState({
          positions: data.newSpaces,
          turn: data.newTurn
        });
      });
    }
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

  rollDice = () => {
    let rolled = Math.floor(Math.random() * 6 + 1);
    this.setState({
      roll: rolled
    });
  };

  go = () => {
    let newPosition = this.state.positions[this.player] + this.state.roll;
    let players = Object.keys(this.state.positions).length;
    let newTurn = this.state.turn;
    if (this.state.turn < players) {
      newTurn = this.state.turn + 1;
    } else {
      newTurn = 1;
    }

    socket.emit("move", {
      room: this.lobbyChannel,
      player: this.player,
      newSpace: newPosition,
      turn: newTurn
    });

    this.setState(prevState => ({
      positions: {
        ...prevState.positions,
        [this.player]: newPosition
      },
      turn: newTurn
    }));
    console.log(this.state);
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
              <button className="join-button" onClick={e => this.onPressJoin()}>
                {" "}
                Join
              </button>
            </div>
          </div>
        )}
        {this.state.isPlaying && (
          <div className="game">
            {this.player === this.state.turn && (
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
            <Board positions={this.state.positions} />
          </div>
        )}
      </div>
    );
  }
}

export default Game;
