import React, { Component } from "react";
import firebase from "../Firebase";
import {Link, navigate} from "@reach/router"
import {FaSpinner} from 'react-icons/fa'


class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmark: {},
      key: "",
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({isLoading: true})
    let docRef = firebase
      .firestore()
      .collection("bookmarks")
      .doc(this.props.id);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
        this.setState({
          bookmark: doc.data(),
          key: doc.id,
          isLoading: false
        });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  delete(id) {
    firebase
      .firestore()
      .collection("bookmarks")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        navigate('/')
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }



  render() {

    if (this.state.isLoading === true) {
      return(<FaSpinner className="loading-spinner"></FaSpinner>)
    } else {

    const { owner, isPublic, name, notes, rating, url, thumbnail } = this.state.bookmark;

    if ((owner === this.props.userID || isPublic === 'true')) {
      return (
        <div className="container">
          <dl>
            <dt>Name:</dt>
            <dd>{name}</dd>
            <dt>Owner:</dt>
            <dd>{owner}</dd>
            <dt>URL:</dt>
            <dd>{url}</dd>
            <dt>rating:</dt>
            <dd>{rating}</dd>
            <dt>public:</dt>
            <dd>{isPublic}</dd>
            <dt>notes:</dt>
            <dd>{notes}</dd>
            <dt>thumbnail:</dt>
            <dd>
              <img src={thumbnail} width="100"></img>
            </dd>
          </dl>
          {this.props.userID && (
            <span className="">
              <Link
                to={`/edit/${this.state.key}`}
                className="bg-blue-700 hover:bg-blue-900 active:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 inline-block mr-2"
              >
                Edit
              </Link>
              <button
                onClick={this.delete.bind(this, this.state.key)}
                className="bg-red-700 hover:bg-red-900 active:bg-red-500 text-white font-bold py-2 px-4 rounded my-2 inline-block"
              >
                Delete
              </button>
            </span>
          )}
        </div>
      );
    } else {
      return (<p>This bookmark is private.</p>)
    }}
  }
}

export default Show;
