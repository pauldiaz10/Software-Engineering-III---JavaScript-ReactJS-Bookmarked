import React, { Component } from 'react'
import { ref } from '../../config/constants'
import firebase from 'firebase'
import { storageRef } from '../../config/constants.js';
import { router } from 'react-router';

export default class EditUserProfile extends Component {
  constructor() {
    super();
    this.state = {
      editProfile: true,
      editImage: false,
    }
  }

  onClickProfile(e) {
    e.preventDefault();
    this.setState({ editProfile: true });
    this.setState({ editImage: false });
    document.getElementById("ProfileButton").disabled = true;
    document.getElementById("ImageButton").disabled = false;
  }

  onClickImage(e) {
    e.preventDefault();
    this.setState({ editProfile: false });
    this.setState({ editImage: true });
    document.getElementById("ProfileButton").disabled = false;
    document.getElementById("ImageButton").disabled = true;
  }

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> Edit User Profile</h1>
        <button id="ProfileButton" onClick={this.onClickProfile.bind(this)} className="btn btn-primary">Edit Profile</button>
        <button id="ImageButton" onClick={this.onClickImage.bind(this)} className="btn btn-primary">Upload Image</button>
        <br />
        {this.state.editProfile && < ProfileForm />}
        {this.state.editImage && < ImageForm />}
      </div>
    )
  }
}
    
    var input;
export class ProfileForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    var userid;
    var context = this.context
    if (user != null) {
      
      userid = user.uid
    }
    else {
      //redirect to login page and sign out
    }
    if (document.getElementById("emailForm").value) {
      //check valid email
      input = document.getElementById("emailForm").value;
      user.updateEmail(input).then(function () {
        ref.child("User").child(userid).update({
          "email": input
        })
        context.router.push('/userprofile')
      }, function (error) {
        console.log(error.message)
      });
    }
    if(document.getElementById("bioForm").value) {
      var bio = document.getElementById("bioForm").value;
      ref.child("User").child(userid).update({
        "userBio": bio
      }).then(function()
      {
        context.router.push('/userprofile')
      });
    }

    if (document.getElementById("passwordForm").value !== "") {
      input = document.getElementById("passwordForm").value;
      user.updatePassword(input).then(function () {
        context.router.push('/userprofile')
      }, function (error) {
        console.log(error.message)
      });
    }
  }
    render() {
    return (
      <div>
        <h3>Edit Info</h3>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" id="emailForm" />
          <label>Bio</label>
          <textarea className="form-control" rows="3" id="bioForm" />
          <label>Password</label>
          <input type="password" className="form-control" id="passwordForm" />
        </div>
        <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Update</button>
      </div>
    )
  }
}

class ImageForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    var userid;
    var context = this.context    
    if (user != null) {
      userid = user.uid
    }
    else {
      //redirect to login page and sign out
    }



    var uploadTask = storageRef.child("Users/" + userid + "/profilePicture").put(this.file.files[0]);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      function (snapshot) { },
      function (error) { console.log(error.message) },
      function () {
        var url = uploadTask.snapshot.downloadURL;
        ref.child("User").child(userid).update({
          "userImage": url
        }).then (function() 
        {
          context.router.push('/userprofile')
        });
      });
    
  }

  render() {
    return (
      <div>
        <h3>Image Upload</h3>
        <form onSubmit={this.handleSubmit}>
          <label>File Upload</label>
          <input type="file" className="form-control" ref={(file) => this.file = file} />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}

ProfileForm.contextTypes = {
  router: React.PropTypes.object
}
ImageForm.contextTypes = {
  router: React.PropTypes.object
}

