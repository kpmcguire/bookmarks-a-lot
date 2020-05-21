import React, { Component } from "react";
import "./App.scss";
import firebase from "./Firebase";
import {Router, navigate, Link} from "@reach/router"
import BookmarksList from "./BookmarksList";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Show from "./components/Show";
import Register from "./components/Register";
import Login from "./components/Login";
import Navigation from "./components/Navigation"
import Bookmarklet from "./components/Bookmarklet"

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("bookmarks");
    this.bort = null;
    this.state = {
      bookmarks: []
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {
      if (FBUser) {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });
        this.bort = this.ref
        .where('owner', '==', this.state.userID)
        .onSnapshot((querySnapshot) => {
          const bookmarks = [];
          querySnapshot.forEach(function(doc) {
            const { owner, isPublic, name, notes, rating, url, thumbnail } = doc.data();
            bookmarks.push({
              key: doc.id,
              doc, // DocumentSnapshot
              owner,
              isPublic,
              name,
              notes,
              rating,
              url,
              thumbnail
            });
          });
          this.setState({
            bookmarks
          });
        });

      } else {
        this.setState({ user: null, displayName: null, userID: null });
      }
    });
  }

  registerUser = userName => {
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName
      }).then(() => {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        });

        navigate("/");
      });
    });
  };

  logOutUser = e => {
    e.preventDefault();
    this.setState({
      displayName: null,
      userID: null,
      user: null
    });

    firebase.auth().signOut().then(() => {
        navigate("/login");
    })

  };

  render() {
    return (
      <div className="content flex flex-col flex-1">
        <Navigation user={this.state.user} logOutUser={this.logOutUser} />
        <div className="main mx-auto flex-1 p-5 w-full">
          <Router>
            {this.state.user && (
              <BookmarksList path="/" bookmarks={this.state.bookmarks} />
            )}

            <Edit path="/edit/:id" userID={this.state.userID} />
            <Create path="/create" userID={this.state.userID} />
            <Show path="/show/:id" userID={this.state.userID} />
            <Bookmarklet path="/bookmarklet"/>
            <Login path="/login" />
            <Register path="/register" registerUser={this.registerUser} />

          </Router>
        </div>
        <div className="footer flex-shrink-0 bg-gray-800 p-5">
          <p className="text-white">For Bookmarking websites, homepages, portals, etc.</p>
        </div>
      </div>
    );
  }
}

export default App;
