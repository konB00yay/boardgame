import React, { Component } from "react";
import "./App.css";
import Game from "./Game";
import Swal from "sweetalert2";
import shortid from "shortid";
import io from "socket.io-client";

//Just beginning route for server
const socket = io("http://localhost:4000");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
      inLobby: false
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
        this.setState({
          isPlaying: true
        });
        Swal.close();
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
      myTurn: true, // Player X makes the 1st move
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
    socket.on("players", playerNumber => {
      this.player = playerNumber;

      this.setState({
        isRoomCreator: false,
        isDisabled: true, // Disable the 'Create' button
        myTurn: false, // Player X makes the 1st move
        inLobby: true,
        isPlaying: true
      });
    });
  };

  render() {
    return (
      <div className="App">
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
          <Game
            gameChannel={this.gameChannel}
            isRoomCreator={this.state.isRoomCreator}
            myTurn={this.state.myTurn}
            player={this.player}
          />
        )}
      </div>
    );
  }
}

export default App;
