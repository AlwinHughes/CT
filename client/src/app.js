import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Router, Route, browserHistory, Link} from 'react-router';
import routes from './routes.js';
import Base from './components/Base.js';
import SignUp from './components/SignUp';
import Timer from './components/Timer';
import AppBar from 'material-ui/AppBar';
// import createMemoryHistory from 'history/createMemoryHistory';
// const history = createMemoryHistory();

injectTapEventPlugin();


ReactDom.render((
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={browserHistory} routes={routes}/>
  </MuiThemeProvider>), document.getElementById('react-app'));

// <Route exact path="/" components={Timer}/>
//       <Route path="/s" components={SignUp} />


// <Router history={browserHistory}>

//     <Route component={Base}>
//       <Route path="/" components={Timer}/>
//       <Route path="/s" components={SignUp} />
//     </Route>
//     </Router>