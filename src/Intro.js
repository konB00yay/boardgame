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
          <img src={require("./spaces/introBoard.png")} alt="" />
        </div>
        <div className="button-container">
          <button
            className="create-button"
            disabled={this.props.isDisabled}
            onClick={e => this.create()}
          >
            {" "}
            Create
          </button>
          <button className="join-button" onClick={e => this.join(e)}>
            {" "}
            Join
          </button>
        </div>
      </div>
    );
  }
}

export default Intro;
