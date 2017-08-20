import React, { Component, PropTypes } from 'react';
import BookmarkList from '../../components/BookmarkList';
import SearchBar from '../../components/SearchBar';
import request from 'superagent';
import '../../index.css';
import { ref , refBook } from '../../config/constants';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import YoutubePlayer from 'react-youtube-player';
import {Icon} from 'react-fa'
import firebase from 'firebase'
import { browserHistory, withRouter, router, ReactRouter } from 'react-router'

var GifPlayer = require('react-gif-player');
var ReactDatalist = require('react-datalist');
//var browserHistory2 = ReactRouter.browserHistory;
// Initializing values
var onplaying = true;
var onpause = false;

var FontAwesome = require('react-fontawesome');
//https://www.npmjs.com/package/react-gif-player
var router2 = require('../index.js');

var emailArray = [];
var userRef = ref.child('User').orderByChild('email');
userRef.once('value').then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {

    var emailVal= childSnapshot.child('email').val();

    emailArray.push(emailVal);

    });
  });


function parseTime(item)
{
    var str = item.timeStamp.split(" ", 4);
    var res = str[0] + " " + str[1]  + " " + str[2]  + " " + str[3];
    return res;
}

function setUserIcon(e, item) {
  console.log(e);
    console.log('-----EVENT---');
    console.log(item);
    //var object = event.target;
    //object.src = 'http://www.freeiconspng.com/free-images/profile-icon-png-898';
  
}

function addCollections(event, item) {
    console.log(event);
    console.log('----ADD COllections');
    console.log(item);
    
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
    console.log('GO TO PUBLIC PROFILE DAMMNIT');
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

  console.log(item.postText);
  var title = item.title;
  console.log(item.title);
  //document.getElementById(title).className="fa fa-bookmark fa-1.5x pull-right"
  var object = event.target;
  console.log(object);
    
    
  if(object.className === "fa fa-bookmark fa-1g bookmark"){
      object.className = "fa fa-bookmark-o fa-1g bookmark";
      subtractBookedCountFirebase(item.keyString, item.bookedCount);
      
  }
    else{
        object.className = "fa fa-bookmark fa-1g bookmark";
        addBookedCountFirebase(item.keyString, item.bookedCount);
        
        
    }

}

function popM(item, type) {
  if(type === "image"){
    console.log("image" + item.image);
    document.getElementById("pModalImg").style.display = "block";
    document.getElementById('modImg').src = item.image;
    var description = "<b>Description:  </b>" + item.postText;  
    document.getElementById('pmodImgDesc').innerHTML=description;
    var res = parseTime(item);
    document.getElementById('pmodImgTime').innerHTML=res;
    console.log('description:' + description);
  }
  else if(type === "video"){

    //isYoutubeVideo(item.video);
    //console.log(item.video);
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
    //document.getElementById('modVid').src = item.video;
    //console.log(document.getElementById('modVid').src);
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
    console.log("gif" + item.gif);
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
  //var playerY = document.getElementById('modYou');
  //playerY.pauseVideo();

  var player2 = YoutubePlayer;
  player2 = document.getElementById('modYou');
  //player2.pause();
  console.log("Youtube player element: " + player2);
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
export default class Feed extends Component {
    
 
    
  constructor(props) {
    super(props);

    this.state = {
      isMounted:false,
      gifs: [],
      items: [],
    };
  }

  componentDidMount(){
    this.setState({isMounted: true})
    var arr = [];
      var count = 0;
       
    refBook.on('value', snapshot => {
      this.setState({items:[]});
        arr = [];
      var isGifBool, isImgBool, isVideoBool, isVideoYouBool, userImg;
      console.log(count + "1");
        count = count + 1
        console.log(count + "2")
        if(count === 1){
            snapshot.forEach(function(childSnapshot) {
              this.setState({items:[]});


            if(childSnapshot.val().gif !== "nil"){
              isGifBool = true;
              isImgBool = false;
              isVideoBool = false;
              isVideoYouBool = false;
            }
            else if(childSnapshot.val().image !== "nil"){
              isImgBool = true;
              isGifBool = false;
              isVideoBool = false;
              isVideoYouBool = false;
            }
            else if(childSnapshot.val().video !== "nil"){
              isVideoBool = true;
              isVideoYouBool = false;
              isGifBool = false;
              isImgBool = false;
            }
            else if(childSnapshot.val().videoYoutube !== "nil"){
              isVideoBool = false;
              isVideoYouBool = true;
              isGifBool = false;
              isImgBool = false;
            }
            if(childSnapshot.val().userImage === "nil"){
                userImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
            }
            else{
                userImg = childSnapshot.val().userImage
            }
            arr.push({
              bookedCount: childSnapshot.val().bookedCount,
              gif: childSnapshot.val().gif,
              image: childSnapshot.val().image,
              keyString: childSnapshot.val().keyString,
              postText: childSnapshot.val().postText,
              timeStamp: childSnapshot.val().timeStamp,
              title: childSnapshot.val().title,
              userPosted: childSnapshot.val().userPosted,
              video: childSnapshot.val().video,
              videoYoutube: childSnapshot.val().videoYoutube,
              userImage: userImg,
              isGif: isGifBool,
              isImg: isImgBool,
              isVideo: isVideoBool,
              isVideoYoutube: isVideoYouBool,
            });
          }.bind(this));
          if(this.state.isMounted){
            console.log("Triggered")
            console.log("")
            this.setState({
              items: this.state.items.concat(arr)
            });
            
            console.log("WOO1")
            let userForRef = firebase.auth().currentUser;
            if(userForRef !== null){
                console.log("WOO2")
                let uidRef = userForRef.uid;
                ref.child("UserToBookmark/" + uidRef).once("value", snapshot => {
                    snapshot.forEach(function(childSnapshot2){
                        
                        console.log("WOO3")
                        if(document.getElementById(childSnapshot2.key) !== null){
                            console.log("WOO4")
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
        else{
            this.setState({items:[]});
            snapshot.forEach(function(childSnapshot) {
              this.setState({items:[]});


            if(childSnapshot.val().gif !== "nil"){
              isGifBool = true;
              isImgBool = false;
              isVideoBool = false;
              isVideoYouBool = false;
            }
            else if(childSnapshot.val().image !== "nil"){
              isImgBool = true;
              isGifBool = false;
              isVideoBool = false;
              isVideoYouBool = false;
            }
            else if(childSnapshot.val().video !== "nil"){
              isVideoBool = true;
              isVideoYouBool = false;
              isGifBool = false;
              isImgBool = false;
            }
            else if(childSnapshot.val().videoYoutube !== "nil"){
              isVideoBool = false;
              isVideoYouBool = true;
              isGifBool = false;
              isImgBool = false;
            }
            if(childSnapshot.val().userImage === "nil"){
                userImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Anonymous_emblem.svg/1000px-Anonymous_emblem.svg.png";
            }
            else{
                userImg = childSnapshot.val().userImage
            }
            arr.push({
              bookedCount: childSnapshot.val().bookedCount,
              gif: childSnapshot.val().gif,
              image: childSnapshot.val().image,
              keyString: childSnapshot.val().keyString,
              postText: childSnapshot.val().postText,
              timeStamp: childSnapshot.val().timeStamp,
              title: childSnapshot.val().title,
              userPosted: childSnapshot.val().userPosted,
              video: childSnapshot.val().video,
              videoYoutube: childSnapshot.val().videoYoutube,
              userImage: userImg,
              isGif: isGifBool,
              isImg: isImgBool,
              isVideo: isVideoBool,
              isVideoYoutube: isVideoYouBool,
            });
          }.bind(this));
          if(this.state.isMounted){
            for(var k = 0; k<arr.length; k++){
                console.log(arr[k])
            }
            this.setState({items:arr});
          }
          else{
            window.location.reload()
          }
            let userForRef = firebase.auth().currentUser;
            if(userForRef !== null){
                console.log("WOO2")
                let uidRef = userForRef.uid;
                ref.child("UserToBookmark/" + uidRef).once("value", snapshot => {
                    snapshot.forEach(function(childSnapshot2){
                        
                        console.log("WOO3")
                        if(document.getElementById(childSnapshot2.key) !== null){
                            console.log("WOO4")
                        document.getElementById(childSnapshot2.key).className = "fa fa-bookmark fa-1g bookmark";
                        }
                    });
                });
            }
        }
        let userForRef = firebase.auth().currentUser;
            if(userForRef !== null){
                console.log("WOO2")
                let uidRef = userForRef.uid;
                ref.child("UserToBookmark/" + uidRef).once("value", snapshot => {
                    snapshot.forEach(function(childSnapshot2){
                        
                        console.log("WOO3")
                        if(document.getElementById(childSnapshot2.key) !== null){
                            console.log("WOO4")
                        document.getElementById(childSnapshot2.key).className = "fa fa-bookmark fa-1g bookmark";
                        }
                    });
                });
            }
        
    });
  }

  componentWillUnmount(){
    this.setState({isMounted:false})
    
  }

  handleTermChange = (term) => {
    const url = `http://api.giphy.com/v1/gifs/search?q=${term.replace(/\s/g, '+')}&api_key=dc6zaTOxFJmzC`;
    request.get(url, (err, res) => {
      this.setState({ gifs: res.body.data })
    });
  };



  render () {
/*CSS stuff */
    return (
      <div>
        <div className="searchStyle">
          <SearchBar onTermChange={this.handleTermChange} />
        </div>
        <BookmarkList gifs={this.state.gifs} />
        <List items={this.state.items} />
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

Feed.contextTypes = {
    router: PropTypes.object.isRequired
};
