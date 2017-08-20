import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { Route, BrowserRouter, Link, Redirect, Switch, browserHistory } from 'react-router-dom'
import PublicProfile from './PublicProfile'
import Register from './Register'
import Home from './Home'
import Feed from './protected/Feed'
import UserProfile from './UserProfile'
import EditUserProfile from './protected/EditUserProfile'
import AddBookmark from './AddBookmark'
import detail from './detail'
import { logout } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'
import Dropdown, { DropdownTrigger, DropdownContent } from '../../node_modules/react-simple-dropdown/lib/components/Dropdown.js';
import icon from '../Images/icon.svg';
import addIcon from '../Images/addIcon.svg';
import logoIcon from '../Images/logo.png';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
	<Route
	  {...rest}
	  render={(props) => authed === true
		? <Component {...props} />
		: <Redirect to={{pathname: '/home', state: {from: props.location}}} />}
	/>
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
	<Route
	  {...rest}
	  render={(props) => authed === false
		? <Component {...props} />
		: <Redirect to='/feed' />}
	/>
  )
}

export default class App extends Component {
  state = {
		authed: false,
		loading: true,
		popupIsOpen: false,
		onPopupDiv: false
  }

	openPopup() {
		this.setState({popupIsOpen: !this.state.popupIsOpen});
		console.log(this.state.popupIsOpen);
		//document.body.setAttribute("class", "popupBackground");
		//document.getElementById("navBar").setAttribute("class", "popupBackground");
	}

	closePopup() {
		//this.setState({popupIsOpen: false});
	}

  componentDidMount () {
	this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
	  if (user) {
		this.setState({
		  authed: true,
		  loading: false,
		})
	  } else {
		this.setState({
		  loading: false
		})
	  }
	})
  }
  componentWillUnmount () {
	this.removeListener()
  }

  render() {
	return this.state.loading === true ? <h1>Loading</h1> : (
	  <BrowserRouter history={browserHistory}>
		<div id="overallDiv" className="overallDivStyle" onClick={this.closePopup.bind(this)}>
		  <nav id="navBar" className="navbar navbar-default navbar-fixed-top">
			<div className="container">
			  <div className="navbar-header">
				<Link to="/feed" className="navbar-brand"><img src={logoIcon} className="logoIMG" width="125vw" height="125vw" alt="Home"/></Link>
			  </div>
				<div className="user-control">
				  {this.state.authed
					?<Dropdown className="account-menu" ref="dropdown">
              <img className="add-icon" width="34" onClick={this.openPopup.bind(this)} height="34" src={addIcon} alt="Add Icon"/>
						  <DropdownTrigger>
							<img className="account-icon" width="60" height="60" src={icon} alt=" "/>
						  </DropdownTrigger>
						   <DropdownContent className="dropdowncont">
							   <Link to="/feed" className="dropdowntext" ><p>Feed</p></Link>
                 <Link to="/add" className="dropdowntext"><p>Add Test</p></Link>
							   <Link to="/userprofile" className="dropdowntext"><p>User Profile</p></Link>
							   <Link to="/edituserprofile" className="dropdowntext"><p>Edit Profile</p></Link>
                 <Link to="/publicprofile/:username" className="dropdowntext"><p>User</p></Link>
                <button
							  style={{border:'none', float:'right', width:'80px', background: 'transparent'}}
							  onClick={() => {
								logout()
								this.setState({authed: false})
							  }}
							  className="dropdowntext">Logout</button>
					   </DropdownContent>
					   </Dropdown>
					: <span>
					  </span>}
			  </div>
			</div>
		  </nav>
			{this.state.popupIsOpen &&
			<div id="popupDiv">
					<div className="popupAdd">
						<AddBookmark/>
					</div>
		  </div>
			}
		  <div className="container">
			<div className="row">
			  <Switch>
        <Route path="/publicprofile/:username" component={PublicProfile} name="publicprofile"/>
				<PublicRoute authed={this.state.authed} path='/home' component={Home} />
				<PublicRoute authed={this.state.authed} path='/register' component={Register} />
				<PrivateRoute authed={this.state.authed} path='/feed' component={Feed}/>
        <PrivateRoute authed={this.state.authed} path='/add' component={AddBookmark} />
				<PrivateRoute authed={this.state.authed} path='/userprofile' component={UserProfile} />
				<PrivateRoute authed={this.state.authed} path='/edituserprofile' component={EditUserProfile} />
				<PrivateRoute authed={this.state.authed} path='/detail' component={detail} />
			  </Switch>
			</div>
		  </div>
		</div>
	  </BrowserRouter>
	);
  }
}
