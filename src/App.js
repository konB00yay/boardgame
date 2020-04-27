import React, { Component } from "react";
import "./App.css";
import Game from "./Game";
import PubNubReact from "pubnub-react";
import Swal from "sweetalert2";
import shortid from "shortid";
import * as keys from "./keys";

class App extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: keys.PUBNUB_PUBLISHKEY,
      subscribeKey: keys.PUBNUB_SUBSCRIBEKEY
    });

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
    this.pubnub.init(this);
  }

  componentDidUpdate() {
    // Check that the player is connected to a channel
    if (this.lobbyChannel != null) {
      this.pubnub.getMessage(this.lobbyChannel, msg => {
        // Start the game once an opponent joins the channel
        if (msg.message.notRoomCreator) {
          // Create a different channel for the game
          this.gameChannel = "tictactoegame--" + this.roomId;
          this.pubnub.subscribe({
            channels: [this.gameChannel]
          });

          this.setState({
            isPlaying: true
          });

          // Close the modals if they are opened
          Swal.close();
        }
      });
    }
  }

  onPressCreate = e => {
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "pdglobby--" + this.roomId; // Lobby channel name
    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true // Checks the number of people in the channel
    });

    Swal.fire({
      position: "top",
      allowOutsideClick: false,
      title: "Share this room ID with your friend",
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

    this.pubnub
      .hereNow({
        channels: [this.lobbyChannel]
      })
      .then(response => {
        //Only let 6 players in?
        if (response.totalOccupancy < 6) {
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true
          });

          this.setState({
            inLobby: true
          });

          this.pubnub.publish({
            message: {
              notRoomCreator: true
            },
            channel: this.lobbyChannel
          });
        } else {
          // Game in progress
          Swal.fire({
            position: "top",
            allowOutsideClick: false,
            title: "Error",
            text: "Game in progress. Try another room.",
            width: 275,
            padding: "0.7em",
            customClass: {
              heightAuto: false,
              title: "title-class",
              popup: "popup-class",
              confirmButton: "button-class"
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <div>Lobby: {this.lobbyChannel}</div>
        <div className="App">
          {!this.state.isPlaying && (
            <div>
              <div className="button-container">
                <button
                  className="create-button "
                  disabled={this.state.isDisabled}
                  onClick={e => this.onPressCreate()}
                >
                  {" "}
                  Create
                </button>
                <button
                  className="join-button"
                  onClick={e => this.onPressJoin()}
                >
                  {" "}
                  Join
                </button>
              </div>
            </div>
          )}
          {this.state.isPlaying && (
            <Game
              pubnub={this.pubnub}
              gameChannel={this.gameChannel}
              isRoomCreator={this.state.isRoomCreator}
              myTurn={this.state.myTurn}
              endGame={this.endGame}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
