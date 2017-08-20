import React from 'react';
import {Icon} from 'react-fa'
import { ref, firebaseAuth } from '../config/constants';


var emailArray = [];
var userRef = ref.child('User');
userRef.once('value').then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {

    var emailVal= childSnapshot.child('username').val();
    emailArray.push(emailVal);
    });
  });



var ReactDatalist = require('react-datalist');
var FontAwesome = require('react-fontawesome');

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { term: '' }
    this.goToUserProfil = this.goToUserProfil.bind(this);
  }

  onInputChange(term) {
    this.setState({term});
    this.props.onTermChange(term);
    console.log("input onChanged");
  }
    
    goToUserProfil(){
      console.log("button clicked");
      this.context.router.push('/userprofile/123');
      console.log("Input: " + document.getElementById('users'));
      console.log(document.getElementById('listNames'));
      var searchdiv = document.getElementById('users');
      var inputdiv = searchdiv.getElementsByTagName('div');
      console.log(inputdiv);
      var username = inputdiv[0].innerHTML;
      console.log(username);
      console.log("username: " +username)
      var routeToUser = '/publicprofile/' + username
      this.context.router.push(routeToUser);
      

    }

  render() {
    return (
      <div className="search">

        {/* <input list ="users" onChange={event => this.onInputChange(event.target.value) } />  */}
        <div className="input" id="inputText">
          <ReactDatalist id="listNames" list="users" options={emailArray}  forcePoly={true} />
        </div>

        <div className = "searchIcon" onClick={this.goToUserProfil} >
          <FontAwesome className="pull-right" name='search' size='2x' style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}/>
        </div>
      </div>
    );
  }
}

SearchBar.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default SearchBar;