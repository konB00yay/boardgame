import React, { Component } from "react";
import Tile from "./Tile";
import { GEN_1 } from "../constsGen1";
import { GEN_2 } from "../constsGen2";
import "../Styles/Board.css";

class Board extends Component {
  render() {
    let GAME_BOARD = [];
    if(this.props.gen === 1){
      GAME_BOARD = GEN_1;
    }
    else if(this.props.gen === 2){
      GAME_BOARD = GEN_2;
    }
    return (
      <div id="row">
        <div id="column">
          <Tile
            space={GAME_BOARD[9]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={9}
            class="space"
          />
          <Tile
            space={GAME_BOARD[8]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={8}
            class="space"
          />
          <Tile
            space={GAME_BOARD[7]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={7}
            class="space"
          />
          <Tile
            space={GAME_BOARD[6]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={6}
            class="space"
          />
          <Tile
            space={GAME_BOARD[5]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={5}
            class="space"
          />
          <Tile
            space={GAME_BOARD[4]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={4}
            class="space"
          />
          <Tile
            space={GAME_BOARD[3]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={3}
            class="space"
          />
          <Tile
            space={GAME_BOARD[2]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={2}
            class="space"
          />
          <Tile
            space={GAME_BOARD[1]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={1}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[10]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={10}
            class="space"
          />
          <Tile
            space={GAME_BOARD[39]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={39}
            class="space"
          />
          <Tile
            space={GAME_BOARD[38]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={38}
            class="space"
          />
          <Tile
            space={GAME_BOARD[37]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={37}
            class="space"
          />
          <Tile
            space={GAME_BOARD[36]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={36}
            class="space"
          />
          <Tile
            space={GAME_BOARD[35]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={35}
            class="space"
          />
          <Tile
            space={GAME_BOARD[34]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={34}
            class="space"
          />
          <Tile
            space={GAME_BOARD[33]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={33}
            class="space"
          />
          <Tile
            space={GAME_BOARD[32]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={32}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[11]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={11}
            class="space"
          />
          <Tile
            space={GAME_BOARD[40]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={40}
            class="space"
          />
          <Tile
            space={GAME_BOARD[61]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={61}
            class="space"
          />
          <Tile
            space={GAME_BOARD[60]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={60}
            class="space"
          />
          <Tile
            space={GAME_BOARD[59]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={59}
            class="space"
          />
          <Tile
            space={GAME_BOARD[58]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={58}
            class="space"
          />
          <Tile
            space={GAME_BOARD[57]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={57}
            class="space"
          />
          <Tile
            space={GAME_BOARD[56]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={56}
            class="space"
          />
          <Tile
            space={GAME_BOARD[31]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={31}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[12]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={12}
            class="space"
          />
          <Tile
            space={GAME_BOARD[41]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={41}
            class="space"
          />
          <Tile
            space={GAME_BOARD[62]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={62}
            class="space"
          />
          <Tile
            space={GAME_BOARD[75]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={75}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[74]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={74}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[73]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={73}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[72]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={72}
            class="space"
          />
          <Tile
            space={GAME_BOARD[55]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={55}
            class="space"
          />
          <Tile
            space={GAME_BOARD[30]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={30}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[13]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={13}
            class="space"
          />
          <Tile
            space={GAME_BOARD[42]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={42}
            class="space"
          />
          <Tile
            space={GAME_BOARD[63]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={63}
            class="space"
          />
          <Tile
            space={GAME_BOARD[76]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={76}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[81]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={81}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[80]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={80}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[71]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={71}
            class="space"
          />
          <Tile
            space={GAME_BOARD[54]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={54}
            class="space"
          />
          <Tile
            space={GAME_BOARD[29]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={29}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[14]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={14}
            class="space"
          />
          <Tile
            space={GAME_BOARD[43]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={43}
            class="space"
          />
          <Tile
            space={GAME_BOARD[64]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={64}
            class="space"
          />
          <Tile
            space={GAME_BOARD[77]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={77}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[78]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={78}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[79]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={79}
            class="intro"
          />
          <Tile
            space={GAME_BOARD[70]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={70}
            class="space"
          />
          <Tile
            space={GAME_BOARD[53]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={53}
            class="space"
          />
          <Tile
            space={GAME_BOARD[28]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={28}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[15]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={15}
            class="space"
          />
          <Tile
            space={GAME_BOARD[44]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={44}
            class="space"
          />
          <Tile
            space={GAME_BOARD[65]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={65}
            class="space"
          />
          <Tile
            space={GAME_BOARD[66]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={66}
            class="space"
          />
          <Tile
            space={GAME_BOARD[67]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={67}
            class="space"
          />
          <Tile
            space={GAME_BOARD[68]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={68}
            class="space"
          />
          <Tile
            space={GAME_BOARD[69]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={69}
            class="space"
          />
          <Tile
            space={GAME_BOARD[52]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={52}
            class="space"
          />
          <Tile
            space={GAME_BOARD[27]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={27}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[16]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={16}
            class="space"
          />
          <Tile
            space={GAME_BOARD[45]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={45}
            class="space"
          />
          <Tile
            space={GAME_BOARD[46]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={46}
            class="space"
          />
          <Tile
            space={GAME_BOARD[47]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={47}
            class="space"
          />
          <Tile
            space={GAME_BOARD[48]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={48}
            class="space"
          />
          <Tile
            space={GAME_BOARD[49]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={49}
            class="space"
          />
          <Tile
            space={GAME_BOARD[50]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={50}
            class="space"
          />
          <Tile
            space={GAME_BOARD[51]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={51}
            class="space"
          />
          <Tile
            space={GAME_BOARD[26]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={26}
            class="space"
          />
        </div>
        <div id="column">
          <Tile
            space={GAME_BOARD[17]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={17}
            class="space"
          />
          <Tile
            space={GAME_BOARD[18]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={18}
            class="space"
          />
          <Tile
            space={GAME_BOARD[19]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={19}
            class="space"
          />
          <Tile
            space={GAME_BOARD[20]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={20}
            class="space"
          />
          <Tile
            space={GAME_BOARD[21]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={21}
            class="space"
          />
          <Tile
            space={GAME_BOARD[22]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={22}
            class="space"
          />
          <Tile
            space={GAME_BOARD[23]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={23}
            class="space"
          />
          <Tile
            space={GAME_BOARD[24]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={24}
            class="space"
          />
          <Tile
            space={GAME_BOARD[25]}
            positions={this.props.positions}
            pokemon={this.props.pokemon}
            names={this.props.names}
            number={25}
            class="space"
          />
        </div>
      </div>
    );
  }
}

export default Board;
