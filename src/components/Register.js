import React, { Component } from 'react'
import { auth } from '../helpers/auth'
import { ref } from '../config/constants'

export default class Register extends Component {
  constructor(props){
    super(props)
    this.state = {userNameConfirm: ' ', emailConfirm: ' ', boolEmail: true, boolUsername: true, registerState: ' '}
  }
  clearTextInputUsername(){
    document.getElementById('formUsername').reset();
    this.setState({userNameConfirm: ''});
    this.setState({emailConfirm: ''});
  }
  clearTextInputEmail(){
    document.getElementById('formEmail').reset();
    this.setState({emailConfirm: ''});
    this.setState({userNameConfirm: ''});
  }
  onBlurEmail(event){
    var array = [];
    var refEmail = ref.child("User");
    var tempString = event.target.value;

    refEmail.on("value", function(snapshot){
      snapshot.forEach(function(childSnapshot){
        array.push(childSnapshot.val());
      });
      var len = array.length;
      for(var i = 0; i < len; i++){
        if(array[i].email === tempString){
          this.setState({boolEmail: false});
          this.setState({emailConfirm: "Email already registered"});
          len = i;
        }
      }
    }.bind(this));
  }
  onBlurUserName(event){
    var array = [];
    var refUsername = ref.child("User");
    var tempString = event.target.value;

    refUsername.on("value", function(snapshot){
      snapshot.forEach(function(childSnapshot){
        array.push(childSnapshot.val());
      });
      var len = array.length;
      for(var i = 0; i < len; i++){
        if(array[i].username === tempString){
          this.setState({boolUsername: false});
          this.setState({userNameConfirm: "Username already registered"});
          len = i;
        }
      }
    }.bind(this));
  }
  handleSubmit = (e) => {
    console.log(this.state.boolEmail);
    console.log(this.state.boolUsername);
    if(!this.state.boolEmail || !this.state.boolUsername){
      this.setState({registerState: "Registration failed!"});
      console.log("Failed to register");
    }else{
      e.preventDefault()//prevents user from registering if email is badly formatted, etc..
      auth(this.email.value, this.pw.value, this.username.value)
      console.log("Registration success");
    }
  }
  validate = (temp) => {
    this.setState({validating: true});
  }
  render () {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <form id='formEmail'>
            <div className="form-group">
              <label>Email</label>
              <input id='testEmail' onClick={this.clearTextInputEmail.bind(this)} className="form-control" id="emailID" onChange={this.onBlurEmail.bind(this)} ref={(email) => this.email = email} placeholder="Email"/>
              <p1>{this.state.emailConfirm}</p1>
            </div>
          </form>
          <form id='formUsername'>
            <div className="form-group">
              <label>Username</label>
              <input id="testUsername" onClick={this.clearTextInputUsername.bind(this)} className="form-control" id="userID" onChange={this.onBlurUserName.bind(this)} ref={(username) => this.username = username} placeholder="Username"/>
              <p1>{this.state.userNameConfirm}</p1>
            </div>
          </form>
          <form>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
              <p id="pwErrorMsg"></p>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </form>
      </div>
    )
  }
}
