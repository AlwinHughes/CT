import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import auth from '../auth';
import request from 'superagent';
import underscore from 'underscore';
import Paper from 'material-ui/Paper';

const TABLE_COLUMS = [
  {
    key: 'scrable',
    label: 'Scramble'
  },
  {
    key: 'solve_time',
    label: 'Time'
  },
  {
    key: 'time',
    label: 'Date'
  }
]

const row = {
  height: 200
}
class SolvesHistory extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
       selected_rows: [],
       rows: [],
       penalties: []
    }
    this.onRowSelection = this.onRowSelection.bind(this);
    this.createRows = this.createRows.bind(this);
    this.onPluse2Click = this.onPluse2Click.bind(this);
    this.onDNFClick = this.onDNFClick.bind(this);
    this.getIndexOfPenalties = this.getIndexOfPenalties.bind(this)
    this.getPenalty = this.getPenalty.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.isPenatySelected = this.isPenaltySelected.bind(this);
    this.onRemovePenalty = this.onRemovePenalty.bind(this);
    this.sendPenaltyToServer = this.sendPenaltyToServer.bind(this);
    this.getAverageOfLastFive = this.getAverageOfLastFive.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    var keys= Object.keys(nextState);

    if(!underscore.isEqual(nextState, this.state)) {
      console.log('they are not equal');
      return true;
    }

    if(this.props.rows.length !== nextProps.rows.length){
      console.log('same length');
      return true;// dont update if the row props is still the same
    }
    return false;
  }

  checkArrayEquality(arr1, arr2) {
    if(arr1.length !== arr2.length) {
      return false;
    }
    console.log('array equality');
    return true;
  }

  render(){
    console.log('component is updating');
    return (
    <div>
    <Table onRowSelection={this.onRowSelection} multiSelectable={true}>
	<TableHeader onRowSelection={this.onRowSelection}>
	    <TableRow>
	    <TableHeaderColumn>Solve Time</TableHeaderColumn>
	    <TableHeaderColumn>Penalty</TableHeaderColumn>
	    </TableRow>
	</TableHeader>
	 <TableBody>
	 	{this.createRows()}
	  </TableBody>
    </Table>
    <RaisedButton label="+2" disabled={this.state.selected_rows.length === 0}  primary={this.state.selected_rows.length !== 0}
      onTouchTap={this.onPluse2Click}/>
    <RaisedButton label="DNF" disabled={this.state.selected_rows.length === 0} secondary={!this.state.selected_rows.length !== 0}
      onTouchTap={this.onDNFClick}/>
    <RaisedButton label="None" disabled={!this.isPenaltySelected()} onTouchTap={this.onRemovePenalty}/>
      <br/>
      Average of last five: {this.getAverageOfLastFive()}
	    </div>
    )    
  }

  getAverageOfLastFive() {
    if(this.props.rows.length < 5) {
      return '--';
    }
    var times = [];
    var previous_dnf = false;
    for(var i = this.props.rows.length - 1; i > this.props.rows.length - 6; i--) {
      var penalty = this.getPenalty(i);
      if(penalty === '--') {
        times.push(this.props.rows[i].solve_time)
      } else if (penalty === 'DNF') {
        if (previous_dnf) {
          return 'DNF';
        }
        previous_dnf = true;
      } else {
        times.push(this.props.rows[i].solve_time + 200);
      }
    }
    var max = -2;
    var max_i;
    var min = Number.POSITIVE_INFINITY; 
    var min_i;
    var sum = 0;
    console.log('times: ',times);
    for(var i = 0; i < times.length; i++) {
      if(times[i] > max && ! previous_dnf) {
        max = times[i];
        max_i = i;
      }
      if(times[i] < min) {
        min = times[i];
        min_i = i
      }
    }
    console.log('max: ', max_i);
    console.log('min: ', min_i);
    
    for(var i = 0; i < times.length; i++) {
      if(i !== min_i && (i !== max_i || previous_dnf)) { // the max_i condition can be ignored if there has ben a previous dnf
        sum = sum + times[i]
      }
    }

    return Math.round(sum/3)/100;

  
  }

  onButtonClick(text) {
    var new_penalties = this.state.penalties;i
    var added = 0;
    for(var i = 0; i < this.state.selected_rows.length; i++) {
      var p_index = this.getIndexOfPenalties(this.state.selected_rows[i]);
      console.log(this.state.selected_rows[i]);
      
      if(p_index  === -1) {// currently has no penalty
        new_penalties.push({index: this.state.selected_rows[i], show:text});
        added++;
      }else {
        new_penalties[p_index + added] = {index: this.state.selected_rows[i], show:text}
      }
    }
    this.setState({penalties: new_penalties});
    this.sendPenaltyToServer(text);
   }

  onRemovePenalty(){
    var new_penalties = [];
    for(var i = 0; i < this.state.penalties.length; i++){
      if(this.state.selected_rows.indexOf(this.state.penalties[i].index) === -1){
        new_penalties.push(this.state.penalties[i])
      }
    }
    this.setState({penalties: new_penalties});
    this.sendPenaltyToServer('');
  }

  onPluse2Click() {
    this.onButtonClick('+2');
  }

  sendPenaltyToServer(type) {

    if(auth.isUserAuthenticated()) {
      if(type === '+2') {
        type = '2';
      } else if (type === 'DNF') {
        type = 'd';
      } else {
        type = '';
      }
      request.post('/api/addpenalty')
      .set('Authorization', 'bearer '+auth.getToken())
        .send({penlties: this.state.selected_rows, length: this.props.rows.length, type:type})
        .end(function(err, res) {
          if(err) {
            console.log('err: ', err);
          }
          console.log('res: ', res);
        })
    }
  }

  onDNFClick() {
    this.onButtonClick('DNF');
  }

  getIndexOfPenalties(index) {
    for(var i = 0; i< this.state.penalties.length; i++) {
      console.log(this.state.penalties[i]);
      if(this.state.penalties[i].index === index) {
        return this.state.penalties[i].index;
      }
    }
    return -1;
  }

  onRowSelection(selected){
    this.setState({selected_rows: selected});  
  } 

  isSelected(index) {
    return this.state.selected_rows.indexOf(index) !== -1;
  }

  getPenalty(index) {
    for(var i = 0; i < this.state.penalties.length; i++) {
      if(this.state.penalties[i].index === index) {
        return this.state.penalties[i].show;
      }
    }
    return "--";
  }

  isPenaltySelected(index) {
    for(var i = 0; i < this.state.penalties.length; i++) {
      if(this.state.selected_rows.indexOf(this.state.penalties[i].index) !== -1) {
        return true;
      }
    }
    return false;
  }

  createRows(){
    var arr = []
    for(var i = 0; i < this.props.rows.length; i++) {
       var row = (
        <TableRow key={i} selected={this.isSelected(i)} >
        <TableRowColumn> {parseInt(this.props.rows[i].solve_time)/100}</TableRowColumn>
        <TableRowColumn> {this.getPenalty(i)}</TableRowColumn>
	      </TableRow>
      )
    arr.push(row)
    }
    return arr;
  } 
}

export default SolvesHistory;
