import React, { Component } from "react";
import introPicGen1 from "../spacesGen1/introBoard.png";
import introPicGen2 from "../spacesGen2/introBoard-gen2.png";

class Intro extends Component {
  constructor(props) {
    super(props);

    this.create = this.props.create.bind(this);
    this.join = this.props.join.bind(this);
    this.changeGen = this.props.changeGen.bind(this);

    this.intro = [introPicGen1, introPicGen2];
  }
  render() {

    return (
      <div className="index">
        <div className="intro">
        <button 
          className="prev-gen-button"
          disabled={this.props.gen === 1}
          onClick={e => this.changeGen(-1)}
          >
            {"<"}
        </button>
          <img width="500" height="500" src={this.intro[this.props.gen - 1]} alt="" />
        <button 
          className="next-gen-button"
          disabled={this.props.gen === 2}
          onClick={e => this.changeGen(1)}
          >
            {">"}
        </button>
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
