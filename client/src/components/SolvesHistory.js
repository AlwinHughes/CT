import React from 'react';
import DataTables from 'material-ui-datatables';

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

  render(){
    // console.log(this.props.data)
    return (
      <DataTables height={'auto'} selectable={false} data={this.processData.bind(this)()} showCheckboxes={false}
        page={1}
        count={100}/>
    )
  }

  processData() {
    var data = this.props.data;
    for(var i = 0; i < data.length; i++) {
      data[i].solve_time = data[i].solve_time/100;
    }
    return [{scramble: 'a scramble', solve_time: 'a solve time', time: 'a time'},
    {scramble: 'a scramble2', solve_time: 'a solve time2', time: 'a time2 '}];
  }

}

export default SolvesHistory;