import React from 'react';
import { Link, IndexLink } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import request from 'superagent';
import auth from '../auth.js';

const form = {
  width: 800,
  'textAlign': 'center'
}

class LogIn extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: {},
      errors: {}
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  render() {
    return (
      <Card style={form}>
        <form action='/' onSubmit={this.submitForm}>
          <h2>Sign Up</h2>

          <div className="field-line">
            <TextField
              floatingLabelText="Name"
              name="name"
              onChange={this.onFieldChange}
              errorText={this.state.errors.name}
            />
          </div>

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
            <RaisedButton type="submit" label="Create New Account" primary />
          </div>

        </form>
      </Card>
    )
  }

  submitForm(event) {
    event.preventDefault();
    console.log(this.state);
    request
      .post('/auth/signup')
      .send({name: this.state.user.name, email: this.state.user.email, password: this.state.user.password})
      .end(function(err, res) {
        if(err) {
          console.log('state: ', this.state);
          var errs = res.body.errors;
          if(res.body.errors) {

            this.setState({errors:errs})
          }

        }

        console.log(res);
      }.bind(this));
  }

  onFieldChange(event) {
    var user = this.state.user;
    user[event.target.name] = event.target.value
    this.setState({user});
  }
}

export default LogIn;