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
    this.state = {
      bookmarks: [],
      lastVisible: null,
      firstVisible: null,
      prev: false,
      next: true,
      disableNext: false,
      disablePrev: true,
      pageLength: 10,
      firstEverRecord: null,
      querySize: null,
      showPagination: null
    };
  }



  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {
      if (FBUser) {
        let shouldShowPagination = false;
        if(window.location.pathname === '/') {
          shouldShowPagination = true
        }

        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
          showPagination: shouldShowPagination
        }, ()=>{
          this.loadBookMarks();
        });
      
      } else {
        this.setState({ user: null, displayName: null, userID: null });
      }
    });
    
    globalHistory.listen(({ action }) => {
      if (action === 'PUSH') {
        let shouldShowPagination = false;

        if(window.location.pathname === '/') {
          shouldShowPagination = true  
        }

        this.setState({
          showPagination: shouldShowPagination
        })
      }
    })
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

  loadNext = () => {
    this.setState({
      next: true,
      prev: false,
    }, ()=>{
      this.loadBookMarks()
    })
  }

  loadPrev = () => {
    this.setState({
      next: false,
      prev: true
    }, ()=>{
      this.loadBookMarks()
    })
  }

  loadBookMarks = () => {
    this.temp = this.ref
      .where("owner", "==", this.state.userID)
      .orderBy("name");

      if (this.state.next === true) {
        this.temp = this.temp.startAfter(this.state.lastVisible)
        this.temp = this.temp.limit(this.state.pageLength)
      } else if (this.state.prev === true) {

        this.temp = this.temp.endBefore(this.state.firstVisible)
        this.temp = this.temp.limitToLast(this.state.pageLength)
      } else {
        this.temp = this.temp.limit(this.state.pageLength);
      }

      this.temp.onSnapshot((querySnapshot) => {

        this.setState({
          querySize: querySnapshot.size
        });
        
        var firstVisible = querySnapshot.docs[0]

        if (this.state.firstEverRecord == null) {
          this.setState({
            firstEverRecord: firstVisible
          })
        }

        this.setState({
          firstVisible: firstVisible,
        })

        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
        this.setState({
          lastVisible: lastVisible,
        })


        if (this.state.firstVisible.get('id') === this.state.firstEverRecord.get('id')) {

          this.setState({
            disableNext: false,
            disablePrev: true
          })
        } else {
          this.setState({
            disableNext: false,
            disablePrev: false
          })
        }

        if (this.state.querySize < this.state.pageLength) {
          this.setState({
            disableNext: true,
            disablePrev: false
          })
        }

        const bookmarks = [];
        querySnapshot.forEach(function (doc) {
          const {
            owner,
            isPublic,
            name,
            notes,
            rating,
            url,
            thumbnail,
          } = doc.data();
          bookmarks.push({
            key: doc.id,
            doc, // DocumentSnapshot
            owner,
            isPublic,
            name,
            notes,
            rating,
            url,
            thumbnail,
          });
        });
        this.setState({
          bookmarks,
        });
      });
  }

  render() {
    
    return (
      <div className="content flex flex-col flex-1">
        <Navigation user={this.state.user} logOutUser={this.logOutUser} />
        <div className="main mx-auto flex-1 p-5 w-full">
          <Router onChange={this.updateLocation}>
            {this.state.user && (
              <BookmarksList path="/" bookmarks={this.state.bookmarks} />
            )}

            <Edit path="/edit/:id" userID={this.state.userID} />
            <Create path="/create" userID={this.state.userID} />
            <Show path="/show/:id" userID={this.state.userID} />
            <Bookmarklet path="/bookmarklet" />
            <Login path="/login" />
            <Register path="/register" registerUser={this.registerUser} />
          </Router>

          {this.state.showPagination && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-auto text-left">
                <button
                  className={
                    "bg-green-700 hover:bg-green-900 active:bg-green-500 text-white font-bold py-2 px-4 rounded my-2 " +
                    (this.state.disablePrev ? "hidden" : "")
                  }
                  onClick={this.loadPrev}
                >
                  Previous
                </button>
              </div>
              <div className="col-auto text-right">
                <button
                  className={
                    "bg-green-700 hover:bg-green-900 active:bg-green-500 text-white font-bold py-2 px-4 rounded my-2 " +
                    (this.state.disableNext ? "hidden" : "")
                  }
                  onClick={this.loadNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
