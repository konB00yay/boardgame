import React, { Component } from "react";
import "./Battle.css";

class Battle extends Component {
  render() {
    return (
      <div className="battle-scene">
        {this.props.players[0]} "vs" {this.props.players[1]}
      </div>
    );
  }
}

export default Battle;
