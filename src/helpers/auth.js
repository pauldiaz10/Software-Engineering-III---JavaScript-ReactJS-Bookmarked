//import ReactDOM, { Component } from 'react'
import { ref, firebaseAuth } from '../config/constants'

var usernameString;

export function auth (email, pw, userN) {
    usernameString=userN;
    firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
    .then(saveUserToUsernameList)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/weak-password') {
        displayError(error,document.getElementById('pwErrorMsg'));
      }
      else if  (errorCode === 'auth/email-already-in-use'){
        displayError(error,document.getElementById('emailErrorMsg'));
      }
      else if  (errorCode === 'auth/invalid-email'){
        displayError(error,document.getElementById('emailErrorMsg'));
      }
      else {
        displayError(errorMessage,document.getElementById('emailErrorMsg'));
      }
      console.log(error);
    });
}

//Displays error message on screen
export function displayError(error,dom){
  console.log(error.message);
  dom.innerHTML = error.message;
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function saveUser (user) {
  return ref.child('User/' + user.uid)
    .set({
      email: user.email,
      username: usernameString,
      userImage: "nil",
      userBio: "Welcome to my page :D"
    })
    .then(() => user)
}

export function updateUser(email){
  return firebaseAuth().updateEmail(email)

}

export function saveUserToUsernameList (user) {
  return ref.child('UsernameList')
    .update({
       [user.uid]: usernameString
    })
    .then(() => user)
  }
