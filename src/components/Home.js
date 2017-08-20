import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { login } from '../helpers/auth'
import '../index.css'

export default class Home extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    login(this.email.value, this.pw.value)
  }
  render () {
    return (
      <div>
        <div className="home">
          <div className="homelog">
            <div className="col-sm-6 col-sm-offset-3">
              <h1><font color="Black"> Login </font></h1>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
              <div className="signupdiv">
                <p>Need to make an account?</p>
                <Link to="/register">Sign Up Here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
