import React from 'react';

class Clock extends React.Component {

  render() {
    return (
      <h3>{this.formatTime(this.props.time)}</h3>
    )
  }

  formatTime(time){
    var time = Math.abs(time);
    var min = (time - (time%6000))/6000
    var sec = ((time - 6000*min) - (time - 6000*min)%100 )/100 ;
    var ms = time%100;


    if(time < 6000) {
      return this.addZeroes(sec) + "." + this.addZeroes(ms);
    } else {
      return this.addZeroes(min) + ":" + this.addZeroes(sec) + "." + this.addZeroes(ms);
    }
  }

  addZeroes(num) {
    if(num<10){
      return '0' + num;
    }else {
      return num
    }
  }
}

export default Clock;