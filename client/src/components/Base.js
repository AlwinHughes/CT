import React from 'react';
import { Link, IndexLink } from 'react-router';
import AppBar from 'material-ui/AppBar';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import auth from '../auth.js';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';

class LoggedIn extends React.Component {
  
  render() {
    return (
      <FlatButton label='Log Out' onTouchTap={this.props.onNotAuthed}/>
    )
  }
}

class Login extends React.Component {

  render() {
    return (
      <div>
      <Link to='/l'> <FlatButton {...this.props} label='Login'/></Link>
      <Link to='/s'> <FlatButton {...this.props} label='SignUp'/></Link>
      </div>
    )
  }
}

const Basie_ = ({children}) => (

  <div>
    <AppBar
      title="CT"
      iconElementRight={auth.isUserAuthenticated() ? <LoggedIn/>: <Login/>}/>

      <div>

      {children}
      {console.log(children)}
      </div>
  </div>
);

class SelectPuzzle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: 2};
    this.onChange = this.onChange.bind(this);
  }

  render() {
    
    return(
      <DropDownMenu value={this.state.value} onChange={this.onChange}>
        <MenuItem value={1} primaryText='2x2'/>
        <MenuItem value={2} primaryText='3x3'/>
        <MenuItem value={3} primaryText='4x4'/>
        <MenuItem value={4} primaryText='5x4'/>
        <MenuItem value={5} primaryText='6x6'/>
        <MenuItem value={7} primaryText='7x7'/>
      </DropDownMenu>
    )
  }

  onChange(event, index, value) {
    this.setState({value: value});
  }


}

class Base extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isAuthed: auth.isUserAuthenticated() }
    this.onNotAuth = this.onNotAuth.bind(this);
  }

  onNotAuth() {
    console.log('on not auted');
    auth.deauthenticateUser();
    this.setState({isAuthed: false});
  }

  render() {
   var children_props =  React.Children.map(this.props.children, function(child) {
      return React.cloneElement(child, {onNotAuth: this.onNotAuthed, isAuthed: this.state.isAuthed});
    }.bind(this));
    var test = (<SelectPuzzle/>) 
    return (
    <div>
      <AppBar  title="CT" children={test}
        iconElementRight={auth.isUserAuthenticated() ? <LoggedIn onNotAuthed={this.onNotAuth}/>: <Login/>}/>

        <div>
    
       {children_props}
      
        </div>
    </div>
  )
  }
}



export default Base;
