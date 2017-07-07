import React from 'react';
import { Link, IndexLink } from 'react-router';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Scramble from './Scramble';
import Clock from './Clock';
import FlatButton from 'material-ui/FlatButton';
import keydown from 'react-keydown';
import SolvesHistory from './SolvesHistory.js';
import { browserHistory } from 'react-router';
import request from 'superagent';
import auth from '../auth.js';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const scramble = {
  height: 150,
  width: 800,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
  position: 'absolute'
};

const scramble_text = {
  height: 50,
  width: 600,
  textAlign: 'center',
  padding: 1
}

const clock = {
  height: 300,
  width: 800,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
  position: 'absolute',
  top: 300
}

const clock_text = {
  height: 50,
  width: 300,
  textAlign: 'center',
  padding: 1,
  margin: 20
}

const time_history = {
  height: 800,
  width: 400,
  position: 'absolute',
  left: 850,
  margin: 20,
  textAlign: 'center',
  overflow: 'hidden'
}

const container = {
  width: '100%'
}

const scramble_moves = ["F","F'","F2","R","R'","R2","U","U'","U2","L","L'","L2","B","B'","B2","D","D'","D2"];

class Timer extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      timerstate: 'stoped',
      time: 1500,
      intervalID:null,
      current_scramble: this.getScramble(),
      times: [],
      inspection_time: 1500,
      button_colour: '#a3a3a3',
      button_hover_colour: '#bfbfbf',
      solves: [],
      lastkey: '',
      lastkey_time: null,
      solve_history_rows: [],
      num_of_solves: 0
    }
    console.log('is authed: ', auth.isUserAuthenticated())
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keyup', this.handleKeyUp, false);
    window.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillMount() {
    if (window.location.search === '?p=s') {
      browserHistory.push('/s');
    } else if (window.location.search === '?p=l') {
      browserHistory.push('/l');
    } else if (window.location.search === '?p=a') {
      browserHistory.push('/a');
    }
  }

  render() {
    return (
      <div style={container}>

        <Paper style={scramble} zDepth={1} rounded={false}>
          <Subheader>Scramble</Subheader>
          <center>
          <Paper style={scramble_text} zDepth={3} rounded={false}>
            <p> {this.state.current_scramble} </p>
          </Paper>
          </center>
        </Paper>

        <Paper style={clock} zDepth={1} rounded={false}>
          <Subheader>Timer</Subheader>
          <center><Paper style={clock_text} zDepth={3}>
            <Clock time={this.state.time}/>
          </Paper></center>
          <FlatButton fullWidth={true} label={this.getButtonDisplay(this.state.timerstate)}
            backgroundColor={this.state.button_colour} hoverColor={this.state.button_hover_colour}
            onTouchTap={this.handlOnclick.bind(this)}/>
        </Paper>

        <Paper style={time_history} zDepth={1} rounded={false}>
          <Subheader>Solves</Subheader>
          <SolvesHistory rows={this.state.solves}/>
        </Paper>

      </div>
    )
  }


  componentWillUnmount(){
    console.log('unmound');
    window.removeEventListener('keyup', this.handleKeyUp, false);
    window.removeEventListener('keydown', this.handleKeyDown, false);
  }

  shouldComponentUpdate(nextProps, nextState) {
    var keys= Object.keys(nextState);
    for(var i = 0; i < keys.length; i++) {
      if(keys[i] !== 'lastkey' && keys[i] !== 'lastkey_time'){
        if(nextState[keys[i]] !== this.state[keys[i]]){
          return true;
        }
      }
    }
    return false;
  }

  handleKeyUp(key) {
    if(key.keyCode === 32) {// space
      this.handlOnclick();
    }
    if(key.keyCode === 27) {// escape
      if(this.state.lastkey === 27 && new Date().getTime() - this.state.lastkey_time > 1000) {
        clearInterval(this.state.intervalID);
        this.setState({
          timerstate: 'stoped', current_scramble: this.getScramble(),
          button_colour: '#a3a3a3',
          button_hover_colour: '#bfbfbf',
        });
      } else {
        this.setState({lastkey_time: null})
      }
    }
  }

  handleKeyDown(key) {
    if(this.state.lastkey !== key.keyCode) {
      this.setState({
        lastkey: key.keyCode,
        lastkey_time: new Date().getTime()
      })
    }
  }

  getScramble() {
    var scramble = "";
    var last = "";
    var next = "";
    var i = 0;
    while (i < 20) {
      next = scramble_moves[this.getRandom(0,scramble_moves.length-1)];
      if(next.charAt(0) !== last.charAt(0)){
        scramble += next + " ";
        last = next;
        i++;
      }
    }
    return scramble;
  }

  getRandom(min,max){
    return Math.floor((max-min+1)*Math.random() + min);
  }

  handlOnclick (event) {
    console.log(this.state.solves);
    if (this.state.timerstate === 'started'){
      clearInterval(this.state.intervalID);
      var current_solve = {
        solve_time: this.state.time,
        time: new Date().toLocaleString(),
        scramble: this.state.current_scramble
      };
     
      this.sendTimeToServer(current_solve);
      this.setState({
        timerstate: 'stoped',
        current_scramble: this.getScramble(),
        button_colour: '#a3a3a3',
        button_hover_colour: '#bfbfbf',
        solves: this.state.solves.concat(current_solve),
      	num_of_solves: this.state.num_of_solves+1
      });
    
    } else if (this.state.timerstate === 'stoped') {
      this.setState({
        timerstate: 'started_inspection',
        start_time: new Date().getTime(),
        intervalID: setInterval(this.timerTickDown.bind(this),10),
        button_colour: '#0aba07',
        button_hover_colour: '#03e200'
      });
    } else if(this.state.timerstate === 'started_inspection') {
      clearInterval(this.state.intervalID);
      this.setState({
        timerstate: 'started',
        intervalID: setInterval(this.timerTickUp.bind(this),10),
        time: 0,
        start_time: new Date().getTime(),
        button_colour: '#e00d0d',
        button_hover_colour: '#ff3838'
      });
    } else if(this.state.timerstate = 'unstarted'){
      this.setState({
        start_time: new Date().getTime()
      });
    }
  }

  timerTickUp() {
    this.setState({time: Math.round((new Date().getTime() - this.state.start_time)/10) });
  }

  timerTickDown() {
    if(this.state.time <= 0){
      clearInterval(this.state.intervalID);
      this.setState({
        timerstate: 'started',
        intervalID: setInterval(this.timerTickUp.bind(this),10),
        start_time: new Date().getTime()
      });
    } else {
      this.setState({time: this.state.inspection_time - Math.round((new Date().getTime() - this.state.start_time)/10)});
    }
  }

  sendTimeToServer(solve) {
    request
      .post('/api/addsolve')
      .send(solve)
      .set('Authorization', 'bearer '+auth.getToken())
      .end(function(err, res) {
        if(err) {
          console.log('err: ', err);
        }
        console.log('res: ', res);
	});
  }

  getButtonDisplay(string) {
    if(string === 'stoped'){
      return 'Click to start Inspection';
    } else if (string === 'started'){
      return 'Click to stop'
    } else if(string === 'started_inspection'){
      return 'Click to start time'
    }
  }
}

export default Timer;
