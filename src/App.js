import React, { Component } from "react";
import "./App.scss";
import firebase from "./Firebase";
import {Router, navigate, globalHistory} from "@reach/router"
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
    this.temp = null;
    this.boxTop = React.createRef();
    this.state = {
      bookmarks: [],
      limit: 10,
      numBookmarksShown: 0,
      totalNumBookmarks: 0,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((FBUser) => {
      if (FBUser) {

        this.setState(
          {
            user: FBUser,
            displayName: FBUser.displayName,
            userID: FBUser.uid,
          },
          () => {
            
            this.ref = firebase.firestore().collection("bookmarks");
                    
            this.ref.where("owner", "==", this.state.userID).get().then(snap => {
              // setState({numBookmarksShown: snap.size});
              this.state.numBookmarksShown = snap.size;
            });
            
            this.loadBookMarks();
          }
        );
      } else {
        this.setState({ user: null, displayName: null, userID: null });
      }
    });
  }

  registerUser = (userName) => {
    firebase.auth().onAuthStateChanged((FBUser) => {
      FBUser.updateProfile({
        displayName: userName,
      }).then(() => {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
        });

        navigate("/");
      });
    });
  };

  logOutUser = (e) => {
    e.preventDefault();
    this.setState({
      displayName: null,
      userID: null,
      user: null,
    });
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate("/login");
      });
  };

  loadBookMarks = () => {
    this.ref
      .where("owner", "==", this.state.userID)
      .limit(this.state.limit)
      .onSnapshot(snapshot => {  
    this.setState({totalNumBookmarks: snapshot.size});
    
    const bookmarks = [];
    
    snapshot.forEach(doc => {
      const {
      owner,
      isPublic,
      name,
      notes,
      rating,
      url,
      thumbnail
      } = doc.data();
      
      bookmarks.push({
      key: doc.id,
      doc,
      owner,
      isPublic,
      name,
      notes,
      rating,
      url,
      thumbnail,
      });
    });
    
    this.setState({bookmarks});
    });
  };
  
  onNextPage = () => {
    this.setState({limit: this.state.limit * 2})
    this.loadBookMarks()
  };

  render() {
    return (
      <div className="content flex flex-col flex-1">
        <Navigation user={this.state.user} logOutUser={this.logOutUser} />
        <div className="main mx-auto flex-1 p-5 w-full">
          <Router onChange={this.updateLocation}>
            {this.state.user && (
              <BookmarksList path="/" bookmarks={this.state.bookmarks} displayName={this.state.displayName} />
            )}

            <Edit path="/edit/:id" userID={this.state.userID} />
            <Create path="/create" userID={this.state.userID} />
            <Show path="/show/:id" userID={this.state.userID} />
            <Bookmarklet path="/bookmarklet" />
            <Login path="/login" />
            <Register path="/register" registerUser={this.registerUser} />
          </Router>

          {this.state.numBookmarksShown !== this.state.totalNumBookmarks && 
            
            <button type="button" onClick={this.onNextPage} className={
            "bg-green-700 hover:bg-green-900 active:bg-green-500 text-white font-bold py-2 px-4 rounded my-2"}>
              Load more
            </button>
          }
        </div>
        <div className="footer flex-shrink-0 bg-gray-800 p-5">
          <p className="text-white">
            For Bookmarking websites, homepages, portals, etc.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
