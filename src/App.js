import React, { Component } from "react";
import "./App.css";
import Board from "./Board";
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
      myTurn: false
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;
    this.pubnub.init(this);
  }
  render() {
    return (
      <div>
        {!this.state.isPlaying && (
          <div className="App">
            <div className="board">
              <Board />
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
          </div>
        )}
        {this.state.isPlaying && (
          <Game
            pubnub={this.pubnub}
            gameChannel={this.gameChannel}
            piece={this.state.piece}
            isRoomCreator={this.state.isRoomCreator}
            myTurn={this.state.myTurn}
            xUsername={this.state.xUsername}
            oUsername={this.state.oUsername}
            endGame={this.endGame}
          />
        )}
      </div>
    );
  }
}

export default App;
