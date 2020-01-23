import React, { Component } from "react";
import firebase from "../Firebase";
import {navigate, Link} from "@reach/router"
// import Form from './form'
import FileUploader from 'react-firebase-file-uploader'

class Create extends Component {
  constructor() {
    super()
    this.ref = firebase.firestore().collection("bookmarks")
    this.state = {
      owner: "",
      isPublic: false,
      name: "",
      notes: "",
      rating: "",
      url: "",
      thumbnail: ""
    }
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {
      if (FBUser) {
        this.setState({
          owner: FBUser.uid
        });
      }
    })
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();

    const { owner, isPublic, name, notes, rating, url, thumbnail } = this.state

    this.ref
      .add({
        owner,
        isPublic,
        name,
        notes,
        rating,
        url,
        thumbnail
      })
      .then(docRef => {
        this.setState({
          owner: '',
          isPublic: '',
          name: '',
          notes: '',
          rating: '',
          url: '',
          thumbnail: ''
        });
        navigate("/");
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase
      .storage()
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ thumbnail: url }));
  };  

  render() {
    const { owner, isPublic, name, notes, rating, url, thumbnail } = this.state;
    return (
      <div>
        <h1 className="text-xl font-bold">Create Bookmark</h1>

        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="name"
              id="name"
              value={name}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="url"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              URL:
            </label>
            <input
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="url"
              id="url"
              value={url}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="notes"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Notes:
            </label>
            <textarea
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="notes"
              id="notes"
              onChange={this.onChange}
              value={notes}
            ></textarea>
          </div>
          <div className="form-group">
            <label
              htmlFor="rating"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Rating:
            </label>
            <input
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              name="rating"
              id="rating"
              value={rating}
              onChange={this.onChange}
            />
          </div>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Public
            <input
              type="radio"
              name="isPublic"
              value="true"
              onChange={this.onChange}
              className="ml-2"
              checked="true"
            />
          </label>

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Private
            <input
              type="radio"
              name="isPublic"
              value="false"
              onChange={this.onChange}
              className="ml-2"
            />
          </label>
          <FileUploader
            accept="image/*"
            name="thumbnail"
            randomizeFilename
            storageRef={firebase.storage().ref("images")}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
          <div>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-900 active:bg-blue-500 text-white font-bold py-2 px-4 rounded my-2 inline-block"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Create;
