import React from 'react';
import { Link, IndexLink } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import request from 'superagent';
import auth from '../auth.js';
import { browserHistory } from 'react-router'

const form = {
  width: 800,
  'textAlign': 'center'
}

class LogIn extends React.Component {

  constructor(props){
    super(props);
    this.state = {errors: {}, user:{}};
    this.onFieldChange = this.onFieldChange.bind(this)
  }

  render() {
    return (
      <Card style={form}>
        <form action='/' onSubmit={this.submitForm.bind(this)}>
          <h2>Log In</h2>

          <div className="field-line">
            <TextField
              floatingLabelText="Email"
              name="email"
              onChange={this.onFieldChange}
              errorText={this.state.errors.email}/>
          </div>

          <div className="field-line" >
            <TextField
              floatingLabelText="Password"
              type="password"
              name="password"
              onChange={this.onFieldChange}
              errorText={this.state.errors.password}/>
          </div>

          <div className="button-line">
            <RaisedButton type="submit" label="Log In" primary />
          </div>
        </form>
      </Card>
    )
  }


  onFieldChange(event) {

    var user = this.state.user;
    user[event.target.name] = event.target.value
    this.setState({user});
  }

  submitForm(event){
    event.preventDefault();
    console.log('state: ', this.state);
    request
      .post('/auth/login')
      .send({email: this.state.user.email, password: this.state.user.password})
      .end(function(err, res) {
        if (err) {
          console.log('err: ',err);

        } else {
          this.setState({errors: {}});
          var jsonres = JSON.parse(res.text);
          auth.authenticateUser(jsonres.token);
          console.log(auth.getToken());
          browserHistory.push('/');
          request
            .get('api/dashboard')
            .set('Authorization', 'bearer '+auth.getToken())
            .end(function(err, res) {
              console.log('err: ', err);
              console.log('res: ', res);
            })
        }
      }.bind(this))
  }
}


export default LogIn;