import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

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

class SolvesHistory extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
       hilighted: false,
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
  }

  render(){
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
	    </div>
    )    
  }

  onButtonClick(text) {
    var new_penalties = this.state.penalties;
    for(var i = 0; i < this.state.selected_rows.length; i++) {
      var p_index = this.getIndexOfPenalties(this.state.selected_rows[i]);
      if(p_index  === -1) {// currently has no penalty
        new_penalties.push({index: this.state.selected_rows[i], show:text});
      }else {
        new_penalties[p_index] = {index: this.state.selected_rows[i], show:text}
      }
    }
    this.setState({penalties: new_penalties}); 
  }

  onRemovePenalty(){
    var new_penalties = [];
    for(var i = 0; i < this.state.penalties.length; i++){
      if(this.state.selected_rows.indexOf(this.state.penalties[i].index) === -1){
        new_penalties.push(this.state.penalties[i])
      }
    }
    this.setState({penalties: new_penalties});
  }

  onPluse2Click() {
   this.onButtonClick('+2');
  }
  onDNFClick() {
    this.onButtonClick('DNF');
    console.log(this.state.penalties);
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
        <TableRow key={i} selected={this.isSelected(i)}>
        <TableRowColumn>{parseInt(this.props.rows[i].solve_time)/100}</TableRowColumn>
        <TableRowColumn>{this.getPenalty(i)}</TableRowColumn>
	      </TableRow>
      )
    arr.push(row)
    }
    return arr;
  } 
}

export default SolvesHistory;
