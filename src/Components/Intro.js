import React, { Component } from "react";

class Intro extends Component {
  constructor(props) {
    super(props);

    this.create = this.props.create.bind(this);
    this.join = this.props.join.bind(this);
  }
  render() {
    return (
      <div className="index">
        <div className="intro">
          <img src={require("../spaces/introBoard.png")} alt="" />
        </div>
        <div className="button-container">
          <div className="create-div">
            <button
              className="create-button"
              disabled={this.props.isDisabled}
              onClick={e => this.create()}
            >
              {" "}
              Create
            </button>
            <span className="create-instructions">
              Create a game and give the code to your friends. The game will
              load when Player 2 joins!
            </span>
          </div>
          <div className="join-div">
            <button className="join-button" onClick={e => this.join(e)}>
              {" "}
              Join
            </button>
            <span className="join-instructions">
              Join the game being played via the room code from your friends.
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Intro;
