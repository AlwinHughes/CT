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

class AllSolves extends React.Component {

  constructor(props) {
    super(props);
    console.log('is authed: ', auth.isUserAuthenticated())
    this.state = {rows: []};
    this.getTableRows = this.getTableRows.bind(this);
    this.getTableRows();
  }

  render() { 
    console.log('render');
    return (
      <div>
        <button onClick={this.getTableRows}>Refresh</button>
        <table>
        <tbody>
          <tr><td>Id </td><td>Solve Time</td><td>Time</td><td>Scramble</td></tr>
          {this.state.rows}
        </tbody>
        </table>
      </div>
    )
  }

  getTableRows() {
    var arr = [];
    console.log('puzzle: ', this.props.puzzle);
    request
      .post('/api/getallsolves')
      .send({puzzle: this.props.puzzle})
      .set('Authorization', 'bearer '+auth.getToken())
      .end(function(err, res) {
        if(err) {
          console.log(err)
        } else {
          console.log(res);
          for(var i = 0; i < res.body.length; i++) {
            arr.push(<tr><td>{res.body[i]._id}</td><td>{res.body[i].solve_time}</td><td>{res.body[i].time}</td><td>{res.body[i].scramble}</td><td>{res.body[i].penalty}</td></tr>)
          }
          this.setState({rows: arr});
        }
      }.bind(this));
    return "";
  }
}


export default AllSolves;
