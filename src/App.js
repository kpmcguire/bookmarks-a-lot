import React, { Component, useState, useEffect } from "react";
import "./App.scss";
import firebase from "./Firebase";
import {Router, navigate} from "@reach/router"
import BookmarksList from "./BookmarksList";
import Edit from "./components/Edit";
import Create from "./components/Create";
import Show from "./components/Show";
import Register from "./components/Register";
import Login from "./components/Login";
import Navigation from "./components/Navigation"
import Bookmarklet from "./components/Bookmarklet"

let db;

const App = () => {

  const [state, setState] = useState({
    bookmarks: [],
    perPage: 10,
    limit: 10,
    numBookmarksShown: 0,
    totalNumBookmarks: 0,
    shouldShowPagination: false,

  });
  
  const [user, setUser] = useState({
    user: null,
    displayName: null,
    userID: null,
  })
  
  useEffect(() => {

    firebase.auth().onAuthStateChanged((FBUser) => {
      if (FBUser) {
        setUser({
        ...user,
        user: firebase.auth().currentUser,
        displayName: firebase.auth().currentUser.displayName,
        userID: firebase.auth().currentUser.uid,
      })      
  
      } else {
        setUser({ ...user, user: null, displayName: null, userID: null });
      }
    });
              
  },[]);
  
  useEffect(() => {
      if(user) {
        db = firebase.firestore().collection("bookmarks");
  
        db.where("owner", "==", user.userID).get().then(snap => {
            setState({ ...state, totalNumBookmarks: snap.size, shouldShowPagination: true });
        });
      }
  }, [user]);

  useEffect(() => {
      if(state) {
        loadBookMarks();
      }
  }, [state]);

  
  const registerUser = (userName) => {
    firebase.auth().onAuthStateChanged((FBUser) => {
      FBUser.updateProfile({
        displayName: userName,
      }).then(() => {
        setState({
          ...state,
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
        });
  
        navigate("/");
      });
    });
  };
  
  const logOutUser = (e) => {
    e.preventDefault();
    setState({
      ...state,
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
  
  const loadBookMarks = () => {
    
    db
      .where("owner", "==", user.userID)
      .limit(state.limit)
      .onSnapshot(snapshot => {  
            
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
    
    setState({...state, numBookmarksShown: bookmarks.length, bookmarks});
    });
  };
  
  const onNextPage = () => {
    setState({...state, limit: state.limit + state.perPage})
    loadBookMarks()
  };

  return (
    <div className="content flex flex-col flex-1">
      <Navigation user={user.user} logOutUser={logOutUser} />
      <div className="main mx-auto flex-1 p-5 w-full">
        <Router>
          {user.user && (
            <BookmarksList path="/" bookmarks={state.bookmarks} displayName={user.displayName} onNextPage={onNextPage} numBookmarksShown={state.numBookmarksShown} totalNumBookmarks={state.totalNumBookmarks} />
          )}
          
          <Edit path="/edit/:id" userID={user.userID} />
          <Create path="/create" userID={user.userID} />
          <Show path="/show/:id" userID={user.userID} />
          <Bookmarklet path="/bookmarklet" />
          <Login path="/login" />
          <Register path="/register" registerUser={registerUser} />
        </Router>
  

      </div>
      <div className="footer flex-shrink-0 bg-gray-800 p-5">
        <p className="text-white">
          For Bookmarking websites, homepages, portals, etc.
        </p>
      </div>
    </div>
  )
}

export default App;
