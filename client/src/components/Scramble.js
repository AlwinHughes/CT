import React from 'react';

const scramble_moves = ["F","F'","F2","R","R'","R2","U","U'","U2","L","L'","L2","B","B'","B2","D","D'","D2"];

class Scramble extends React.Component {

  render() {

    return(
      <p> {this.getScramble()} </p>
    )

  }

  getScramble() {
    if(this.props.generate_scramble) {
      var scramble = "";
      var last = "";
      var next = "";
      var i = 0;
      while (i < 20) {
        next = scramble_moves[this.getRandom(0,scramble_moves.length-1)];
        if(next !== last){
          scramble += next + " ";
          i++;
        }
      }
      return scramble;
    } else {
      return null;
    }
  }

  getRandom(min,max){
    return Math.floor((max-min+1)*Math.random() + min);
  }
}

export default Scramble;