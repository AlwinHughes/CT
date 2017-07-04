import React from 'react';
import { Link, IndexLink } from 'react-router';
import AppBar from 'material-ui/AppBar';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton> <MoreVertIcon/> </IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
    <Link to='/s'><MenuItem primaryText='Sign Up'/></Link>
    <Link to='/l'> <MenuItem primaryText='Log In'/></Link>
  </IconMenu>
  )

const Base = ({children}) => (

  <div>
    <AppBar
      title="CT"
      iconElementRight={<Logged/>}/>

      <div>

      {children}
      </div>
  </div>
);



export default Base;
