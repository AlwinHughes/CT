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
       rows: []
    }
    this.onRowSelection = this.onRowSelection.bind(this);
    this.createRows = this.createRows.bind(this);
  }

  render(){
	  console.log(this.state.selected_rows);
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
    <RaisedButton label="+2" disabled={this.state.selected_rows !== []}/>
    <RaisedButton label="DNF" disabled={!this.state.selected_rows !== []}/>
	    
    </div>
    )    
  }

 onRowSelection(selected){
   console.log(this.state);
   if(selected === []) {
     this.setState({
      hilighted: false,
      selected_rows: selected
    })} else {
      this.setState({
       hilighted: true,	
       selected_rows: selected
      });
   }
 } 

isSelected(index) {
  return this.state.selected_rows.indexOf(index) !== -1;
 }

  createRows(){
    var arr = []
    for(var i = 0; i < this.props.rows.length; i++) {
      var row = (
	 <TableRow key={i} selected={this.isSelected(i)}>
	<TableRowColumn>{parseInt(this.props.rows[i].solve_time)/100}</TableRowColumn>
	</TableRow>
      )
     arr.push(row)
    }
    return arr
  } 
}

export default SolvesHistory;
