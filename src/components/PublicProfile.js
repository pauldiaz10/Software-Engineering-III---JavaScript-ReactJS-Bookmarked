import React, { Component } from 'react'
import BookmarkList from '../components/BookmarkList'
import request from 'superagent';
import '../index.css'
import firebase from 'firebase';
import { ref , refBook } from '../config/constants';
import YoutubePlayer from 'react-youtube-player';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import { browserHistory, withRouter, router, ReactRouter } from 'react-router'

var user;

var GifPlayer = require('react-gif-player');
var ReactDatalist = require('react-datalist');
//var browserHistory2 = ReactRouter.browserHistory;
// Initializing values
var onplaying = true;
var onpause = false;

var FontAwesome = require('react-fontawesome');
//https://www.npmjs.com/package/react-gif-player
var router2 = require('../index.js');


function parseTime(item)
{
    var str = item.timeStamp.split(" ", 4);
    var res = str[0] + " " + str[1]  + " " + str[2]  + " " + str[3];
    return res;
}

function addCollections(event, item) {
    var visible = document.getElementById(item.timeStamp).style.visibility;
    if(visible === 'hidden'){
        document.getElementById(item.timeStamp).style.visibility = 'visible';
        var userRef = firebase.auth().currentUser;
        if(userRef !== null){
            var uidRef = userRef.uid;
            var collectionRef = ref.child('UserToCollection/'+ uidRef).once("value", snapshot => {
                snapshot.forEach(function(childSnapshot){
                    var myBtn = document.createElement('button');
                    myBtn.innerHTML = childSnapshot.key;
                    myBtn.onclick = function() {
                        if(myBtn.style.background === 'green')
                            {
                            var buttonRef = ref.child('UserToCollection/' + uidRef).child(childSnapshot.key).child(item.keyString).remove();
                            myBtn.style.background='white';
                            myBtn.style.color='black';
                            }
                        else{
                           myBtn.style.background='green';
                           myBtn.style.color='white';
                           var buttonRef = ref.child('UserToCollection/' + uidRef).child(childSnapshot.key).child(item.keyString).set(0);
                        }
                    }
                    myBtn.className = "buttonSpec";
                    var isSetCollect = ref.child('UserToCollection/' + uidRef).child(childSnapshot.key).once('value', function(categorySnap){
                        categorySnap.forEach(function(snap){
                            console.log('key: '+snap.key);
                            if(snap.key === item.keyString)
                                { console.log('snap.key === item.keystring');
                                    myBtn.style.background='green';
                                    myBtn.style.color='white';
                                }
                        });
                    });

                    document.getElementById(item.timeStamp).appendChild(myBtn);
                });
            });
        }

    }
    else{
        document.getElementById(item.timeStamp).style.visibility = 'hidden';
    }
}

function goToPublicProfile(item)
{
    var username = "publicprofile/" +item.userPosted;
    window.location.href = username;

}


function addBookedCountFirebase(key, bookCount) {
    var count = bookCount + 1;
  firebase.database().ref('Bookmark/' + key + "/bookedCount").set(count);
    let userForRef = firebase.auth().currentUser;
    if(userForRef !== null){
        let uidRef = userForRef.uid;
        firebase.database().ref('UserToBookmark/' + uidRef + "/" + key).set(true);
    }
}

function subtractBookedCountFirebase(key, bookCount) {
    var count = bookCount - 1;
  firebase.database().ref('Bookmark/' + key + "/bookedCount").set(count);
    let userForRef = firebase.auth().currentUser;
    if(userForRef !== null){
        let uidRef = userForRef.uid;
        firebase.database().ref('UserToBookmark/' + uidRef + "/" + key).remove();
    }
}

function addBookmark(event, item) {

  var title = item.title;
  var object = event.target;

  if(object.className === "fa fa-bookmark fa-1g bookmark"){
      object.className = "fa fa-bookmark-o fa-1g bookmark";
      subtractBookedCountFirebase(item.keyString, item.bookedCount);
  }
    else{
        object.className = "fa fa-bookmark fa-1g bookmark";
        addBookedCountFirebase(item.keyString, item.bookedCount);
    }
}

function popMod() {
  document.getElementById("addModal").style.display = "block";
}

function closeP(e) {
  document.getElementById("addModal").style.display = "none";
}

var collectionString;

function addToCollection(){
    collectionString = document.getElementById("collectionName").value;
    if(collectionString != null){
      var currentUser = firebase.auth().currentUser;
      if(currentUser != null){
        var currentUID = currentUser.uid;

        ref.child("UserToCollection").child(currentUID).child(collectionString).set({default:"nil"});

        var collectionAddedBtn = document.createElement('button');
        collectionAddedBtn.innerHTML = collectionString;
        collectionAddedBtn.onclick = function() {
            document.getElementById("outOfLuck").style.visibility = 'visible';
        }
        collectionAddedBtn.className = "buttonSpec";
        document.getElementById("buttonList").appendChild(collectionAddedBtn);

        document.getElementById('addModal').style.display = "none";
      }
    }
}

function closePod(e) {
    document.getElementById('addModal').style.display = "none";
}

function updateToMine(buttonID) {
}

function updateToBooked(event) {
}

function popM(item, type) {
  if(type === "image"){
    document.getElementById("pModalImg").style.display = "block";
    document.getElementById('modImg').src = item.image;
    var description = "<b>Description:  </b>" + item.postText;
    document.getElementById('pmodImgDesc').innerHTML=description;
    var res = parseTime(item);
    document.getElementById('pmodImgTime').innerHTML=res;
  }
  else if(type === "video"){
    var res = parseTime(item);
    document.getElementById('pmodVidTime').innerHTML=res;
    var description = "<b>Description:  </b>" + item.postText;
    document.getElementById('pmodVidDesc').innerHTML=description;
    document.getElementById("pModalVid").style.display = "block";
    var player = document.getElementById('videoPlayer');
    var mp4Vid = document.getElementById('mp4Source');
    player.pause();
    mp4Vid.src = item.video;
    player.load();
    player.play();
  }
  else if(type === "youtube")
      {
    var res = parseTime(item);
    document.getElementById('pmodVidYouTime').innerHTML=res;
    var description = "<b>Description:  </b>" + item.postText;
    document.getElementById('pmodVidYouDesc').innerHTML=description;
    document.getElementById("pModalYoutube").style.display = "block";
    document.getElementById('modYou').src = item.videoYoutube;
  }
  else{
    var res = parseTime(item);
    document.getElementById('pmodGifTime').innerHTML=res;
    var description = "<b>Description:  </b>" + item.postText;
    document.getElementById('pmodGifDesc').innerHTML=description;
    document.getElementById("pModalGif").style.display = "block";
    document.getElementById('modGif').src = item.gif;
  }
}

function closeP(e) {
  var player = document.getElementById('videoPlayer');

  var player2 = YoutubePlayer;
  player2 = document.getElementById('modYou');
  player2.removeAttribute("src");
  player2.currentTime = 0;
  player.pause();
  document.getElementById('mp4Source').src = "";
  player.currentTime = 0;
  document.getElementById('pModalImg').style.display = "none";
  document.getElementById('pModalVid').style.display = "none";
  document.getElementById('pModalGif').style.display = "none";
  document.getElementById('pModalYoutube').style.display = "none";
  document.getElementById('modImg').src = "";
  document.getElementById('modGif').src = "";
}

var isLoaded = false;

export default class PublicProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isMounted:false,
      gifs: [],
      items: [],
      username: " ",
    };
  }

  componentDidMount(){
    this.setState({isMounted:true})

    var uid, usernameString, bio, image, i, specificBookmark, isGifBool, isImgBool, isVideoBool, userImg, isVideoYouBool;
    var bookmarkArray = [];
    var arr = [];
    var myArray = [];

      ref.child("UsernameList").once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot){
             if (childSnapshot.val() === user) {

                 uid = childSnapshot.key;
             }
          });
          console.log(uid+"1");
      var userCollectionRef = firebase.database().ref('UserToCollection/' + uid);

      var myBtn = document.createElement('button');
      myBtn.innerHTML = user + "'s Uploads";
      myBtn.onclick = function() {
         arr=[];
          //document.getElementById("outOfLuke").style.visibility='hidden';
        this.setState({
          items: []
        });

        ref.child("UserToMyBookmark/" + uid).once("value", snapshot =>{
           snapshot.forEach(function(childsnapshot){
               myArray.push(childsnapshot.key)
               console.log(myArray);
           });
           for(i = 0; i < myArray.length; i++){
               specificBookmark = myArray[i];
               console.log(specificBookmark);
               console.log(myArray[i]);

               ref.child("Bookmark/" + specificBookmark).once('value', function(bookSnapshot) {
                    if(bookSnapshot.val().gif !== "nil") {
                      isGifBool = true;
                      isImgBool = false;
                      isVideoBool = false;
                      isVideoYouBool = false;
                    }
                    else if(bookSnapshot.val().image !== "nil"){
                      isImgBool = true;
                      isGifBool = false;
                      isVideoBool = false;
                      isVideoYouBool = false;
                        console.log('its a image');
                    }
                    else if(bookSnapshot.val().video !== "nil"){
                      isVideoBool = true;
                      isGifBool = false;
                      isImgBool = false;
                      isVideoYouBool = false;
                    }
                    else if(bookSnapshot.val().videoYoutube !== "nil"){
                      isVideoBool = false;
                      isVideoYouBool = true;
                      isGifBool = false;
                      isImgBool = false;
                    }

                    if(bookSnapshot.val().userImage === "nil"){
                        userImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
                    }
                    else{
                        userImg = bookSnapshot.val().userImage;
                    }


                    arr.push({
                      bookedCount: bookSnapshot.val().bookedCount,
                      gif: bookSnapshot.val().gif,
                      image: bookSnapshot.val().image,
                      keyString: bookSnapshot.val().keyString,
                      postText: bookSnapshot.val().postText,
                      timeStamp: bookSnapshot.val().timeStamp,
                      title: bookSnapshot.val().title,
                      userPosted: bookSnapshot.val().userPosted,
                      video: bookSnapshot.val().video,
                      videoYoutube: bookSnapshot.val().videoYoutube,
                      userImage: userImg,
                      isGif: isGifBool,
                      isImg: isImgBool,
                      isVideo: isVideoBool,
                      isVideoYoutube: isVideoYouBool,
                    });
                   //console.log(arr);
                }); console.log(arr);
           }
          if(this.state.isMounted){
            console.log("Triggered" + arr.length);

            this.setState({
              items: this.state.items.concat(arr)
            });

            //console.log("WOO11")
              console.log(uid);
           let userForRef = uid
            if(userForRef !== null){
               // console.log("WOO22")
               // let uidRef = userForRef.uid;
                ref.child("UserToBookmark/" + uid).once("value", snapshot => {
                    snapshot.forEach(function(childSnapshot2){

                       // console.log("WOO3")
                        if(document.getElementById(childSnapshot2.key) !== null){
                            //console.log("WOO4")
                        document.getElementById(childSnapshot2.key).className = "fa fa-bookmark fa-1g bookmark";
                        }
                    });
                });
            }
          }
          else{
            window.location.reload()
          }

        });

          var userCollectionRef = firebase.database().ref('UserToCollection/' + uid)

          var myBtn = document.createElement('button');
          myBtn.innerHTML = user + "'s Uploads";
          myBtn.onclick = function() {
              arr=[];
            this.setState({
                items: []
            });

         ref.child("UserToMyBookmark/" + uid).once("value", snapshot =>{
           snapshot.forEach(function(childsnapshot){
              myArray.push(childsnapshot.key)
         });
         for(i = 0; i < myArray.length; i++){
             specificBookmark = myArray[i];

             ref.child("Bookmark/" + specificBookmark).once('value', function(bookSnapshot) {
                  if(bookSnapshot.val().gif !== "nil") {
                    isGifBool = true;
                    isImgBool = false;
                    isVideoBool = false;
                    isVideoYouBool = false;
                  }
                  else if(bookSnapshot.val().image !== "nil"){
                    isImgBool = true;
                    isGifBool = false;
                    isVideoBool = false;
                    isVideoYouBool = false;
                  }
                  else if(bookSnapshot.val().video !== "nil"){
                    isVideoBool = true;
                    isGifBool = false;
                    isImgBool = false;
                    isVideoYouBool = false;
                  }
                  else if(bookSnapshot.val().videoYoutube !== "nil"){
                    isVideoBool = false;
                    isVideoYouBool = true;
                    isGifBool = false;
                    isImgBool = false;
                  }

                  if(bookSnapshot.val().userImage === "nil"){
                      userImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
                  }
                  else{
                      userImg = bookSnapshot.val().userImage
                  }


                  arr.push({
                    bookedCount: bookSnapshot.val().bookedCount,
                    gif: bookSnapshot.val().gif,
                    image: bookSnapshot.val().image,
                    keyString: bookSnapshot.val().keyString,
                    postText: bookSnapshot.val().postText,
                    timeStamp: bookSnapshot.val().timeStamp,
                    title: bookSnapshot.val().title,
                    userPosted: bookSnapshot.val().userPosted,
                    video: bookSnapshot.val().video,
                    videoYoutube: bookSnapshot.val().videoYoutube,
                    userImage: userImg,
                    isGif: isGifBool,
                    isImg: isImgBool,
                    isVideo: isVideoBool,
                    isVideoYoutube: isVideoYouBool,
                  });
              });
         }
        if(this.state.isMounted){
          console.log("Triggered" + arr.length)

          this.setState({
            items: arr
          });

          let userForRef = firebase.auth().currentUser;
          if(userForRef !== null){
              let uidRef = userForRef.uid;
              ref.child("UserToBookmark/" + uidRef).once("value", snapshot => {
                  snapshot.forEach(function(childSnapshot2){
                      if(document.getElementById(childSnapshot2.key) !== null){
                      document.getElementById(childSnapshot2.key).className = "fa fa-bookmark fa-1g bookmark";
                      }
                  });
              });
          }
        }
        else{
          window.location.reload()
        }
      });

      return false;

    }.bind(this);
      myBtn.className = "buttonSpec";
      document.getElementById("buttonList").appendChild(myBtn);

      var bookmarkBtn = document.createElement('button');
      bookmarkBtn.innerHTML = user + "'s Bookmarks";
      bookmarkBtn.onclick = function() {
        arr=[];
      this.setState({
        items: []
      });

      ref.child("UserToBookmark/" + uid).once("value", snapshot =>{
         snapshot.forEach(function(childsnapshot){
             myArray.push(childsnapshot.key)
         });
         for(i = 0; i < myArray.length; i++){
             specificBookmark = myArray[i];

             ref.child("Bookmark/" + specificBookmark).once('value', function(bookSnapshot) {
                  if(bookSnapshot.val().gif !== "nil") {
                    isGifBool = true;
                    isImgBool = false;
                    isVideoBool = false;
                    isVideoYouBool = false;
                  }
                  else if(bookSnapshot.val().image !== "nil"){
                    isImgBool = true;
                    isGifBool = false;
                    isVideoBool = false;
                    isVideoYouBool = false;
                  }
                  else if(bookSnapshot.val().video !== "nil"){
                    isVideoBool = true;
                    isGifBool = false;
                    isImgBool = false;
                    isVideoYouBool = false;
                  }
                  else if(bookSnapshot.val().videoYoutube !== "nil"){
                    isVideoBool = false;
                    isVideoYouBool = true;
                    isGifBool = false;
                    isImgBool = false;
                  }

                  if(bookSnapshot.val().userImage === "nil"){
                      userImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
                  }
                  else{
                      userImg = bookSnapshot.val().userImage
                  }


                  arr.push({
                    bookedCount: bookSnapshot.val().bookedCount,
                    gif: bookSnapshot.val().gif,
                    image: bookSnapshot.val().image,
                    keyString: bookSnapshot.val().keyString,
                    postText: bookSnapshot.val().postText,
                    timeStamp: bookSnapshot.val().timeStamp,
                    title: bookSnapshot.val().title,
                    userPosted: bookSnapshot.val().userPosted,
                    video: bookSnapshot.val().video,
                    videoYoutube: bookSnapshot.val().videoYoutube,
                    userImage: userImg,
                    isGif: isGifBool,
                    isImg: isImgBool,
                    isVideo: isVideoBool,
                    isVideoYoutube: isVideoYouBool,
                  });
              });
         }
        if(this.state.isMounted){
          console.log("Triggered" + arr.length)

          this.setState({
            items: arr
          });

          let userForRef = firebase.auth().currentUser;
          if(userForRef !== null){
              let uidRef = userForRef.uid;
              ref.child("UserToBookmark/" + uidRef).once("value", snapshot => {
                  snapshot.forEach(function(childSnapshot2){
                      if(document.getElementById(childSnapshot2.key) !== null){
                      document.getElementById(childSnapshot2.key).className = "fa fa-bookmark fa-1g bookmark";
                      }
                  });
              });
          }
        }
        else{
          window.location.reload()
        }
      });

      return false;

    }.bind(this);
      bookmarkBtn.className = "buttonSpec";
      document.getElementById("buttonList").appendChild(bookmarkBtn);

      userCollectionRef.once('value', function(snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var collectionBtn = document.createElement('button');
          collectionBtn.innerHTML = childSnapshot.key
          collectionBtn.onclick = function() {
            arr=[];
          this.setState({
            items: []
          });

          ref.child("UserToCollection/" + uid + "/" + childSnapshot.key).once("value", snapshot =>{
             snapshot.forEach(function(childsnapshot){
                 myArray.push(childsnapshot.key)
             });
             for(i = 0; i < myArray.length; i++){
                 specificBookmark = myArray[i];

                 ref.child("Bookmark/" + specificBookmark).once('value', function(bookSnapshot) {
                      if(bookSnapshot.val().gif !== "nil") {
                        isGifBool = true;
                        isImgBool = false;
                        isVideoBool = false;
                        isVideoYouBool = false;
                      }
                      else if(bookSnapshot.val().image !== "nil"){
                        isImgBool = true;
                        isGifBool = false;
                        isVideoBool = false;
                        isVideoYouBool = false;
                      }
                      else if(bookSnapshot.val().video !== "nil"){
                        isVideoBool = true;
                        isGifBool = false;
                        isImgBool = false;
                        isVideoYouBool = false;
                      }
                      else if(bookSnapshot.val().videoYoutube !== "nil"){
                        isVideoBool = false;
                        isVideoYouBool = true;
                        isGifBool = false;
                        isImgBool = false;
                      }

                      if(bookSnapshot.val().userImage === "nil"){
                          userImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
                      }
                      else{
                          userImg = bookSnapshot.val().userImage
                      }


                      arr.push({
                        bookedCount: bookSnapshot.val().bookedCount,
                        gif: bookSnapshot.val().gif,
                        image: bookSnapshot.val().image,
                        keyString: bookSnapshot.val().keyString,
                        postText: bookSnapshot.val().postText,
                        timeStamp: bookSnapshot.val().timeStamp,
                        title: bookSnapshot.val().title,
                        userPosted: bookSnapshot.val().userPosted,
                        video: bookSnapshot.val().video,
                        videoYoutube: bookSnapshot.val().videoYoutube,
                        userImage: userImg,
                        isGif: isGifBool,
                        isImg: isImgBool,
                        isVideo: isVideoBool,
                        isVideoYoutube: isVideoYouBool,
                      });
                  });
             }
            if(this.state.isMounted){
              console.log("Triggered" + arr.length)

              this.setState({
                items: arr
              });

              let userForRef = firebase.auth().currentUser;
              if(userForRef !== null){
                  let uidRef = userForRef.uid;
                  ref.child("UserToBookmark/" + uidRef).once("value", snapshot => {
                      snapshot.forEach(function(childSnapshot2){
                          if(document.getElementById(childSnapshot2.key) !== null){
                          document.getElementById(childSnapshot2.key).className = "fa fa-bookmark fa-1g bookmark";
                          }
                      });
                  });
              }
            }
            else{
              window.location.reload()
            }
          });

          return false;

        }.bind(this);
          collectionBtn.className = "buttonSpec";
          document.getElementById("buttonList").appendChild(collectionBtn);
        }.bind(this));

      }.bind(this));

      var userRef = firebase.database().ref('User/' + uid);

      userRef.once('value', function(snapshot) {

        usernameString = snapshot.val().username;

        //var value = snapshot.val();

        image = snapshot.val().userImage;
        if(image === "nil"){
          image = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
        }

        bio = snapshot.val().userBio;
        document.getElementById('usernameText').innerHTML = user;
        document.getElementById('bioText').innerHTML = bio;
        document.getElementById('userPicture').src = image;
      });

      var userBookmarkRef = ref.child("UserToMyBookmark/" + uid +"/");
      userBookmarkRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          bookmarkArray.push(childSnapshot.key);
        });
        for(i = 0; i < bookmarkArray.length; i++){
          specificBookmark = bookmarkArray[i];
          refBook.child(specificBookmark).once('value', function(bookSnapshot) {
            this.setState({items:[]});
            if(bookSnapshot.val().gif !== "nil") {
              isGifBool = true;
              isImgBool = false;
              isVideoBool = false;
              isVideoYouBool = false;
            }
            else if(bookSnapshot.val().image !== "nil"){
              isImgBool = true;
              isGifBool = false;
              isVideoBool = false;
              isVideoYouBool = false;
            }
            else if(bookSnapshot.val().video !== "nil"){
              isVideoBool = true;
              isGifBool = false;
              isImgBool = false;
              isVideoYouBool = false;
            }
            else if(bookSnapshot.val().videoYoutube !== "nil"){
              isVideoBool = false;
              isVideoYouBool = true;
              isGifBool = false;
              isImgBool = false;
            }

            if(bookSnapshot.val().userImage === "nil"){
                userImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
            }
            else{
                userImg = bookSnapshot.val().userImage
            }
            arr.push({
              bookedCount: bookSnapshot.val().bookedCount,
              gif: bookSnapshot.val().gif,
              image: bookSnapshot.val().image,
              keyString: bookSnapshot.val().keyString,
              postText: bookSnapshot.val().postText,
              timeStamp: bookSnapshot.val().timeStamp,
              title: bookSnapshot.val().title,
              userPosted: bookSnapshot.val().userPosted,
              video: bookSnapshot.val().video,
              videoYoutube: bookSnapshot.val().videoYoutube,
              userImage: userImg,
              isGif: isGifBool,
              isImg: isImgBool,
              isVideo: isVideoBool,
              isVideoYoutube: isVideoYouBool,
            }); this.setState({ items:this.state.items.concat(arr)})
          }.bind(this));
          if(this.state.isMounted){
            this.setState({
              items: this.state.items.concat(arr)
            });

            let userForRef = firebase.auth().currentUser;
            if(userForRef !== null){
                let uidRef = userForRef.uid;
                ref.child("UserToBookmark/" + uidRef).once("value", snapshot => {
                    snapshot.forEach(function(childSnapshot2){

                        if(document.getElementById(childSnapshot2.key) !== null){
                        document.getElementById(childSnapshot2.key).className = "fa fa-bookmark fa-1g bookmark";
                        }
                    });
                });
            }
          }
          else{
            window.location.reload()
          }
        }
      }.bind(this));
  }.bind(this));
}

  componentWillUnmount(){
    this.setState({isMounted:false})
  }

  render () {
      console.log(this.props);
      const { params } = this.props.match;
      const { username } = params;
      user = username;
      console.log(username);
    return (
      <div>
        <div className="divStyleLeft">
          <img id="userPicture" alt=" " className="userImageStyle" src=""/>
          <label id='usernameText' className="userNameStyle"> {this.state.username} </label>
        </div>
        <div className="divStyleRight">
          <div className="divBioStyle">
            <p className="bioTextStyle" id='bioText'>Insert bio into here</p>
            <div className="collectionStyle">
              <div className="collectionButtons" id="buttonList">
              </div>
              <div className="collectionAdd">
                <FontAwesome onClick={() => {popMod();}} className="collectionAddAwesome" name="plus fa-2x" width="50px" height="50px" style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }} />
              </div>
            </div>

          </div>


        </div>
        <div className="feedStyle">
          <List items={this.state.items} />

        </div>
      </div>
    )
  }
}

var Node = require('react-if-comp');

const List = (props) => {
  return (
    <ul>
    { props.items.map( (item,i) => {
    return (
    <div>
      <div className="gallery">

        <div id={item.username} onClick={() => {goToPublicProfile(item);}} className='gallery-caption-title'>
          <img className='gallery-caption-userIcon' src={item.userImage}/>
        {item.userPosted}

        </div>

        <Node if={item.isImg} then={<img onClick={() => {popM(item, "image");}} className='gallery-img' alt=" " src={item.image}/> }/>

        <Node if={item.isVideo} then={<video onClick={() => {popM(item, "video");}} className='gallery-img' controls> <source src={item.video} type="video/mp4" /> </video>} />
        <Node if={item.isGif} then={<GifPlayer onClick={() => {popM(item, "gif");}} className='gallery-img' gif={item.gif} /> } />

        <Node if={item.isVideoYoutube} then={<div className='gallery-img'>
            <iframe onClick={() => {popM(item, "youtube");}} className='gallery-img' src={item.videoYoutube} frameBorder="0" ></iframe>
                </div>}/>

        <Node if={item.isVideoYoutube}>
          <Node then>
                <div className='gallery-caption'>
                  <div onClick={() => {popM(item, "youtube");}} height='auto' className='pull-left'>{item.title}</div>
                  <FontAwesome onClick={(e) => {addCollections(e, item);}} className="addCollectionIcon" id='collection' name="plus" size='1g' style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}/>
                  <FontAwesome onClick={(e) => {addBookmark(e, item);}} className="addCollectionIcon" id={item.keyString} name="bookmark-o" size='1g' style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}/>
                  <p className='bookedCount'> {item.bookedCount}</p>
                </div>
                  <div className='addCollections' id={item.timeStamp}>
                    <div id={item.timeStamp} className="collectionButtonsFeed">
                    </div>
                </div>

         </Node>

          <Node else><div className='gallery-caption'>{item.title}
              <FontAwesome onClick={(e) => {addCollections(e, item);}}  className="addCollectionIcon" id='collection' name="plus" size='2' style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}/>
              <FontAwesome onClick={(e) => {addBookmark(e, item);}} className="bookmark" id={item.keyString} name="bookmark-o" size='1g' style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}/>
              <p className='bookedCount'> {item.bookedCount}</p>
            </div>
                <div className='addCollections' id={item.timeStamp}>
                    <div id={item.timeStamp} className="collectionButtonsFeed">
                    </div>
                </div>
            </Node>
        </Node>

      </div>

      <div id="pModalImg" className="modal">
        <span onClick={closeP} className="close">×</span>

        <img id="modImg" src="" alt="" className="modal-content">
        </img>
        <div className='modal-content-detail-bottom'>
           <p id="pmodImgDesc" height='auto'></p>
           <p id='pmodImgTime' height='auto'></p>
        </div>

      </div>



      <div id="pModalVid" className="modal">
           <span onClick={closeP} className="close">×</span>

           <video className='modal-content' id='videoPlayer' controls="controls" name="gallery-mg"> <source id="mp4Source" src="" type="video/mp4"/> </video>

           <div className='modal-content-detail-bottom-vid'>
           <p id="pmodVidDesc" height='auto'></p>
           <p id="pmodVidTime" height='auto'></p>
           </div>

      </div>

      <div id="pModalYoutube" className="modal">
        <span onClick={closeP} className="close">×</span>
        <iframe id='modYou' frameBorder = "0" className='gallery-vid-you' src=''> </iframe>

        <div className='modal-content-detail-bottom-vid'>
           <p id="pmodVidYouDesc" height='auto'></p>
           <p id="pmodVidYouTime" height='auto'></p>
           </div>
      </div>

      <div id="pModalGif" className="modal">
        <span onClick={closeP} className="close">×</span>
        <GifPlayer id="modGif" src="" className="modal-content" />

        <div className='modal-content-detail-bottom-vid'>
           <p id="pmodGifDesc" height='auto'></p>
           <p id="pmodGifTime" height='auto'></p>
           </div>
      </div>


    </div>
    )
    })}
    </ul>
  )
}
